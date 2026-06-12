import Review from "../modules/review.model.js";
import catchAsync from "../catchAsync.js";
import AppError from "../AppError.js";

// Create review
export const createReview = catchAsync(async (req, res, next) => {
    const { jobId, fromUserId, toUserId, rating, title, comment, reviewType, tags } = req.body;

    if (!rating || rating < 1 || rating > 5) {
        throw new AppError("Rating must be between 1 and 5", 400);
    }

    if (!title || !comment) {
        throw new AppError("Title and comment are required", 400);
    }

    // Check if user has already reviewed this person for this job
    const existingReview = await Review.findOne({
        jobId,
        fromUserId,
        toUserId
    });

    if (existingReview) {
        throw new AppError("You have already reviewed this user for this job", 400);
    }

    const review = await Review.create({
        jobId,
        fromUserId,
        toUserId,
        rating,
        title,
        comment,
        reviewType,
        tags: tags || []
    });

    res.status(201).json({
        success: true,
        review
    });
});

// Get user reviews
export const getUserReviews = catchAsync(async (req, res, next) => {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const reviews = await Review.find({
        toUserId: userId,
        isPublic: true
    })
        .populate("fromUserId", "fullname profilePhoto")
        .populate("jobId", "title")
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

    const total = await Review.countDocuments({
        toUserId: userId,
        isPublic: true
    });

    // Calculate average rating
    const ratingStats = await Review.aggregate([
        { $match: { toUserId: userId, isPublic: true } },
        {
            $group: {
                _id: null,
                averageRating: { $avg: "$rating" },
                totalReviews: { $sum: 1 }
            }
        }
    ]);

    res.json({
        success: true,
        reviews,
        stats: ratingStats[0] || { averageRating: 0, totalReviews: 0 },
        total,
        pages: Math.ceil(total / limit)
    });
});

// Get reviews by user (reviews they've written)
export const getReviewsByUser = catchAsync(async (req, res, next) => {
    const { userId } = req.params;

    const reviews = await Review.find({
        fromUserId: userId
    })
        .populate("toUserId", "fullname profilePhoto")
        .populate("jobId", "title")
        .sort({ createdAt: -1 });

    res.json({
        success: true,
        reviews
    });
});

// Update review
export const updateReview = catchAsync(async (req, res, next) => {
    const { reviewId } = req.params;
    const { rating, title, comment, tags } = req.body;

    const review = await Review.findByIdAndUpdate(
        reviewId,
        {
            ...(rating && { rating }),
            ...(title && { title }),
            ...(comment && { comment }),
            ...(tags && { tags })
        },
        { new: true }
    );

    if (!review) {
        throw new AppError("Review not found", 404);
    }

    res.json({
        success: true,
        review
    });
});

// Delete review
export const deleteReview = catchAsync(async (req, res, next) => {
    const { reviewId } = req.params;

    await Review.findByIdAndDelete(reviewId);

    res.json({
        success: true,
        message: "Review deleted"
    });
});
