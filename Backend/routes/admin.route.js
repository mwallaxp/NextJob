import express from 'express';
import {
  getAllUsers,
  toggleUserStatus,
  getAdminStats,
  getAuditLogs,
  shadowLogin
} from '../controller/admin.controller.js';
import { isAuthenticate } from '../authentication/isAuthentication.js';
import { authorizeRoles } from '../authentication/auth.js';

const router = express.Router();

// All admin routes should be protected and only accessible by admins
router.use(isAuthenticate, authorizeRoles('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.patch('/users/:userId/status', toggleUserStatus);
router.get('/logs', getAuditLogs);
router.post('/shadow-login/:userId', shadowLogin);

export default router;