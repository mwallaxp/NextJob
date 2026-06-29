import express from 'express';
import { getNotifications, markNotificationsAsRead } from '../controller/notification.controller.js';
import { isAuthenticated } from '../middleware/auth.middleware.js'; // Assuming you have this auth middleware

const router = express.Router();

// All notification routes should be protected
router.use(isAuthenticated);

router.get('/', getNotifications);
router.patch('/read', markNotificationsAsRead);

export default router;