import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    freelancerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: "USD"
    },
    stripePaymentIntentId: {
        type: String,
        unique: true,
        sparse: true
    },
    status: {
        type: String,
        enum: ["pending", "processing", "succeeded", "failed", "refunded"],
        default: "pending"
    },
    paymentMethod: {
        type: String,
        enum: ["stripe", "paypal", "razorpay"],
        required: true
    },
    description: String,
    metadata: mongoose.Schema.Types.Mixed,
    refundReason: String,
    refundAmount: Number,
    createdAt: {
        type: Date,
        default: Date.now
    },
    completedAt: Date
}, { timestamps: true });

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
