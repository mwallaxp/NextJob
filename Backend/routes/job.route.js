import express from "express";
import { isAuthenticate } from "../authentication/isAuthentication.js";
import { authorizeRoles } from "../authentication/auth.js";
import { getAdminJobs, getAllJobs, getJobById, postJob, updateJob, updateJobStatus } from "../controller/job.controller.js";
const router = express.Router();




router.route("/post").post(isAuthenticate, authorizeRoles("recruiter"), postJob);
router.route("/get").get(getAllJobs);
router.route("/getAdminjobs").get(isAuthenticate, authorizeRoles("recruiter"), getAdminJobs);
router.route("/:id").patch(isAuthenticate, authorizeRoles("recruiter"), updateJob);
router.route("/:id/status").patch(isAuthenticate, authorizeRoles("recruiter"), updateJobStatus);
router.route("/get/:id").get(getJobById);
 

export default router;
