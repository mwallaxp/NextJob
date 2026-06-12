import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    job:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Job",
        required:true
    },
     applicant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String,
        enum:["pending", "accepted","rejected"],
        default:"pending"
    },
    interviewStage: {
        type: String,
        enum: ["applied", "screening", "interview", "offer", "hired", "rejected"],
        default: "applied"
    },
    recruiterComment: {
        type: String,
        default: ""
    },
    notes: [{
        text: {
            type: String,
            required: true
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},{timestamps:true}
);
const Application = mongoose.model("Application", applicationSchema);
export default Application;
