import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Edit2, Eye } from "lucide-react";

const AdminJobsTable = () => {
  const { searchJobByText } = useSelector((store) => store.job);
  const { allAdminJobs } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState(allAdminJobs || []);
  const navigate = useNavigate();

  useEffect(() => {
    const filteredJobs = allAdminJobs?.filter((job) => {
      if (!searchJobByText) return true;
      const searchLower = searchJobByText.toLowerCase();
      return (
        job?.title?.toLowerCase().includes(searchLower) ||
        job?.company?.name?.toLowerCase().includes(searchLower)
      );
    }) || [];
    
    setFilterJobs(filteredJobs);
  }, [allAdminJobs, searchJobByText]);

  const [isPopoverOpen, setPopoverOpen] = useState(null);

  const togglePopover = (id) => {
    setPopoverOpen(isPopoverOpen === id ? null : id);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
        <caption className="text-lg font-bold p-4 bg-gray-50 text-gray-900 text-left border-b">
          A list of your recent posted jobs
        </caption>
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="py-3 px-6 text-left font-medium text-gray-700">Date</th>
            <th className="py-3 px-6 text-left font-medium text-gray-700">Role</th>
            <th className="py-3 px-6 text-left font-medium text-gray-700">Company</th>
            <th className="py-3 px-6 text-left font-medium text-gray-700">Status</th>
            <th className="py-3 px-6 text-right font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filterJobs.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-6 text-gray-500">
                No jobs found matching your criteria
              </td>
            </tr>
          ) : (
            filterJobs.map((job) => (
              <tr key={job._id} className="hover:bg-gray-50 border-b">
                <td className="py-4 px-6">
                  {new Date(job.createdAt).toISOString().split('T')[0]}
                </td>
                <td className="py-4 px-6 font-medium text-gray-900">{job.title}</td>
                <td className="py-4 px-6">{job.company?.name || 'N/A'}</td>
                <td className="py-4 px-6">
                  <span className={`
                    inline-block px-2 py-1 rounded-full text-sm
                    ${job.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                     job.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                     'bg-green-100 text-green-800'}
                  `}>
                    {job.status?.toUpperCase()}
                  </span>
                </td>
                <td className="py-4 px-6 text-right relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePopover(job._id);
                    }}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
                  >
                    •••
                  </button>
                  
                  {isPopoverOpen === job._id && (
                    <div className="absolute right-6 top-14 z-10 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-48">
                      <button
                        onClick={() => navigate(`/Admin/jobs/${job._id}/edit`)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit Job
                      </button>
                      <button
                        onClick={() => navigate(`/Admin/jobs/${job._id}/applicants`)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Applicants
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminJobsTable;