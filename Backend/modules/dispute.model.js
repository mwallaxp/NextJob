import mongoose from "mongoose";

const disputeSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true
    },
    paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment"
    },
    claimantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    respondentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reason: {
        type: String,
        enum: [
            "incomplete-work",
            "quality-issues",
            "missed-deadline",
            "non-payment",
            "harassment",
            "other"
        ],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    evidence: [{
        type: String, // URLs to evidence files
        uploadedAt: Date
    }],
    status: {
        type: String,
        enum: ["open", "in-review", "mediating", "resolved", "closed"],
        default: "open"
    },
    resolution: {
        status: String, // "resolved-in-favor-of-claimant", "resolved-in-favor-of-respondent", "settled"
        resolutionDescription: String,
        refundAmount: Number,
        mediatorNotes: String
    },
    timelineEvents: [{
        event: String,
        timestamp: Date,
        userId: mongoose.Schema.Types.ObjectId
    }],
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium"
    }
}, { timestamps: true });

const Dispute = mongoose.model("Dispute", disputeSchema);
export default Dispute;
