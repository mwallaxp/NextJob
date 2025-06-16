import express from "express";
import { login, logout, registration, updateProfile} from "../controller/user.controller.js"
import { isAuthenticate } from "../authentication/isAuthentication.js";
import { singleUpload } from "../authentication/multer.js";

const router = express.Router();


router.route("/registration").post(singleUpload, registration);
router.route("/login").post(login);
router.route("/logout").get(logout)
router.route("/profile/update").post(isAuthenticate, singleUpload, updateProfile);


export default router;