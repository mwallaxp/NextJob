import { populate } from "dotenv";
import Application from "../modules/application.model.js";

import Job from "../modules/job.module.js";

// Apply for a Job
export const Applyjob = async (req, res) => {
  try {
    const userid = req.id; 
    const jobid = req.params.id;

    if (!jobid) {
      return res.status(400).json({ message: "Job ID is required", success: false });
    }

    const existingApplication = await Application.findOne({
      job: jobid,
      applicant: userid,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
        success: false,
      });
    }

    const job = await Job.findById(jobid);
    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }

    const newApplication = await Application.create({
      job: jobid,
      applicant: userid,
    });

    job.applications.push(newApplication._id);
    await job.save();

    return res
      .status(200)
      .json({ message: "Job application successful", success: true });
  } catch (error) {
    console.error("Error applying for job:", error);
    return res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

// Get Applied Jobs
export const getAppliedJob = async (req, res) => {
  try {
    const userId = req.id;
    const applications = await Application
      .find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        populate: {
          path: "company",
          options: {sort:{createdAt:-1}}, // Customize fields to retrieve
        },
      });

    if (!applications || applications.length === 0) {
      return res.status(404).json({ message: "No applications found", success: false });
    }

    return res.status(200).json({
       applications,
        success: true });
        
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    return res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

// Get Applicants for a Job
export const getApplicants = async (req, res) => {
  try {
    const jobid = req.params.id;

    const job = await Job.findById(jobid).populate({
      path: "applications",
      populate: {
        path: "applicant",
        options: {sort:{createdAt:-1}}, // Customize fields to retrieve
          },
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }

    return res.status(200).json({ applicants: job.applications, success: true });
  } catch (error) {
    console.error("Error fetching applicants:", error);
    return res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

// Update Application Status
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationid = req.params.id;

    if (!status) {
      return res.status(400).json({ message: "Status is required", success: false });
    }

    const applicationToUpdate = await Application.findById({_id:applicationid});
    if (!applicationToUpdate) {
      return res.status(404).json({ message: "Application not found", success: false });
    }

    applicationToUpdate.status = status.toLowerCase();
    await applicationToUpdate.save();

    return res
      .status(200)
      .json({ message: "Status updated successfully", success: true });
  } catch (error) {
    console.error("Error updating status:", error);
    return res.status(500).json({ message: "Internal Server Error", success: false });
  }
};
