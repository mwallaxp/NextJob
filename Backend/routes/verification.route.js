import express from "express";
import {
    initializeVerification,
    getVerificationStatus,
    verifyEmail,
    verifyPhone,
    submitIdentityVerification,
    approveIdentityVerification,
    rejectIdentityVerification,
    getUnverifiedUsers
} from "../controller/verification.controller.js";

const router = express.Router();

// Initialize verification
router.post("/init/:userId", initializeVerification);

// Get verification status
router.get("/status/:userId", getVerificationStatus);

// Verify email
router.put("/:userId/verify-email", verifyEmail);

// Verify phone
router.put("/:userId/verify-phone", verifyPhone);

// Submit identity verification
router.post("/:userId/submit-identity", submitIdentityVerification);

// Admin: Approve verification
router.put("/admin/:userId/approve", approveIdentityVerification);

// Admin: Reject verification
router.put("/admin/:userId/reject", rejectIdentityVerification);

// Admin: Get unverified users
router.get("/admin/unverified", getUnverifiedUsers);

export default router;
