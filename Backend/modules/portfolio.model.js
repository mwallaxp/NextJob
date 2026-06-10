import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    title: String,
    bio: String,
    skills: [{
        name: String,
        proficiency: {
            type: String,
            enum: ["beginner", "intermediate", "expert"]
        }
    }],
    experience: [{
        title: String,
        company: String,
        description: String,
        startDate: Date,
        endDate: Date,
        isCurrent: Boolean
    }],
    education: [{
        school: String,
        degree: String,
        field: String,
        startDate: Date,
        endDate: Date
    }],
    projects: [{
        title: String,
        description: String,
        image: String,
        link: String,
        technologies: [String],
        startDate: Date,
        endDate: Date
    }],
    certifications: [{
        name: String,
        issuer: String,
        dateIssued: Date,
        credentialUrl: String
    }],
    socialLinks: {
        github: String,
        linkedin: String,
        portfolio: String,
        twitter: String
    },
    hourlyRate: Number,
    availability: {
        type: String,
        enum: ["available", "busy", "unavailable"]
    }
}, { timestamps: true });

const Portfolio = mongoose.model("Portfolio", portfolioSchema);
export default Portfolio;
