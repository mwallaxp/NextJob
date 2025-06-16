import express from "express";
import { isAuthenticate } from "../authentication/isAuthentication.js";
import { getCompany, registerCompany, getCompanyById, updateCompany} from "../controller/company.controller.js";
import { singleUpload } from "../authentication/multer.js";
const router = express.Router();




router.route("/register").post(isAuthenticate, registerCompany);
router.route("/get").get(isAuthenticate, getCompany);
router.route("/get/:id").get(isAuthenticate, getCompanyById);
router.route("/update/:id").put(isAuthenticate,singleUpload, updateCompany);
 

export default router