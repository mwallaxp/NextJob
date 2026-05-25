import express from "express";
import { isAuthenticate } from "../authentication/isAuthentication.js";
import { getAppliedJobs } from "../application.controller.js";

const router = express.Router();

// Route to fetch all bids for the logged-in freelancer
router.route("/get").get(isAuthenticate, getAppliedJobs);

export default router;