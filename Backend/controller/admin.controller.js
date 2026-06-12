import catchAsync from '../catchAsync.js';
import AppError from '../AppError.js';
import User from '../modules/user.model.js';
import jwt from 'jsonwebtoken';
import Job from '../modules/job.model.js'; // Standardized import
import AuditLog from '../modules/auditLog.model.js'; // Standardized import

/**
 * Get all users with filtering and pagination
 */
export const getAllUsers = catchAsync(async (req, res, next) => {
  const { role, status, page = 1, limit = 10, search } = req.query;
  
  const query = { role: { $ne: 'admin' } }; // Never return other admins
  
  if (role) query.role = role;
  if (status) query.status = status;
  if (search) {
    query.$or = [
      { fullname: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  const users = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await User.countDocuments(query);

  res.status(200).json({
    success: true,
    total,
    users
  });
});

/**
 * Toggle user activation status and log the action
 */
export const toggleUserStatus = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const { status } = req.body; // 'active' or 'deactivated'

  const user = await User.findByIdAndUpdate(userId, { status }, { new: true });

  if (!user) return next(new AppError("User not found", 404));

  // Log the administrative action
  await AuditLog.create({
    adminId: req.id,
    action: `USER_${status.toUpperCase()}`,
    targetId: userId,
    targetModel: 'User',
    details: { email: user.email },
    ipAddress: req.ip
  });

  res.status(200).json({ 
    success: true, 
    message: `User ${status === 'active' ? 'activated' : 'deactivated'} successfully.` 
  });
});

/**
 * Global stats for Admin Dashboard
 */
export const getAdminStats = catchAsync(async (req, res, next) => {
  const [candidates, recruiters, totalJobs, activeJobs, recentLogs] = await Promise.all([
    User.countDocuments({ role: 'candidate' }),
    User.countDocuments({ role: 'recruiter' }),
    Job.countDocuments(),
    Job.countDocuments({ status: 'active' }),
    AuditLog.find()
      .populate('adminId', 'fullname')
      .sort({ createdAt: -1 })
      .limit(5)
  ]);

  res.status(200).json({
    success: true,
    stats: {
      candidates,
      recruiters,
      totalJobs,
      activeJobs,
      totalUsers: candidates + recruiters,
      recentActivity: recentLogs
    }
  });
});

/**
 * View administrative audit logs
 */
export const getAuditLogs = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20, action } = req.query;

  const query = {};
  if (action) query.action = action;

  const total = await AuditLog.countDocuments(query);
  const logs = await AuditLog.find(query)
    .populate('adminId', 'fullname email')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(200).json({
    success: true,
    total,
    logs,
  });
});

/**
 * Allows an admin to "shadow login" as another user.
 * Generates a new token for the target user and logs the action.
 */
export const shadowLogin = catchAsync(async (req, res, next) => {
  const adminId = req.id; // ID of the admin performing the shadow login
  const { userId } = req.params; // ID of the user to shadow

  // 1. Verify the admin's role (already handled by isAdmin middleware, but good to double-check)
  const adminUser = await User.findById(adminId);
  if (!adminUser || adminUser.role !== 'admin') {
    return next(new AppError("Access denied. Admin privileges required.", 403));
  }

  // 2. Find the target user
  const targetUser = await User.findById(userId);
  if (!targetUser) {
    return next(new AppError("Target user not found.", 404));
  }

  // 3. Prevent shadowing another admin
  if (targetUser.role === 'admin') {
    return next(new AppError("Cannot shadow another administrator.", 403));
  }

  // 4. Generate a new token for the target user
  const token = jwt.sign({ id: targetUser._id }, process.env.SECRET_KEY, { expiresIn: '1h' }); // Shorter expiry for shadow tokens

  // 5. Log the shadow login action
  await AuditLog.create({
    adminId: adminId,
    action: 'SHADOW_LOGIN',
    targetId: targetUser._id,
    targetModel: 'User',
    details: { email: targetUser.email, originalAdminEmail: adminUser.email },
    ipAddress: req.ip
  });

  res.status(200).json({
    success: true,
    message: `Successfully logged in as ${targetUser.email}.`,
    token,
    user: targetUser // Optionally return user data for immediate UI update
  });
});