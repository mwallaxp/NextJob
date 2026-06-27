import express from "express";
import { isAuthenticate } from "../authentication/isAuthentication.js";
import { authorizeRoles } from "../authentication/auth.js";
import { applyJob, getApplicants, getAppliedJobs, updateApplicationReview, updateStatus } from "../controller/Application.controller.js";

const router = express.Router();

// Route to submit a bid
router.route("/apply/:id").post(isAuthenticate, applyJob);

// Route to fetch all bids for the logged-in freelancer
router.route("/get").get(isAuthenticate, getAppliedJobs);
router.route("/:id/applicant").get(isAuthenticate, authorizeRoles("recruiter", "admin"), getApplicants);
router.route("/status/update/:id").post(isAuthenticate, authorizeRoles("recruiter", "admin"), updateStatus);
router.route("/status/:id/update").post(isAuthenticate, authorizeRoles("recruiter", "admin"), updateStatus);
router.route("/:id/review").patch(isAuthenticate, authorizeRoles("recruiter", "admin"), updateApplicationReview);

export default router;
