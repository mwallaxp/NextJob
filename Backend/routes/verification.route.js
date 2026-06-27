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
import { isAuthenticate } from "../authentication/isAuthentication.js";
import { authorizeRoles } from "../authentication/auth.js";

const router = express.Router();

// Initialize verification
router.post("/init/:userId", isAuthenticate, initializeVerification);

// Get verification status
router.get("/status/:userId", isAuthenticate, getVerificationStatus);

// Verify email
router.put("/:userId/verify-email", isAuthenticate, verifyEmail);

// Verify phone
router.put("/:userId/verify-phone", isAuthenticate, verifyPhone);

// Submit identity verification
router.post("/:userId/submit-identity", isAuthenticate, submitIdentityVerification);

// Admin: Approve verification
router.put("/admin/:userId/approve", isAuthenticate, authorizeRoles("admin"), approveIdentityVerification);

// Admin: Reject verification
router.put("/admin/:userId/reject", isAuthenticate, authorizeRoles("admin"), rejectIdentityVerification);

// Admin: Get unverified users
router.get("/admin/unverified", isAuthenticate, authorizeRoles("admin"), getUnverifiedUsers);

export default router;
