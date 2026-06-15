import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetAllAdminJobs from "../Hooks/useGetAllAdminJobs";
import useGetAllCompanies from "../Hooks/useGetAllCompanies";
import {
  ArrowUpRight,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock3,
  Plus,
  Search,
  Users,
} from "lucide-react";

const StatTile = ({ icon, label, value, tone = "dark" }) => (
  <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${tone === "dark" ? "bg-zinc-950 text-white" : "bg-zinc-100 text-zinc-950"}`}>
        {icon}
      </div>
      <ArrowUpRight size={18} className="text-zinc-400" />
    </div>
    <p className="mt-6 text-3xl font-semibold tracking-tight text-zinc-950">{value}</p>
    <p className="mt-1 text-sm font-medium text-zinc-500">{label}</p>
  </div>
);

const AdminDashboard = () => {
  useGetAllAdminJobs();
  useGetAllCompanies();

  const { allAdminJobs = [] } = useSelector((store) => store.job);
  const { companies = [] } = useSelector((store) => store.company);
  const { user } = useSelector((store) => store.auth);

  const totalApplicants = allAdminJobs.reduce((count, job) => count + (job.applications?.length || 0), 0);
  const activeJobs = allAdminJobs.filter((job) => !job.status || job.status === "active").length;
  const latestJobs = allAdminJobs.slice(0, 5);
  const averageApplicants = allAdminJobs.length ? Math.round(totalApplicants / allAdminJobs.length) : 0;

  return (
    <div className="space-y-8 bg-white">
      <section className="grid gap-6 border-b border-zinc-200 pb-8 lg:grid-cols-[1fr_320px]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-500">Recruiter dashboard</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-zinc-950">
            Move jobs from posted to hired with a sharper workflow.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-500">
            Welcome{user?.fullname ? `, ${user.fullname}` : ""}. Track job activity, keep company profiles ready, and review candidates from one focused workspace.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/admin/jobs/create"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              <Plus size={16} />
              Post job
            </Link>
            <Link
              to="/admin/companies/create"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-300 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:border-zinc-950"
            >
              <Building2 size={16} />
              Add company
            </Link>
          </div>
        </div>

        <div className="rounded-2xl bg-zinc-950 p-6 text-white">
          <p className="text-sm font-semibold text-zinc-400">Hiring pulse</p>
          <p className="mt-4 text-5xl font-semibold tracking-tight">{averageApplicants}</p>
          <p className="mt-2 text-sm text-zinc-400">average applicants per job</p>
          <div className="mt-8 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-white/10 p-3">
              <p className="text-zinc-400">Jobs</p>
              <p className="mt-1 text-xl font-semibold">{allAdminJobs.length}</p>
            </div>
            <div className="rounded-xl bg-white/10 p-3">
              <p className="text-zinc-400">Companies</p>
              <p className="mt-1 text-xl font-semibold">{companies.length}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatTile icon={<Briefcase size={18} />} label="Total job posts" value={allAdminJobs.length} />
        <StatTile icon={<CheckCircle2 size={18} />} label="Active jobs" value={activeJobs} tone="soft" />
        <StatTile icon={<Users size={18} />} label="Total applicants" value={totalApplicants} tone="soft" />
        <StatTile icon={<Building2 size={18} />} label="Company profiles" value={companies.length} tone="soft" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-zinc-200 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-zinc-950">Recent job posts</h2>
              <p className="text-sm text-zinc-500">Newest openings and applicant volume.</p>
            </div>
            <Link to="/admin/jobs" className="text-sm font-semibold text-zinc-950 underline-offset-4 hover:underline">
              View all
            </Link>
          </div>

          <div className="divide-y divide-zinc-100">
            {latestJobs.length === 0 ? (
              <div className="p-8 text-center">
                <Briefcase className="mx-auto h-8 w-8 text-zinc-300" />
                <p className="mt-3 font-semibold text-zinc-950">No jobs posted yet</p>
                <p className="mt-1 text-sm text-zinc-500">Create your first job post to start collecting applicants.</p>
              </div>
            ) : (
              latestJobs.map((job) => (
                <div key={job._id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-zinc-950">{job.title}</p>
                    <p className="mt-1 text-sm text-zinc-500">{job.company?.name || "Company not set"} - {job.location}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
                      {job.applications?.length || 0} applicants
                    </span>
                    <Link
                      to={`/admin/jobs/${job._id}/applicants`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-zinc-950 text-white transition hover:bg-zinc-800"
                      title="View applicants"
                    >
                      <ArrowUpRight size={16} />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5 text-zinc-950" />
              <h2 className="font-semibold text-zinc-950">Recommended next steps</h2>
            </div>
            <div className="mt-5 space-y-4 text-sm text-zinc-600">
              <p>Keep salary ranges visible on every post to improve applicant quality.</p>
              <p>Add focused skills to each job so the applicant match score has useful data.</p>
              <p>Review pending applicants daily and move them to shortlisted or rejected quickly.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <Clock3 className="h-5 w-5 text-zinc-950" />
              <h2 className="font-semibold text-zinc-950">Fast actions</h2>
            </div>
            <div className="mt-5 grid gap-3">
              <Link to="/recruiter/jobs/create" className="rounded-xl border border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:border-zinc-950">
                Publish another opening
              </Link>
              <Link to="/admin/companies" className="rounded-xl border border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:border-zinc-950">
                Manage company profiles
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
