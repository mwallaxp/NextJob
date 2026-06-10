import mongoose from "mongoose";

const milestoneSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true
    },
    paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    dueDate: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["not-started", "in-progress", "submitted", "approved", "rejected", "paid"],
        default: "not-started"
    },
    deliverables: [{
        title: String,
        description: String,
        files: [String], // URLs
        completed: Boolean
    }],
    submittedAt: Date,
    approvedAt: Date,
    rejectionReason: String,
    paidAt: Date,
    order: Number // Milestone order
}, { timestamps: true });

const Milestone = mongoose.model("Milestone", milestoneSchema);
export default Milestone;
