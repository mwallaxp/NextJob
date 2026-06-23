import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useGetAllAdminJobs from "../Hooks/useGetAllAdminJobs";
import RecruiterJobsTable from './RecruiterJobsTable'
import { setSearchJobByText } from "../../../redux/jobSlice";
import { Briefcase, CheckCircle2, Plus, Search, Users } from "lucide-react";
import { ROUTES } from "../../../routes/paths";
import PageHeader from "../../../components/recruiter/PageHeader";
import StatTile from "../../../components/recruiter/StatTile";

const RecruiterJobs = () => {
  const [input, setInput]=useState("")
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const meta = useGetAllAdminJobs({ search: input, status, page, limit: 10 });
  const navigate =useNavigate()
  const dispatch =useDispatch()
  const { allAdminJobs = [] } = useSelector((store) => store.job);

  const metrics = useMemo(() => {
    const active = allAdminJobs.filter((job) => !job.status || job.status === "active").length;
    const applicants = allAdminJobs.reduce((total, job) => total + (job.applications?.length || 0), 0);
    return { active, applicants };
  }, [allAdminJobs]);

useEffect(()=>{
    dispatch(setSearchJobByText(input))
    setPage(1);
}, [dispatch, input, status])

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Job postings"
        title="Manage openings"
        description="Search roles, check applicant volume, and move candidates from review to decision."
        actions={(
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
            onClick={() => navigate(ROUTES.RECRUITER_JOB_CREATE)}
          >
            <Plus size={16} />
            New job
          </button>
        )}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatTile icon={<Briefcase size={17} />} label="Total posts" value={allAdminJobs.length} />
        <StatTile icon={<CheckCircle2 size={17} />} label="Active posts" value={metrics.active} tone="soft" />
        <StatTile icon={<Users size={17} />} label="Applicants" value={metrics.applicants} tone="soft" />
      </div>

      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full rounded-full border border-zinc-200 bg-white px-11 py-3 text-sm shadow-sm outline-none transition focus:border-zinc-950 focus:ring-4 focus:ring-zinc-950/10"
            placeholder="Search jobs or companies"
          />
        </div>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="rounded-full border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-700 outline-none transition focus:border-zinc-950 focus:ring-4 focus:ring-zinc-950/10"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="closed">Closed</option>
        </select>
        <RecruiterJobsTable/>
        <div className="flex w-full items-center justify-between gap-3 text-sm text-zinc-500">
          <span>{meta.total} jobs found</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(current - 1, 1))}
              className="rounded-full border border-zinc-200 px-4 py-2 font-semibold text-zinc-950 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <span>Page {meta.currentPage} of {meta.totalPages || 1}</span>
            <button
              type="button"
              disabled={page >= meta.totalPages}
              onClick={() => setPage((current) => current + 1)}
              className="rounded-full border border-zinc-200 px-4 py-2 font-semibold text-zinc-950 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterJobs;
