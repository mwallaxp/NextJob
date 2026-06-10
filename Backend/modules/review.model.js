import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true
    },
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    reviewType: {
        type: String,
        enum: ["client-to-freelancer", "freelancer-to-client"],
        required: true
    },
    tags: [String], // e.g., "Professionalism", "Communication", "Quality"
    isPublic: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Index for efficient queries
reviewSchema.index({ toUserId: 1, createdAt: -1 });
reviewSchema.index({ fromUserId: 1, createdAt: -1 });

const Review = mongoose.model("Review", reviewSchema);
export default Review;
