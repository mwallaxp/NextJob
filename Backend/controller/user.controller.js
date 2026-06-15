import User from '../modules/user.model.js';
import Notification from '../modules/notification.model.js';
import catchAsync from '../catchAsync.js';
import AppError from '../AppError.js';

export const getUserProfile = catchAsync(async (req, res, next) => {
    const userId = req.params.id;
    const user = await User.findById(userId).select('-password');

    if (!user) {
        return next(new AppError("User not found", 404));
    }

    // Trigger notification if a recruiter views a freelancer's profile
    const viewerId = req.id; // Logged-in user ID from auth middleware
    if (viewerId && viewerId !== userId) {
        const viewer = await User.findById(viewerId);
        
        // Only notify if the viewer is a recruiter and the target is a candidate/freelancer
        if (viewer?.role === 'recruiter' && user.role === 'candidate') {
            await Notification.create({
                recipient: userId,
                sender: viewerId,
                type: 'PROFILE_VIEW',
                message: `${viewer.fullname} viewed your profile.`,
                link: `/profile/${viewerId}`
            });

            // Real-time notification via Socket.io
            const io = req.app.get("io");
            if (io) {
                io.to(`user_${userId}`).emit("notification", {
                    type: "PROFILE_VIEW",
                    message: `${viewer.fullname} viewed your profile.`,
                });
            }
        }
    }

    res.status(200).json({
        success: true,
        user
    });
});