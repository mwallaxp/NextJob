import { useMemo } from "react";
import { useSelector } from "react-redux";
import useGetAllCompanies from "../Hooks/useGetAllCompanies";
import useGetAllAdminJobs from "../Hooks/useGetAllAdminJobs";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  useGetAllCompanies();
  useGetAllAdminJobs();

  const { companies } = useSelector((store) => store.company);
  const { allAdminJobs } = useSelector((store) => store.job);

  const totalApplicants = useMemo(
    () =>
      allAdminJobs?.reduce(
        (sum, job) => sum + (job?.applications?.length || job?.applicants?.length || 0),
        0
      ) || 0,
    [allAdminJobs]
  );

  const jobStatusCounts = useMemo(() => {
    const counts = { active: 0, pending: 0, closed: 0 };
    allAdminJobs?.forEach((job) => {
      const status = (job?.status || "active").toLowerCase();
      if (status.includes("pend")) counts.pending += 1;
      else if (status.includes("clos") || status === "rejected") counts.closed += 1;
      else counts.active += 1;
    });
    return counts;
  }, [allAdminJobs]);

  const topJobs = useMemo(
    () =>
      [...(allAdminJobs || [])]
        .sort(
          (a, b) =>
            (b?.applications?.length || b?.applicants?.length || 0) -
            (a?.applications?.length || a?.applicants?.length || 0)
        )
        .slice(0, 3),
    [allAdminJobs]
  );

  const averageApplications = useMemo(() => {
    if (!allAdminJobs?.length) return 0;
    return Math.round(totalApplicants / allAdminJobs.length);
  }, [allAdminJobs, totalApplicants]);

  return (
    <div>
      <div className="mb-8 rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
              Recruiter analytics
            </p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900">Your hiring performance snapshot</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-600">
              Track your active roles, company performance, and application momentum from one dashboard.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="companies"
              className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100"
            >
              Manage companies
            </Link>
            <Link
              to="jobs"
              className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              View jobs
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Companies</p>
          <p className="mt-4 text-4xl font-bold text-slate-900">{companies?.length ?? 0}</p>
          <p className="mt-2 text-sm text-slate-500">Partner companies you manage.</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Job postings</p>
          <p className="mt-4 text-4xl font-bold text-slate-900">{allAdminJobs?.length ?? 0}</p>
          <p className="mt-2 text-sm text-slate-500">Open roles currently active.</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total applicants</p>
          <p className="mt-4 text-4xl font-bold text-slate-900">{totalApplicants}</p>
          <p className="mt-2 text-sm text-slate-500">Applications across all your jobs.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Average apps per job</p>
          <p className="mt-4 text-4xl font-bold text-slate-900">{averageApplications}</p>
          <p className="mt-2 text-sm text-slate-500">Candidate interest per posting.</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Active positions</p>
          <p className="mt-4 text-4xl font-bold text-slate-900">{jobStatusCounts.active}</p>
          <p className="mt-2 text-sm text-slate-500">Roles visible to candidates.</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Pending / closed</p>
          <p className="mt-4 text-4xl font-bold text-slate-900">{jobStatusCounts.pending + jobStatusCounts.closed}</p>
          <p className="mt-2 text-sm text-slate-500">Roles awaiting action or already closed.</p>
        </div>
      </div>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Top performing jobs</h2>
            <p className="mt-1 text-sm text-slate-500">Your most-clicked roles by applicant volume.</p>
          </div>
          <Link to="jobs" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
            View all postings
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {topJobs.length ? (
            topJobs.map((job) => (
              <article key={job._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{job.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{job.company?.name || "Company"}</p>
                  </div>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    {job?.applications?.length || job?.applicants?.length || 0} apps
                  </span>
                </div>
                <div className="mt-4 text-sm text-slate-600">
                  <p>{job.location || "Remote"}</p>
                  <p className="mt-2">{job.jobType || "Job Type"}</p>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
              <p className="font-semibold">No top jobs available yet.</p>
              <p className="mt-2">Post jobs or invite applicants to see analytics here.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
