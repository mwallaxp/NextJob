import bcrypt from "bcryptjs";
import User from "../modules/user.model.js"; // Updated import
import catchAsync from "../catchAsync.js"; // Added catchAsync import
import jwt from "jsonwebtoken";
import crypto from "crypto";
import cloudinary from "../utility/Cloudinary.js";
import {
  isEmailConfigured,
  sendPasswordResetEmail,
} from "../utility/email.js";

// Assuming these schemas are imported from a validation file
// import { registrationSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, updateProfileSchema } from '../validation/user.validation.js';
// import validate from '../middleware/validation.middleware.js';

const getCookieOptions = () => ({
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
});
export const registration = catchAsync(async (req, res, next) => {
    // Assuming validation middleware has already processed req.body
    // and populated req.validatedBody
    const { fullname, phonenumber, email, password, role } = req.validatedBody || req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Email already registered", success: false });
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // URL provided by cloudinaryUpload middleware
    const profilePhotoUrl = req.fileUrl || "";

    // Create new user
    const newUser = await User.create({
      fullname,
      phonenumber,
      email,
      password: hashPassword,
      role,
      profile: {
        profilePhoto: profilePhotoUrl,
      },
    });

    const tokenData = {
      userId: newUser._id,
      role: newUser.role,
    };

    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    res.cookie("token", token, getCookieOptions());
    return res.status(201).json({
      message: "Account created successfully",
      success: true,
      user: {
        _id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        role: newUser.role,
        profile: {
          profilePhoto: profilePhotoUrl,
        },
      },
      token,
    });
});

/**
 * User login handler
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response
 */
export const login = catchAsync(async (req, res, next) => {
    // Assuming validation middleware has already processed req.body
    // and populated req.validatedBody
    const { email, password, role } = req.validatedBody || req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
        success: false,
      });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid credentials",
        success: false,
      });
    }

    // Check role
    if (role !== user.role) {
      return res.status(403).json({
        message: "Access denied: invalid role for this account",
        success: false,
      });
    }

    // Generate JWT token
    const tokenData = {
      userId: user._id,
      role: user.role,
    };

    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    res.cookie("token", token, getCookieOptions());

    // Send response
    return res.status(200).json({
      message: `Welcome ${user.fullname}`,
      success: true,
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        phonenumber: user.phonenumber,
        role: user.role,
        profile: user.profile,
      },
      token, // Include token in response for mobile clients
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Server error during login",
      success: false,
    });
  }
};

/**
 * User logout handler
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response
 */
export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      message: "Server error during logout",
      success: false,
    });
  }
};

/**
 * Get current user info
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response
 */
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
});

export const forgotPassword = catchAsync(async (req, res, next) => {
    // Assuming validation middleware has already processed req.body
    // and populated req.validatedBody
    const { email } = req.validatedBody || req.body;
    
    const user = await User.findOne({ email });

    // Keep the public response generic so this endpoint does not reveal accounts.
    if (!user) {
      return res.status(200).json({
        message: "If an account exists for that email, a reset link has been generated.",
        success: true,
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const resetUrl = `${clientUrl.replace(/\/$/, "")}/reset-password/${resetToken}`;

    if (isEmailConfigured()) {
      await sendPasswordResetEmail({
        to: user.email,
        name: user.fullname,
        resetUrl,
      });

      return res.status(200).json({
        message: "If an account exists for that email, a reset link has been sent.",
        success: true,
      });
    }

    return res.status(200).json({
      message: "Email is not configured. Development reset link generated.",
      success: true,
      resetUrl,
    });
});

export const resetPassword = catchAsync(async (req, res, next) => {
    const { token } = req.params;
    // Ensure token is not empty or malformed
    if (!token) return next(new AppError("Reset token is missing.", 400));
    // Assuming validation middleware has already processed req.body
    // and populated req.validatedBody
    const { password } = req.validatedBody || req.body;
    // confirmPassword is validated by Joi.ref('password') in the schema

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Password reset link is invalid or has expired",
        success: false,
      });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({
      message: "Password reset successfully. Please log in with your new password.",
      success: true,
    });
});


/**
 * Update user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response
 */
export const updateProfile = catchAsync(async (req, res, next) => {
    // Assuming validation middleware has already processed req.body
    // and populated req.validatedBody
    const { fullname, email, phonenumber, bio, skills } = req.validatedBody || req.body;
    const userId = req.id; // Get user ID from authenticated user
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    // Process resume file if provided
    if (req.fileUrl) {
      user.profile.resume = req.fileUrl;
      user.profile.resumeOriginalName = req.file.originalname;
    }

    // Process skills if provided
    if (skills) {
      user.profile.skills = Array.isArray(skills) ? skills : skills.split(",").map(s => s.trim());
    }

    // Update user data with provided fields
    if (fullname) user.fullname = fullname;
    if (email) {
      // Check if email is being changed and is already in use
      if (email !== user.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(409).json({ message: "Email already in use", success: false });
        }
        user.email = email;
      }
    }
    if (phonenumber) user.phonenumber = phonenumber;
    if (bio) user.profile.bio = bio;

    // Save updated user document
    await user.save();

    const updatedUser = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phonenumber: user.phonenumber,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user: updatedUser,
    });
});
