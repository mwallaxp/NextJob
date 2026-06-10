import express from "express";
import {
    createReview,
    getUserReviews,
    getReviewsByUser,
    updateReview,
    deleteReview
} from "../controller/review.controller.js";

const router = express.Router();

// Create review
router.post("/", createReview);

// Get reviews for a user
router.get("/user/:userId", getUserReviews);

// Get reviews written by user
router.get("/written-by/:userId", getReviewsByUser);

// Update review
router.put("/:reviewId", updateReview);

// Delete review
router.delete("/:reviewId", deleteReview);

export default router;
