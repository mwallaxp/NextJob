import express from "express";
import {
  forgotPassword,
  getCurrentUser,
  login,
  logout,
  registration,
  resetPassword,
  updateProfile,
  getUserProfile,
  getSavedJobs,
  toggleSavedJob
} from "../controller/user.controller.js"
import { isAuthenticate } from "../authentication/isAuthentication.js";
import { singleUpload } from "../authentication/multer.js";

const router = express.Router();


router.route("/registration").post(singleUpload, registration);
router.route("/login").post(login);
router.route("/logout").get(logout)
router.route("/current").get(isAuthenticate, getCurrentUser);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);
router.route("/profile/update").post(isAuthenticate, singleUpload, updateProfile);
router.route("/profile/:id").get(isAuthenticate, getUserProfile);
router.route("/saved-jobs").get(isAuthenticate, getSavedJobs);
router.route("/saved-jobs/:jobId").post(isAuthenticate, toggleSavedJob);


export default router;
