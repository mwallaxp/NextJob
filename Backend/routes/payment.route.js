import express from "express";
import {
    createPaymentIntent,
    confirmPayment,
    getPaymentHistory,
    processRefund
} from "../controller/payment.controller.js";

const router = express.Router();

// Create payment intent
router.post("/create-intent", createPaymentIntent);

// Confirm payment
router.post("/confirm", confirmPayment);

// Get payment history
router.get("/history/:userId", getPaymentHistory);

// Process refund
router.post("/refund", processRefund);

export default router;
