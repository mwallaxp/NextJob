import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { setSingleJob } from "../../redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  APPLICATION_API_END_POINT,
  JOB_API_END_POINT,
} from "../../utils/constant";
import { toast } from "react-toastify";

export const JobDescription = () => {
  const params = useParams();
  const jobId = params.id;
  const { singleJob } = useSelector(store => store.job);
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  // Check if user has already applied
  const isApplied = hasApplied || (user && singleJob?.applications?.some(app => app.applicant === user._id));
  const dispatch = useDispatch();

  const ApplyJobHandle = async () => {
    if (!user) {
      toast.error("Please login to apply for this job");
      return;
    }

    if (isApplied) {
      toast.info("You have already applied for this job");
      return;
    }

    setApplying(true);
    try {
      const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {
        withCredentials: true,
      });
      
      if (res.data.success) {
        setHasApplied(true);
        toast.success(res.data.message || "Application submitted successfully");
        
        // Update the job data to reflect the new application
        if (singleJob) {
          const updatedJob = {
            ...singleJob,
            applications: [...(singleJob.applications || []), { applicant: user._id }]
          };
          dispatch(setSingleJob(updatedJob));
        }
      }
    } catch (error) {
      console.error("Application error:", error);
      const errorMessage = error.response?.data?.message || "Application failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setApplying(false);
    }
  };

  useEffect(() => {
    const fetchSingleJobs = async () => {
      if (!jobId) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        
        if (res.data.success && res.data.job) {
          dispatch(setSingleJob(res.data.job));
        } else {
          toast.error("Job not found");
        }
      } catch (error) {
        console.error("Fetch job error:", error);
        const errorMessage = error.response?.data?.message || "Failed to load job details";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSingleJobs();
  }, [jobId, dispatch]);

  // Reset hasApplied when job changes
  useEffect(() => {
    setHasApplied(false);
  }, [jobId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto my-10">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/5 mb-8"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!singleJob) {
    return (
      <div className="max-w-7xl mx-auto my-10 text-center">
        <h1 className="text-xl font-bold text-gray-600">Job not found</h1>
        <p className="text-gray-500 mt-2">The job you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString.split("T")[0];
    }
  };

  const getButtonText = () => {
    if (applying) return "Applying...";
    if (isApplied) return "Already Applied";
    return "Apply Now";
  };

  const getButtonStyles = () => {
    const baseStyles = "rounded-lg font-bold p-3 transition-colors duration-200";
    
    if (applying) {
      return `${baseStyles} bg-gray-500 cursor-not-allowed text-white`;
    }
    
    if (isApplied) {
      return `${baseStyles} bg-gray-600 cursor-not-allowed text-white`;
    }
    
    return `${baseStyles} bg-[#720967] hover:bg-[#456782] text-white`;
  };

  return (
    <div className="max-w-7xl mx-auto my-10 px-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {singleJob.title || "Job Title Not Available"}
          </h1>
          <div className="flex flex-wrap gap-3 mt-4">
            {singleJob.position && (
              <span className="text-blue-700 font-semibold text-lg px-3 py-1 bg-blue-50 rounded-lg">
                {singleJob.position} {singleJob.position === 1 ? 'Position' : 'Positions'}
              </span>
            )}
            {singleJob.jobType && (
              <span className="text-red-700 font-semibold text-lg px-3 py-1 bg-red-50 rounded-lg">
                {singleJob.jobType}
              </span>
            )}
            {singleJob.salary && (
              <span className="text-purple-900 font-semibold text-lg px-3 py-1 bg-purple-50 rounded-lg">
                {singleJob.salary}
              </span>
            )}
          </div>
        </div>
        
        <button
          onClick={ApplyJobHandle}
          disabled={isApplied || applying || !user}
          className={getButtonStyles()}
          aria-label={getButtonText()}
        >
          {getButtonText()}
        </button>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold border-b-2 border-gray-300 py-4 mb-6">
          Job Details
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">Role</h3>
              <p className="text-gray-800 pl-4">{singleJob.title || "Not specified"}</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">Location</h3>
              <p className="text-gray-800 pl-4">
                {singleJob.location ? `${singleJob.location}, Nigeria` : "Nigeria"}
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">Experience Required</h3>
              <p className="text-gray-800 pl-4">
                {singleJob.experience ? `${singleJob.experience} years` : "Not specified"}
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">Salary</h3>
              <p className="text-gray-800 pl-4">{singleJob.salary || "Not disclosed"}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">Total Applications</h3>
              <p className="text-gray-800 pl-4">
                {singleJob.applications ? singleJob.applications.length : 0}
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">Posted Date</h3>
              <p className="text-gray-800 pl-4">{formatDate(singleJob.createdAt)}</p>
            </div>
          </div>
        </div>

        {singleJob.description && (
          <div className="mt-6">
            <h3 className="font-semibold text-gray-700 mb-3">Job Description</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {singleJob.description}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDescription;