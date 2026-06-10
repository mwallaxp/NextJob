import Portfolio from "../modules/portfolio.model.js";
import catchAsync from "../catchAsync.js";
import AppError from "../AppError.js";

// Create or update portfolio
export const savePortfolio = catchAsync(async (req, res) => {
    const { userId } = req.params;
    const portfolioData = req.body;

    let portfolio = await Portfolio.findOne({ userId });

    if (portfolio) {
        portfolio = await Portfolio.findOneAndUpdate(
            { userId },
            portfolioData,
            { new: true }
        );
    } else {
        portfolio = await Portfolio.create({
            userId,
            ...portfolioData
        });
    }

    res.json({
        success: true,
        portfolio
    });
});

// Get portfolio
export const getPortfolio = catchAsync(async (req, res) => {
    const { userId } = req.params;

    const portfolio = await Portfolio.findOne({ userId })
        .populate("userId", "fullname email profilePhoto");

    if (!portfolio) {
        throw new AppError("Portfolio not found", 404);
    }

    res.json({
        success: true,
        portfolio
    });
});

// Add project to portfolio
export const addProject = catchAsync(async (req, res) => {
    const { userId } = req.params;
    const projectData = req.body;

    const portfolio = await Portfolio.findOneAndUpdate(
        { userId },
        { $push: { projects: projectData } },
        { new: true }
    );

    if (!portfolio) {
        throw new AppError("Portfolio not found", 404);
    }

    res.json({
        success: true,
        portfolio
    });
});

// Update project in portfolio
export const updateProject = catchAsync(async (req, res) => {
    const { userId, projectId } = req.params;
    const projectData = req.body;

    const portfolio = await Portfolio.findOneAndUpdate(
        { userId, "projects._id": projectId },
        { $set: { "projects.$": projectData } },
        { new: true }
    );

    if (!portfolio) {
        throw new AppError("Project not found", 404);
    }

    res.json({
        success: true,
        portfolio
    });
});

// Add skill to portfolio
export const addSkill = catchAsync(async (req, res) => {
    const { userId } = req.params;
    const { name, proficiency } = req.body;

    const portfolio = await Portfolio.findOneAndUpdate(
        { userId },
        { $push: { skills: { name, proficiency } } },
        { new: true }
    );

    if (!portfolio) {
        throw new AppError("Portfolio not found", 404);
    }

    res.json({
        success: true,
        portfolio
    });
});

// Add experience
export const addExperience = catchAsync(async (req, res) => {
    const { userId } = req.params;
    const experienceData = req.body;

    const portfolio = await Portfolio.findOneAndUpdate(
        { userId },
        { $push: { experience: experienceData } },
        { new: true }
    );

    if (!portfolio) {
        throw new AppError("Portfolio not found", 404);
    }

    res.json({
        success: true,
        portfolio
    });
});

// Add education
export const addEducation = catchAsync(async (req, res) => {
    const { userId } = req.params;
    const educationData = req.body;

    const portfolio = await Portfolio.findOneAndUpdate(
        { userId },
        { $push: { education: educationData } },
        { new: true }
    );

    if (!portfolio) {
        throw new AppError("Portfolio not found", 404);
    }

    res.json({
        success: true,
        portfolio
    });
});
