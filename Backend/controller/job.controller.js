// const ApplicationSchema = require('../modules/application.model.js');
import { create } from 'domain';
import Application  from '../modules/application.model.js';
import  Job from '../modules/job.module.js';
import mongoose from "mongoose";


export const postJob = async (req, res)=>{
    try {
        const {title, description, requirements, salary, location, jobType, experience, position, companyId }=req.body
        const userid=req.id
        if(!title|| !description|| !requirements|| !salary|| !location|| !jobType||!experience|| !position|| !companyId){
            return res.status(400).json({ message: "Complete the missing field", success: false });

        };
        const job = await Job.create( {
            title,
            description,
            requirements:requirements.split(","),
            salary:Number(salary),
            location, 
            jobType,
            experience:experience,
            position, 
            company:companyId,
            created_by:userid
        });
        return res.status(200).json({message:"job application successful", suceess:true})
        console.log("application successfull")
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
            return res.status(404).json({ message: "Jobs not found", success: false });
            alert('job not available yet, come back later')
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
        const jobs= await Job.find({created_by:AdminId}).populate({
            path:'Company',
            createAt:-1
        });
        if (!jobs){

            return res.status(404).json({
                message:jobs, 
                success:false
            })
        }
        return res.status(200).json({jobs,
             success:true})
    } catch (error) {
        console.log(error)
    }
}