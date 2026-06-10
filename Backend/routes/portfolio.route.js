import express from "express";
import {
    savePortfolio,
    getPortfolio,
    addProject,
    updateProject,
    addSkill,
    addExperience,
    addEducation
} from "../controller/portfolio.controller.js";

const router = express.Router();

// Portfolio CRUD
router.post("/:userId", savePortfolio);
router.get("/:userId", getPortfolio);

// Projects
router.post("/:userId/projects", addProject);
router.put("/:userId/projects/:projectId", updateProject);

// Skills
router.post("/:userId/skills", addSkill);

// Experience
router.post("/:userId/experience", addExperience);

// Education
router.post("/:userId/education", addEducation);

export default router;
