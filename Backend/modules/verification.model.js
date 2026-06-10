import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    emailVerifiedAt: Date,
    phoneVerified: {
        type: Boolean,
        default: false
    },
    phoneVerifiedAt: Date,
    identityVerified: {
        type: Boolean,
        default: false
    },
    identityVerificationId: String,
    identityDocument: String, // URL to identity document
    identityVerifiedAt: Date,
    bankVerified: {
        type: Boolean,
        default: false
    },
    bankVerifiedAt: Date,
    backgroundCheckPassed: {
        type: Boolean,
        default: false
    },
    backgroundCheckAt: Date,
    verificationScore: {
        type: Number,
        default: 0 // 0-100
    },
    verificationStatus: {
        type: String,
        enum: ["pending", "verified", "failed", "under-review"],
        default: "pending"
    },
    failureReason: String,
    attempts: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Verification = mongoose.model("Verification", verificationSchema);
export default Verification;
