import "./PostJobs.css";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { JOB_API_END_POINT } from "../../../utils/constant";
import NavBar from "../shared/NavBar";
import {
  Loader2,
  Briefcase,
  DollarSign,
  MapPin,
  Clock,
  Award,
  Users,
  Building,
  Check,
} from "lucide-react";

const PostJobs = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const { companies } = useSelector((store) => store.company);

  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    experience: "",
    position: "",
    companyId: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setTimeout(() => {
      document.querySelector(".form-container").classList.add("visible");
    }, 100);
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!input.title) newErrors.title = "Job title is required";
    if (!input.description) newErrors.description = "Description is required";
    if (!input.requirements) newErrors.requirements = "Requirements are required";
    if (!input.salary) newErrors.salary = "Salary information is required";
    else if (!/^\d+([,-]\d+)?$/.test(input.salary.replace(/\s/g, "")))
      newErrors.salary = "Salary must be a number or range (e.g., 80000 or 80000-100000)";
    if (!input.location) newErrors.location = "Location is required";
    if (!input.jobType) newErrors.jobType = "Job type is required";
    if (!input.experience) newErrors.experience = "Experience level is required";
    if (!input.position || input.position <= 0) newErrors.position = "Number of positions must be greater than 0";
    if (!input.companyId) newErrors.companyId = "Company selection is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: name === "position" ? (value ? parseInt(value, 10) : "") : value });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (loading || !validate()) return;

    try {
      setLoading(true);
      const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success) {
        setSubmitted(true);
        setTimeout(() => navigate("/admin/jobs"), 2000);
      }
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || "An error occurred while posting the job",
      });
    } finally {
      setLoading(false);
    }
  };

  const jobTypes = ["Full-Time", "Part-Time", "Contract", "Remote", "Internship"];
  const experienceLevels = ["Entry Level", "Mid Level", "Senior", "Manager", "Executive"];

  if (submitted) {
    return (
      <div>
        <NavBar />
        <div className="flex flex-col items-center justify-center min-h-[70vh] p-8">
          <div className="bg-green-50 border-2 border-green-500 rounded-full p-4 mb-6 animate-bounce">
            <Check size={48} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Job Posted Successfully!</h2>
          <p className="text-gray-600 mb-6">Redirecting to jobs dashboard...</p>
          <button
            onClick={() => {
              setSubmitted(false);
              setInput({
                title: "",
                description: "",
                requirements: "",
                salary: "",
                location: "",
                jobType: "",
                experience: "",
                position: "",
                companyId: "",
              });
              setErrors({});
            }}
            className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            Post Another Job
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar />
      <div className="container mx-auto py-8">
        <div className="form-container">
          <h1 className="text-3xl font-bold text-center mb-2">Post a New Job</h1>
          <p className="text-gray-600 text-center mb-8">Fill out the form below to create a new job posting</p>
          <form
            onSubmit={submitHandler}
            className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto border border-gray-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2 md:col-span-1">
                <label htmlFor="title" className="flex items-center mb-2">
                  <Briefcase size={18} className="mr-2 text-blue-600" />
                  <span className="font-medium text-gray-700">Job Title</span>
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  placeholder="e.g. Senior React Developer"
                  value={input.title}
                  onChange={changeEventHandler}
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>
              <div className="col-span-2 md:col-span-1">
                <label htmlFor="salary" className="flex items-center mb-2">
                  <DollarSign size={18} className="mr-2 text-green-600" />
                  <span className="font-medium text-gray-700">Salary Range</span>
                </label>
                <input
                  type="text"
                  name="salary"
                  id="salary"
                  placeholder="e.g. 80000 or 80000-100000"
                  value={input.salary}
                  onChange={changeEventHandler}
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.salary ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.salary && <p className="text-red-500 text-sm mt-1">{errors.salary}</p>}
              </div>
              <div className="col-span-2 md:col-span-1">
                <label htmlFor="location" className="flex items-center mb-2">
                  <MapPin size={18} className="mr-2 text-red-600" />
                  <span className="font-medium text-gray-700">Location</span>
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  placeholder="e.g. San Francisco, CA"
                  value={input.location}
                  onChange={changeEventHandler}
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.location ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>
              <div className="col-span-2 md:col-span-1">
                <label htmlFor="jobType" className="flex items-center mb-2">
                  <Clock size={18} className="mr-2 text-purple-600" />
                  <span className="font-medium text-gray-700">Job Type</span>
                </label>
                <select
                  name="jobType"
                  id="jobType"
                  value={input.jobType}
                  onChange={changeEventHandler}
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.jobType ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select Job Type</option>
                  {jobTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.jobType && <p className="text-red-500 text-sm mt-1">{errors.jobType}</p>}
              </div>
              <div className="col-span-2 md:col-span-1">
                <label htmlFor="experience" className="flex items-center mb-2">
                  <Award size={18} className="mr-2 text-yellow-600" />
                  <span className="font-medium text-gray-700">Experience Level</span>
                </label>
                <select
                  name="experience"
                  id="experience"
                  value={input.experience}
                  onChange={changeEventHandler}
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.experience ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select Experience Level</option>
                  {experienceLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
                {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
              </div>
              <div className="col-span-2 md:col-span-1">
                <label htmlFor="position" className="flex items-center mb-2">
                  <Users size={18} className="mr-2 text-indigo-600" />
                  <span className="font-medium text-gray-700">Number of Positions</span>
                </label>
                <input
                  type="number"
                  name="position"
                  id="position"
                  placeholder="e.g. 2"
                  min="1"
                  value={input.position}
                  onChange={changeEventHandler}
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.position ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position}</p>}
              </div>
              <div className="col-span-2 md:col-span-1">
                <label htmlFor="company" className="flex items-center mb-2">
                  <Building size={18} className="mr-2 text-gray-600" />
                  <span className="font-medium text-gray-700">Company</span>
                </label>
                {companies.length > 0 ? (
                  <select
                    id="company"
                    onChange={(e) => {
                      setInput({ ...input, companyId: e.target.value });
                      if (errors.companyId) setErrors({ ...errors, companyId: null });
                    }}
                    className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.companyId ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Company</option>
                    {companies.map((company) => (
                      <option value={company._id} key={company._id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
                    Please register a company first
                  </div>
                )}
                {errors.companyId && <p className="text-red-500 text-sm mt-1">{errors.companyId}</p>}
              </div>
              <div className="col-span-2">
                <label htmlFor="description" className="block font-medium text-gray-700 mb-2">
                  Job Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows="4"
                  placeholder="Describe the responsibilities and expectations for this role"
                  value={input.description}
                  onChange={changeEventHandler}
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>
              <div className="col-span-2">
                <label htmlFor="requirements" className="block font-medium text-gray-700 mb-2">
                  Requirements
                </label>
                <textarea
                  name="requirements"
                  id="requirements"
                  rows="4"
                  placeholder="List required skills, education, and experience (separate by commas, e.g., JavaScript, React, 3+ years experience)"
                  value={input.requirements}
                  onChange={changeEventHandler}
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.requirements ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.requirements && <p className="text-red-500 text-sm mt-1">{errors.requirements}</p>}
              </div>
            </div>
            {errors.submit && (
              <div className="mt-6 p-4 bg-red-50 border border-red-300 rounded-md text-red-600">
                {errors.submit}
              </div>
            )}
            <div className="mt-8">
              {loading ? (
                <button
                  disabled
                  className="w-full p-4 bg-gray-300 text-gray-600 rounded-md flex items-center justify-center"
                >
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </button>
              ) : (
                <button
                  type="submit"
                  className="w-full p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-300 transform hover:scale-[1.01] active:scale-[0.99] font-medium text-lg"
                >
                  Post New Job
                </button>
              )}
              {companies.length === 0 && (
                <p className="text-red-600 text-center mt-4">
                  You need to register a company before posting jobs
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJobs;