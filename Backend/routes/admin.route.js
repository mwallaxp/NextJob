import express from 'express';
import {
  getAllUsers,
  toggleUserStatus,
  getAdminStats,
  getAuditLogs,
  shadowLogin
} from '../controller/admin.controller.js';
import { isAuthenticated, authorizeRoles } from '../middleware/auth.js'; // Assuming these middlewares exist

const router = express.Router();

// All admin routes should be protected and only accessible by admins
router.use(isAuthenticated, authorizeRoles('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.patch('/users/:userId/status', toggleUserStatus);
router.get('/logs', getAuditLogs);
router.post('/shadow-login/:userId', shadowLogin);

export default router;