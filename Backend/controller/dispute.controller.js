import Dispute from "../modules/dispute.model.js";
import catchAsync from "../catchAsync.js";
import AppError from "../AppError.js";

// Create dispute
export const createDispute = catchAsync(async (req, res) => {
    const { jobId, paymentId, claimantId, respondentId, reason, title, description, evidence } = req.body;

    if (!reason || !title || !description) {
        throw new AppError("Reason, title, and description are required", 400);
    }

    // Check if dispute already exists for this job
    const existingDispute = await Dispute.findOne({
        jobId,
        status: { $ne: "closed" }
    });

    if (existingDispute) {
        throw new AppError("Dispute already exists for this job", 400);
    }

    const dispute = await Dispute.create({
        jobId,
        paymentId,
        claimantId,
        respondentId,
        reason,
        title,
        description,
        evidence: evidence || [],
        status: "open",
        timelineEvents: [{
            event: "Dispute opened",
            timestamp: new Date(),
            userId: claimantId
        }]
    });

    res.status(201).json({
        success: true,
        dispute
    });
});

// Get dispute
export const getDispute = catchAsync(async (req, res) => {
    const { disputeId } = req.params;

    const dispute = await Dispute.findById(disputeId)
        .populate("claimantId", "fullname email profilePhoto")
        .populate("respondentId", "fullname email profilePhoto")
        .populate("jobId");

    if (!dispute) {
        throw new AppError("Dispute not found", 404);
    }

    res.json({
        success: true,
        dispute
    });
});

// Get user disputes
export const getUserDisputes = catchAsync(async (req, res) => {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const disputes = await Dispute.find({
        $or: [{ claimantId: userId }, { respondentId: userId }]
    })
        .populate("claimantId", "fullname email")
        .populate("respondentId", "fullname email")
        .populate("jobId", "title")
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

    const total = await Dispute.countDocuments({
        $or: [{ claimantId: userId }, { respondentId: userId }]
    });

    res.json({
        success: true,
        disputes,
        total,
        pages: Math.ceil(total / limit)
    });
});

// Add evidence to dispute
export const addEvidence = catchAsync(async (req, res) => {
    const { disputeId } = req.params;
    const { evidence } = req.body;

    const dispute = await Dispute.findByIdAndUpdate(
        disputeId,
        {
            $push: {
                evidence: { $each: evidence || [] }
            }
        },
        { new: true }
    );

    if (!dispute) {
        throw new AppError("Dispute not found", 404);
    }

    res.json({
        success: true,
        dispute
    });
});

// Submit response (admin/mediator)
export const submitDisputeResponse = catchAsync(async (req, res) => {
    const { disputeId } = req.params;
    const { response, userId } = req.body;

    const dispute = await Dispute.findByIdAndUpdate(
        disputeId,
        {
            status: "in-review",
            $push: {
                timelineEvents: {
                    event: response,
                    timestamp: new Date(),
                    userId
                }
            }
        },
        { new: true }
    );

    if (!dispute) {
        throw new AppError("Dispute not found", 404);
    }

    res.json({
        success: true,
        dispute
    });
});

// Resolve dispute (admin/mediator)
export const resolveDispute = catchAsync(async (req, res) => {
    const { disputeId } = req.params;
    const { resolutionStatus, refundAmount, mediatorNotes } = req.body;

    const dispute = await Dispute.findByIdAndUpdate(
        disputeId,
        {
            status: "resolved",
            resolution: {
                status: resolutionStatus,
                resolutionDescription: resolutionStatus,
                refundAmount,
                mediatorNotes
            },
            $push: {
                timelineEvents: {
                    event: `Dispute resolved: ${resolutionStatus}`,
                    timestamp: new Date()
                }
            }
        },
        { new: true }
    );

    if (!dispute) {
        throw new AppError("Dispute not found", 404);
    }

    res.json({
        success: true,
        dispute
    });
});

// Get all disputes (admin)
export const getAllDisputes = catchAsync(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || null;

    const filter = status ? { status } : {};

    const disputes = await Dispute.find(filter)
        .populate("claimantId", "fullname email")
        .populate("respondentId", "fullname email")
        .populate("jobId", "title")
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

    const total = await Dispute.countDocuments(filter);

    res.json({
        success: true,
        disputes,
        total,
        pages: Math.ceil(total / limit)
    });
});
