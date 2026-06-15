import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import { JOB_API_END_POINT } from "../../../utils/constant";
import { Edit2, Eye, MoreHorizontal, PauseCircle, PlayCircle, XCircle } from "lucide-react";

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

  const updateStatus = async (jobId, status) => {
    try {
      const res = await api.patch(`${JOB_API_END_POINT}/${jobId}/status`, { status });
      if (res.data.success) {
        setFilterJobs((jobs) => jobs.map((job) => (job._id === jobId ? { ...job, status } : job)));
        setPopoverOpen(null);
      }
    } catch (error) {
      console.error("Unable to update job status", error);
    }
  };

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <table className="min-w-full border-collapse">
        <caption className="border-b border-zinc-200 p-5 text-left">
          <span className="block text-lg font-semibold text-zinc-950">Recent posted jobs</span>
          <span className="mt-1 block text-sm text-zinc-500">Open each role to review candidates and status.</span>
        </caption>
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-[0.16em] text-zinc-500">
            <th className="px-5 py-4 text-left font-semibold">Date</th>
            <th className="px-5 py-4 text-left font-semibold">Role</th>
            <th className="px-5 py-4 text-left font-semibold">Company</th>
            <th className="px-5 py-4 text-left font-semibold">Applicants</th>
            <th className="px-5 py-4 text-left font-semibold">Status</th>
            <th className="px-5 py-4 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {filterJobs.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-5 py-10 text-center text-zinc-500">
                No jobs found matching your criteria
              </td>
            </tr>
          ) : (
            filterJobs.map((job) => (
              <tr key={job._id} className="transition hover:bg-zinc-50">
                <td className="px-5 py-4 text-sm text-zinc-500">
                  {new Date(job.createdAt).toISOString().split('T')[0]}
                </td>
                <td className="px-5 py-4">
                  <p className="font-semibold text-zinc-950">{job.title}</p>
                  <p className="mt-1 text-xs text-zinc-500">{job.location || "Location not set"} - {job.jobType}</p>
                </td>
                <td className="px-5 py-4 text-sm text-zinc-600">{job.company?.name || 'N/A'}</td>
                <td className="px-5 py-4 text-sm font-semibold text-zinc-950">{job.applications?.length || 0}</td>
                <td className="px-5 py-4">
                  <span className={`
                    inline-flex rounded-full px-3 py-1 text-xs font-semibold
                    ${job.status === 'closed' ? 'bg-zinc-200 text-zinc-700' : 
                     job.status === 'paused' ? 'bg-amber-100 text-amber-800' : 
                     'bg-emerald-100 text-emerald-800'}
                  `}>
                    {(job.status || "active").toUpperCase()}
                  </span>
                </td>
                <td className="relative px-5 py-4 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePopover(job._id);
                    }}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-950"
                    title="Open job actions"
                  >
                    <MoreHorizontal size={18} />
                  </button>
                  
                  {isPopoverOpen === job._id && (
                    <div className="absolute right-5 top-14 z-10 w-48 rounded-xl border border-zinc-200 bg-white py-2 text-sm shadow-xl">
                      <button
                        onClick={() => navigate(`/admin/jobs/${job._id}/edit`)}
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit job
                      </button>
                      <button
                        onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
                      >
                        <Eye className="w-4 h-4" />
                        View Applicants
                      </button>
                      <button
                        onClick={() => updateStatus(job._id, "paused")}
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
                      >
                        <PauseCircle className="w-4 h-4" />
                        Pause job
                      </button>
                      <button
                        onClick={() => updateStatus(job._id, "active")}
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
                      >
                        <PlayCircle className="w-4 h-4" />
                        Reopen job
                      </button>
                      <button
                        onClick={() => updateStatus(job._id, "closed")}
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4" />
                        Close job
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
