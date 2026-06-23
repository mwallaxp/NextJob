import User from '../modules/user.model.js';
import Notification from '../modules/notification.model.js';
import catchAsync from '../catchAsync.js';
import AppError from '../AppError.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const getAuthCookieOptions = (maxAge) => ({
    maxAge,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
});

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

export const forgotPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return next(new AppError("There is no user with that email address.", 404));
    }

    // Placeholder for token generation and email sending logic
    res.status(200).json({
        success: true,
        message: "If a user with that email exists, a reset link has been sent."
    });
});

export const resetPassword = catchAsync(async (req, res, next) => {
    res.status(200).json({ success: true, message: "Password has been reset." });
});

export const updateProfile = catchAsync(async (req, res, next) => {
    res.status(200).json({ success: true, message: "Profile updated successfully." });
});

export const registration = catchAsync(async (req, res, next) => {
    const { fullname, email, phonenumber, password, role } = req.body;

    if (!fullname || !email || !phonenumber || !password || !role) {
        return next(new AppError("Something is missing", 400));
    }

    const user = await User.findOne({ email });
    if (user) {
        return next(new AppError('User already exists with this email.', 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
        fullname,
        email,
        phonenumber,
        password: hashedPassword,
        role,
    });

    return res.status(201).json({
        message: "Account created successfully.",
        success: true
    });
});

export const login = catchAsync(async (req, res, next) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return next(new AppError("Something is missing", 400));
    }

    let user = await User.findOne({ email });
    if (!user) {
        return next(new AppError("Incorrect email or password.", 400));
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        return next(new AppError("Incorrect email or password.", 400));
    }

    if (role !== user.role) {
        return next(new AppError("Account doesn't exist with current role.", 400));
    }

    const tokenData = { userId: user._id, role: user.role };
    const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

    const userData = {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        phonenumber: user.phonenumber,
        role: user.role,
        profile: user.profile
    };

    return res.status(200).cookie("token", token, getAuthCookieOptions(1 * 24 * 60 * 60 * 1000)).json({
        message: `Welcome back ${user.fullname}`,
        user: userData,
        token,
        success: true
    });
});

export const logout = catchAsync(async (req, res, next) => {
    return res.status(200).cookie("token", "", getAuthCookieOptions(0)).json({
        message: "Logged out successfully.",
        success: true
    });
});

export const getCurrentUser = catchAsync(async (req, res, next) => {
    res.status(200).json({ success: true, user: req.user });
});
