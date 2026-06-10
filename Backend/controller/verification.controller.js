import Verification from "../modules/verification.model.js";
import catchAsync from "../catchAsync.js";
import AppError from "../AppError.js";

// Create verification record
export const initializeVerification = catchAsync(async (req, res) => {
    const { userId } = req.params;

    let verification = await Verification.findOne({ userId });

    if (!verification) {
        verification = await Verification.create({
            userId,
            verificationStatus: "pending"
        });
    }

    res.json({
        success: true,
        verification
    });
});

// Get verification status
export const getVerificationStatus = catchAsync(async (req, res) => {
    const { userId } = req.params;

    const verification = await Verification.findOne({ userId });

    if (!verification) {
        throw new AppError("Verification record not found", 404);
    }

    res.json({
        success: true,
        verification
    });
});

// Verify email (in production, send verification email first)
export const verifyEmail = catchAsync(async (req, res) => {
    const { userId } = req.params;

    const verification = await Verification.findOneAndUpdate(
        { userId },
        {
            emailVerified: true,
            emailVerifiedAt: new Date()
        },
        { new: true }
    );

    if (!verification) {
        throw new AppError("Verification record not found", 404);
    }

    res.json({
        success: true,
        verification
    });
});

// Verify phone
export const verifyPhone = catchAsync(async (req, res) => {
    const { userId } = req.params;

    const verification = await Verification.findOneAndUpdate(
        { userId },
        {
            phoneVerified: true,
            phoneVerifiedAt: new Date()
        },
        { new: true }
    );

    if (!verification) {
        throw new AppError("Verification record not found", 404);
    }

    res.json({
        success: true,
        verification
    });
});

// Submit identity verification
export const submitIdentityVerification = catchAsync(async (req, res) => {
    const { userId } = req.params;
    const { identityDocument, identificationId } = req.body;

    if (!identityDocument) {
        throw new AppError("Identity document is required", 400);
    }

    const verification = await Verification.findOneAndUpdate(
        { userId },
        {
            identityDocument,
            identityVerificationId: identificationId,
            verificationStatus: "under-review"
        },
        { new: true }
    );

    if (!verification) {
        throw new AppError("Verification record not found", 404);
    }

    res.json({
        success: true,
        message: "Identity verification submitted for review",
        verification
    });
});

// Admin: Approve verification
export const approveIdentityVerification = catchAsync(async (req, res) => {
    const { userId } = req.params;

    const verification = await Verification.findOneAndUpdate(
        { userId },
        {
            identityVerified: true,
            identityVerifiedAt: new Date(),
            verificationStatus: "verified",
            verificationScore: 100
        },
        { new: true }
    );

    if (!verification) {
        throw new AppError("Verification record not found", 404);
    }

    res.json({
        success: true,
        verification
    });
});

// Admin: Reject verification
export const rejectIdentityVerification = catchAsync(async (req, res) => {
    const { userId } = req.params;
    const { reason } = req.body;

    const verification = await Verification.findOneAndUpdate(
        { userId },
        {
            verificationStatus: "failed",
            failureReason: reason,
            $inc: { attempts: 1 }
        },
        { new: true }
    );

    if (!verification) {
        throw new AppError("Verification record not found", 404);
    }

    res.json({
        success: true,
        verification
    });
});

// Get unverified users (admin)
export const getUnverifiedUsers = catchAsync(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const verifications = await Verification.find({
        verificationStatus: "under-review"
    })
        .populate("userId", "fullname email")
        .limit(limit)
        .skip((page - 1) * limit);

    const total = await Verification.countDocuments({
        verificationStatus: "under-review"
    });

    res.json({
        success: true,
        verifications,
        total,
        pages: Math.ceil(total / limit)
    });
});
