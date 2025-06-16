import express from "express"
import { isAuthenticate } from "../authentication/isAuthentication.js";
import { Applyjob, getApplicants, getAppliedJob, updateStatus } from "../controller/Application.controller.js"
const router = express.Router()

router.route("/apply/:id").get(isAuthenticate, Applyjob)
router.route("/get").get(isAuthenticate, getAppliedJob)
router.route("/:id/applicant").get(isAuthenticate, getApplicants)
router.route("/status/update:id").post(isAuthenticate, updateStatus)

export default router