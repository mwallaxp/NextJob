import React from 'react';
import { LatestJobCards } from './LatestJobCards';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const LatestJob = () => {
  const { allJobs } = useSelector((store) => store.job);
 
  const navigate = useNavigate()

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-8">
        <span className="bg-blue-600 text-white px-2 py-1 rounded-md">Latest</span> & Top Job Openings
      </h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allJobs.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            <span>No job openings available at the moment. Please check back later!</span>
          </div>
        ) : (
          allJobs.slice(0, 6).map((job) => (
            <LatestJobCards key={job._id} job={job} />
          ))
        )}
      </div>
    </div>
  );
};
