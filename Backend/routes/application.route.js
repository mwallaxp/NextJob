import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js"; // Ensure this middleware sets req.id
import { getAppliedJobs } from "../controllers/application.controller.js";

const router = express.Router();

// Route to fetch all bids for the logged-in freelancer
router.route("/get").get(isAuthenticated, getAppliedJobs);

export default router;