import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js"; // Standard auth check
import { isAdmin } from "../middleware/isAdmin.js";
import { getAllUsers, toggleUserStatus, getAdminStats, getAuditLogs, shadowLogin } from "../controllers/admin.controller.js";

const router = express.Router();

// All routes below require both Authentication and Admin Role
router.use(isAuthenticated, isAdmin);

router.route("/users").get(getAllUsers);
router.route("/users/:userId/status").patch(toggleUserStatus);
router.route("/stats").get(getAdminStats);
router.route("/logs").get(getAuditLogs); // Assuming you want to add this route
router.route("/shadow-login/:userId").post(shadowLogin);

export default router;