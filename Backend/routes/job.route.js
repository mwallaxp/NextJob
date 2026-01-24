import express from "express";
import { isAuthenticate } from "../authentication/isAuthentication.js";
import { getAdminJobs, getAllJobs, getJobById, postJob } from "../controller/job.controller.js";
const router = express.Router();




router.route("/post").post(isAuthenticate, postJob);
router.route("/get").get(isAuthenticate, getAllJobs);
router.route("/getAdminjobs").get(isAuthenticate, getAdminJobs);
router.route("/get/:id").get(isAuthenticate, getJobById);
 

export default router;