import express from "express";
import { isAuthenticate } from "../authentication/isAuthentication.js";
import { authorizeRoles } from "../authentication/auth.js";
import { getCompany, registerCompany, getCompanyById, updateCompany} from "../controller/company.controller.js";
import { singleUpload } from "../authentication/multer.js";
const router = express.Router();




router.route("/register").post(isAuthenticate, authorizeRoles("recruiter"), registerCompany);
router.route("/get").get(isAuthenticate, authorizeRoles("recruiter", "admin"), getCompany);
router.route("/get/:id").get(isAuthenticate, authorizeRoles("recruiter", "admin"), getCompanyById);
router.route("/update/:id").put(isAuthenticate, authorizeRoles("recruiter", "admin"), singleUpload, updateCompany);
 

export default router
