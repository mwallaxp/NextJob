import React from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, Badge } from "lucide-react";

const Job = ({ job }) => {
  const navigate = useNavigate();

  const displayCreatedDate = (createdAt) => {
    if (!createdAt) return "Date not available";
    const createdDate = new Date(createdAt);
    const currentDate = new Date();
    const timeDifference = currentDate - createdDate;
    const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return daysAgo === 0 ? "Today" : `${daysAgo} days ago`;
  };

  if (!job) {
    return <div className="p-5 rounded-md shadow-xl bg-white border-gray-100">No job data available</div>;
  }

  return (
    <div className="p-5 rounded-md shadow-xl bg-white border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-700">{displayCreatedDate(job.createdAt)}</p>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Bookmark className="h-5 w-5 text-gray-600" />
        </button>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <img
          src={job?.company?.logo }
          alt={`${job?.company?.name }`}
          width={40}
          height={40}
          className="rounded"
        />
        <div>
          <h1 className="font-medium text-lg">{job?.company?.name }</h1>
          <p className="text-sm text-gray-600">{job?.company?.location }</p>
        </div>
      </div>
      <div className="mb-4">
        <h1 className="font-bold text-lg">{job?.title}</h1>
        <p className="text-gray-600 line-clamp-2">{job?.description}</p>
      </div>
      <div className="flex gap-2 flex-wrap mb-4">
        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-sm font-semibold">
          {job.position} Position{job?.position !== 1 ? "N" : ""}
        </span>
        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-sm font-semibold">
          {job?.jobType}
        </span>
        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-sm font-semibold">
          {job?.salary}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(`/description/${job?._id}`)}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
        >
          Details
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Save for Later
        </button>
      </div>
    </div>
  );
};

export default Job;