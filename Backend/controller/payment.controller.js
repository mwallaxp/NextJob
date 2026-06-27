import Payment from "../modules/payment.model.js";
import Job from "../modules/job.model.js";
import Stripe from "stripe";
import catchAsync from "../catchAsync.js";
import AppError from "../AppError.js";

const stripeClient = process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY)
    : null;

// Create payment intent
export const createPaymentIntent = catchAsync(async (req, res) => {
    const { jobId, freelancerId, amount, description } = req.body;

    if (!stripeClient) {
        throw new AppError("Stripe is not configured", 503);
    }

    if (!amount || amount <= 0) {
        throw new AppError("Invalid amount", 400);
    }

    const job = await Job.findById(jobId);
    if (!job) {
        throw new AppError("Job not found", 404);
    }
    if (req.role !== "admin" && String(job.created_by) !== String(req.id)) {
        throw new AppError("You can only create payments for your own jobs", 403);
    }

    const paymentIntent = await stripeClient.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
            jobId,
            clientId: String(req.id),
            freelancerId
        },
        description
    });

    const payment = await Payment.create({
        jobId,
        clientId: req.id,
        freelancerId,
        amount,
        currency: "USD",
        stripePaymentIntentId: paymentIntent.id,
        status: "pending",
        paymentMethod: "stripe",
        description
    });

    res.status(201).json({
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentId: payment._id
    });
});

// Confirm payment
export const confirmPayment = catchAsync(async (req, res) => {
    const { paymentIntentId, paymentId } = req.body;

    if (!stripeClient) {
        throw new AppError("Stripe is not configured", 503);
    }

    const payment = await Payment.findById(paymentId);
    if (!payment) {
        throw new AppError("Payment not found", 404);
    }
    if (![payment.clientId, payment.freelancerId].some((id) => String(id) === String(req.id)) && req.role !== "admin") {
        throw new AppError("You can only confirm payments connected to your account", 403);
    }

    const paymentIntent = await stripeClient.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
        await Payment.findByIdAndUpdate(paymentId, {
            status: "succeeded",
            completedAt: new Date()
        });

        res.json({
            success: true,
            message: "Payment successful"
        });
    } else {
        throw new AppError("Payment failed", 400);
    }
});

// Get payment history
export const getPaymentHistory = catchAsync(async (req, res) => {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (req.role !== "admin" && String(userId) !== String(req.id)) {
        throw new AppError("You can only view your own payment history", 403);
    }

    const payments = await Payment.find({
        $or: [{ clientId: userId }, { freelancerId: userId }]
    })
        .populate("jobId")
        .populate("clientId", "fullname email")
        .populate("freelancerId", "fullname email")
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

    const total = await Payment.countDocuments({
        $or: [{ clientId: userId }, { freelancerId: userId }]
    });

    res.json({
        success: true,
        payments,
        total,
        pages: Math.ceil(total / limit)
    });
});

// Process refund
export const processRefund = catchAsync(async (req, res) => {
    const { paymentId, reason, amount } = req.body;

    if (!stripeClient) {
        throw new AppError("Stripe is not configured", 503);
    }

    const payment = await Payment.findById(paymentId);
    if (!payment) {
        throw new AppError("Payment not found", 404);
    }

    if (payment.status !== "succeeded") {
        throw new AppError("Can only refund succeeded payments", 400);
    }
    if (req.role !== "admin" && String(payment.clientId) !== String(req.id)) {
        throw new AppError("Only the payer or an admin can refund this payment", 403);
    }

    const refund = await stripeClient.refunds.create({
        payment_intent: payment.stripePaymentIntentId,
        amount: Math.round((amount || payment.amount) * 100)
    });

    await Payment.findByIdAndUpdate(paymentId, {
        status: "refunded",
        refundReason: reason,
        refundAmount: amount || payment.amount
    });

    res.json({
        success: true,
        refundId: refund.id
    });
});
