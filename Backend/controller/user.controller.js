import bcrypt from "bcryptjs";
import User from "../modules/user.module.js";
import jwt from "jsonwebtoken";
import cloudinary from "../utility/Cloudinary.js";

export const registration = async (req, res) => {
  try {
    const { fullname, phonenumber, email, password, role } = req.body;

    // Validate required fields
    const requiredFields = { fullname, phonenumber, email, password, role };
    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value) {
        return res.status(400).json({
          message: `Missing required field: ${field}`,
          success: false,
        });
      }
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: "Invalid email format", success: false });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Email already registered", success: false });
    }

    // Password strength validation
    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
        success: false,
      });
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // Process profile photo if provided
    let profilePhotoUrl = ""; // Default empty URL
    if (req.file) {
      try {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "user-profiles", // Organize in a specific folder
              resource_type: "image",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });
        profilePhotoUrl = result.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(400).json({
          message: "Error uploading profile photo",
          success: false,
        });
      }
    }

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

    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

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
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      message: "Server error during registration",
      success: false,
    });
  }
};
/**
 * User login handler
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response
 */
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validate required fields
    const missingFields = [];
    if (!email) missingFields.push("email");
    if (!password) missingFields.push("password");
    if (!role) missingFields.push("role");

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `The following fields are missing: ${missingFields.join(
          ", "
        )}`,
        success: false,
      });
    }

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

    // Set cookie
    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
      sameSite: "strict",
    });

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
    const userId = req.user.userId;

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
  } catch (error) {
    console.error("Get current user error:", error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

/**
 * Update user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response
 */
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phonenumber, bio, skills } = req.body;
    const userId = req.id; // Get user ID from authenticated user
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    // Process resume file if provided
    if (req.file) {
      try {
        // Assuming getDataUrl converts file to a data URI (replace with your implementation)
        const getDataUrl = (file) => {
          const buffer = file.buffer.toString('base64');
          return { content: `data:${file.mimetype};base64,${buffer}` };
        };

        const dataUri = getDataUrl(req.file);
        const cloudResponse = await cloudinary.uploader.upload(dataUri.content, {
          folder: "user-resumes",
          resource_type: "auto",
        });

        if (cloudResponse) {
          user.profile.resume = cloudResponse.secure_url;
          user.profile.resumeOriginalName = req.file.originalname;
        }
      } catch (uploadError) {
        console.error("Resume upload error:", uploadError);
        return res.status(400).json({ message: "Error uploading resume", success: false });
      }
    }

    // Process skills if provided
    let skillsArray;
    if (skills) {
      skillsArray =
        typeof skills === "string"
          ? skills.split(",").map((skill) => skill.trim())
          : skills;
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
    if (skillsArray) user.profile.skills = skillsArray;

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
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({
      message: "Server error during profile update",
      success: false,
    });
  }
};