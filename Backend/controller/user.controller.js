import User from '../modules/user.model.js';
import Notification from '../modules/notification.model.js';
import Job from '../modules/job.model.js';
import catchAsync from '../catchAsync.js';
import AppError from '../AppError.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import cloudinary from "../utility/Cloudinary.js";
import getDataUrl from "../utility/DataUrl.js";
import { isEmailConfigured, sendPasswordResetEmail } from "../utility/email.js";

const getAuthCookieOptions = (maxAge) => ({
    maxAge,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
});

const toList = (value) => {
    if (Array.isArray(value)) {
        return value.map((item) => String(item).trim()).filter(Boolean);
    }

    return String(value || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
};

const buildResetUrl = (token) => {
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    return `${clientUrl.replace(/\/$/, "")}/reset-password/${token}`;
};

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
    if (!email) {
        return next(new AppError("Email is required", 400));
    }

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(200).json({
            success: true,
            message: "If a user with that email exists, a reset link has been sent."
        });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const resetUrl = buildResetUrl(resetToken);
    if (isEmailConfigured()) {
        await sendPasswordResetEmail({ to: user.email, name: user.fullname, resetUrl });
    }

    res.status(200).json({
        success: true,
        message: "If a user with that email exists, a reset link has been sent.",
        ...(process.env.NODE_ENV !== "production" && !isEmailConfigured() ? { resetUrl } : {}),
    });
});

export const resetPassword = catchAsync(async (req, res, next) => {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password || password.length < 8) {
        return next(new AppError("Password must be at least 8 characters", 400));
    }

    if (confirmPassword && password !== confirmPassword) {
        return next(new AppError("Passwords do not match", 400));
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
        return next(new AppError("Reset token is invalid or has expired", 400));
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: "Password has been reset." });
});

export const updateProfile = catchAsync(async (req, res, next) => {
    const { fullname, email, phonenumber, bio, skills } = req.body;
    const update = {};
    const profileUpdate = {};

    if (fullname) update.fullname = fullname;
    if (email) {
        const existing = await User.findOne({ email, _id: { $ne: req.id } });
        if (existing) {
            return next(new AppError("Email is already in use", 400));
        }
        update.email = email;
    }
    if (phonenumber) update.phonenumber = phonenumber;
    if (bio !== undefined) profileUpdate.bio = bio;
    if (skills !== undefined) profileUpdate.skills = toList(skills);

    if (req.file) {
        const fileUri = getDataUrl(req.file);
        const uploaded = await cloudinary.uploader.upload(fileUri, {
            folder: "nextjob/resumes",
            resource_type: "auto",
        });
        profileUpdate.resume = uploaded.secure_url;
        profileUpdate.resumeOriginalName = req.file.originalname;
    }

    Object.entries(profileUpdate).forEach(([key, value]) => {
        update[`profile.${key}`] = value;
    });

    const user = await User.findByIdAndUpdate(req.id, update, {
        new: true,
        runValidators: true,
    }).select("-password");

    res.status(200).json({ success: true, message: "Profile updated successfully.", user });
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

export const getSavedJobs = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.id)
        .select("savedJobs")
        .populate({
            path: "savedJobs",
            populate: { path: "company", select: "name logo location website" },
            options: { sort: { createdAt: -1 } },
        });

    res.status(200).json({ success: true, jobs: user?.savedJobs || [] });
});

export const toggleSavedJob = catchAsync(async (req, res, next) => {
    const { jobId } = req.params;
    const job = await Job.findById(jobId).select("_id");
    if (!job) {
        return next(new AppError("Job not found", 404));
    }

    const user = await User.findById(req.id).select("savedJobs");
    const isSaved = user.savedJobs.some((id) => String(id) === String(jobId));
    user.savedJobs = isSaved
        ? user.savedJobs.filter((id) => String(id) !== String(jobId))
        : [...user.savedJobs, job._id];
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        saved: !isSaved,
        savedJobIds: user.savedJobs.map((id) => String(id)),
    });
});
