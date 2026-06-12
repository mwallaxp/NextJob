import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    requirements: [{
        type: String
    }],
    salary: {
        type: String,
        required: true
    },
    salaryMin: {
        type: Number,
        default: 0
    },
    salaryMax: {
        type: Number,
        default: 0
    },
    experience: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        enum: ["USD", "NGN", "EUR", "GBP"], // Example currencies, adjust as needed
        default: "USD"
    },
    location: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        required: true
    },
    skills: [{
        type: String
    }],
    status: {
        type: String,
        enum: ["active", "paused", "closed"],
        default: "active"
    },
    position: {
        type: Number,
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    applications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application"
    }]
}, { timestamps: true });

export const Job = mongoose.model("Job", jobSchema);
export default Job;
