// const ApplicationSchema = require('../modules/application.model.js');
import Application  from '../modules/application.model.js';
import  Job from '../modules/job.model.js';
import mongoose from "mongoose";


export const postJob = async (req, res)=>{
    try {
        const {title, description, requirements, salary, location, jobType, experienceLevel, position, companyId, currency, skills }=req.body
        const userid=req.id
        if(!title|| !description|| !requirements|| !salary|| !location|| !jobType||!experienceLevel|| !position|| !companyId|| !currency || !skills){
            return res.status(400).json({ message: "Complete the missing field", success: false });

        };
        const job = await Job.create( {
            title,
            description,
            requirements: requirements, // Requirements are now an array from frontend
            salary:Number(salary),
            location, 
            jobType,
            experience:experienceLevel, // Use experienceLevel from body for the 'experience' model field
            position, 
            company:companyId,
            created_by:userid
            currency, // Add currency
            skills, // Add skills
        });
        return res.status(201).json({message:"Job posted successfully", success:true, job})
    } catch (error) {
        console.log(error)
        return res
        .status(500)
        .json({ message: "Internal server error", success: false });
        
    }

}
export const getAllJobs = async (req, res) => {
    try {
        // Safely access keyword from query
        const keyword = req.query.keyword || "";
        // Define MongoDB query
        const query = {
            $or: [
                { title: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
            ],
        };

        // Fetch jobs from database
        const jobs = await Job.find(query)
            .populate('company')
            .sort({ createdAt: -1 });

        // Handle no jobs found
        if (jobs.length === 0) {
            return res.status(200).json({ jobs: [], success: true });
        }

        // Success response
        return res.status(200).json({
            jobs,
            success: true,
        });
    } catch (error) {
        console.error("Error fetching jobs:", error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

export const getJobById = async (req, res)=>{
    try {
        const jobid= req.params.id;
        // const job = await Job.findById(jobid)
        if (!mongoose.Types.ObjectId.isValid(jobid)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Job ID format"
            });
        }
    
        const job = await Job.findById(jobid).populate({
            path:"applications"
        })

        if (!job){
            return res.status(404).json({ message: "Job not found", success: false });
        }
        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.error("Error fetching job:", error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }

}
//admin kitten jobs creation 
export const getAdminJobs = async (req, res)=>{
    try {
        const AdminId=req.id;
        const jobs= await Job.find({created_by:AdminId})
            .populate({ path:'company' })
            .sort({ createdAt:-1 });
        return res.status(200).json({jobs,
             success:true})
    } catch (error) {
        console.log(error)
    }
}
