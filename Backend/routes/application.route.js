import express from "express";
import { isAuthenticate } from "../authentication/isAuthentication.js";
import { applyJob, getAppliedJobs } from "../application.controller.js";

const router = express.Router();

// Route to submit a bid
router.route("/apply/:id").post(isAuthenticate, applyJob);

// Route to fetch all bids for the logged-in freelancer
router.route("/get").get(isAuthenticate, getAppliedJobs);

export default router;