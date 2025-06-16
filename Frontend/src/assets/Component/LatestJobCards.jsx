import { MapPin, Clock, DollarSign, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const LatestJobCards = ({ job }) => {
  //Using a sample job for preview if none is provided
  const sampleJob = {
    _id: "sample123",
    company: { name: "Design Studio" },
    title: "UI/UX Designer",
    description: "Create modern user interfaces and experiences for web and mobile applications",
    position: "Senior",
    jobType: "Remote",
    salary: "150,000"
  };
   const {user} =useSelector((store)=> store.auth)
   const navigete =useNavigate()
  //Use provided job or fallback to sample
  const jobData = job || sampleJob;
  

  const handleClick = () => {
    if(user){
      navigete("/Description/:id");
    } else{
      navigete("/login")
    }
    
  };
  
  return (
    <div 
      onClick={handleClick}
      key={job._id} 
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-100 cursor-pointer overflow-hidden"
    >
      {/* Company and Location */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h1 className="font-semibold text-lg text-gray-900">{jobData.company?.name}</h1>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <MapPin size={14} className="mr-1" />
            <h1>Nigeria</h1>
          </div>
        </div>
        <span className="inline-flex items-center bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
          Featured
        </span>
      </div>
      
      {/* Job Title and Description */}
      <div className="my-4">
        <h1 className="font-bold text-xl mb-2 text-gray-800">{jobData.title}</h1>
        <h1 className="text-sm text-gray-600 line-clamp-2">{jobData.description}</h1>
      </div>
      
      {/* Job Details Badges */}
      <div className="flex flex-wrap gap-2 mt-4">
        <div className="flex items-center bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-xs font-medium">
          <Briefcase size={14} className="mr-1" />
          {jobData.position || "Position"}
        </div>
        
        <div className="flex items-center bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full text-xs font-medium">
          <Clock size={14} className="mr-1" />
          {jobData.jobType}
        </div>
        
        <div className="flex items-center bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-medium">
          <DollarSign size={14} className="mr-1" />
          {jobData.salary} 
        </div>
      </div>
      
      {/* Apply Button */}
      <div className="mt-5 pt-4 border-t border-gray-100">
        <button onClick={handleClick} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-300">
          Apply Now
        </button>
      </div>
    </div>
  );
};