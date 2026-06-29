import express from 'express';
import {
  approveIdentityVerification,
  getUnverifiedUsers,
  getVerificationStatus,
  initializeVerification,
  rejectIdentityVerification,
  submitIdentityVerification,
  verifyEmail,
  verifyPhone,
} from '../controller/verification.controller.js';
import { authorizeRoles } from '../authentication/auth.js';
import { isAuthenticate } from '../authentication/isAuthentication.js';

const router = express.Router();

router.use(isAuthenticate);

router.get('/admin/unverified', authorizeRoles('admin'), getUnverifiedUsers);
router.patch('/admin/:userId/approve', authorizeRoles('admin'), approveIdentityVerification);
router.patch('/admin/:userId/reject', authorizeRoles('admin'), rejectIdentityVerification);

router.post('/:userId/initialize', initializeVerification);
router.get('/:userId/status', getVerificationStatus);
router.patch('/:userId/email', verifyEmail);
router.patch('/:userId/phone', verifyPhone);
router.post('/:userId/identity', submitIdentityVerification);

export default router;
