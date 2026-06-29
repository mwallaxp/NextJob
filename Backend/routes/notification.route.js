import express from 'express';
import {
  clearNotifications,
  getNotifications,
  markNotificationsAsRead,
} from '../controller/notification.controller.js';
import { isAuthenticate } from '../authentication/isAuthentication.js';

const router = express.Router();

router.use(isAuthenticate);

router.get('/', getNotifications);
router.patch('/read', markNotificationsAsRead);
router.delete('/clear', clearNotifications);

export default router;
