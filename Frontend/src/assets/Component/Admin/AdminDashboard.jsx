import { useSelector } from "react-redux";
import useGetAllCompanies from "../Hooks/useGetAllCompanies";
import useGetAllAdminJobs from "../Hooks/useGetAllAdminJobs";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  useGetAllCompanies();
  useGetAllAdminJobs();

  const { companies } = useSelector((store) => store.company);
  const { allAdminJobs } = useSelector((store) => store.job);
  const totalApplicants = allAdminJobs?.reduce(
    (sum, job) => sum + (job.applications?.length || job.applicants?.length || 0),
    0
  );

  return (
    <div>
      <div className="mb-8 rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
              Dashboard overview
            </p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900">Recruiter & company analytics</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-600">
              Monitor your active companies and job postings from a single recruiter control panel.
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
          <p className="mt-2 text-sm text-slate-500">Registered partner companies</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Job postings</p>
          <p className="mt-4 text-4xl font-bold text-slate-900">{allAdminJobs?.length ?? 0}</p>
          <p className="mt-2 text-sm text-slate-500">Live recruiter positions</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Applicant activity</p>
          <p className="mt-4 text-4xl font-bold text-slate-900">{totalApplicants ?? 0}</p>
          <p className="mt-2 text-sm text-slate-500">Total applicants across your jobs</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
