import express from "express";
import {
    createPaymentIntent,
    confirmPayment,
    getPaymentHistory,
    processRefund
} from "../controller/payment.controller.js";
import { isAuthenticate } from "../authentication/isAuthentication.js";
import { authorizeRoles } from "../authentication/auth.js";

const router = express.Router();

// Create payment intent
router.post("/create-intent", isAuthenticate, authorizeRoles("recruiter", "admin"), createPaymentIntent);

// Confirm payment
router.post("/confirm", isAuthenticate, confirmPayment);

// Get payment history
router.get("/history/:userId", isAuthenticate, getPaymentHistory);

// Process refund
router.post("/refund", isAuthenticate, processRefund);

export default router;
