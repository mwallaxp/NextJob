import express from "express";
import {
    createDispute,
    getDispute,
    getUserDisputes,
    addEvidence,
    submitDisputeResponse,
    resolveDispute,
    getAllDisputes
} from "../controller/dispute.controller.js";

const router = express.Router();

// Create dispute
router.post("/", createDispute);

// Get single dispute
router.get("/:disputeId", getDispute);

// Get user disputes
router.get("/user/:userId", getUserDisputes);

// Add evidence to dispute
router.post("/:disputeId/evidence", addEvidence);

// Submit response
router.post("/:disputeId/response", submitDisputeResponse);

// Resolve dispute (admin)
router.put("/:disputeId/resolve", resolveDispute);

// Get all disputes (admin)
router.get("/admin/all", getAllDisputes);

export default router;
