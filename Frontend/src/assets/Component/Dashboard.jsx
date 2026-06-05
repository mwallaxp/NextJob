import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import useGetAppliedJobs from "./Hooks/useGetAppliedJobs";

const Dashboard = () => {
  const { user } = useSelector((store) => store.auth);
  const { allAppliedJobs } = useSelector((store) => store.job);
  const navigate = useNavigate();

  useGetAppliedJobs();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    if (user.role === "recruiter") {
      navigate("/admin", { replace: true });
    }
  }, [user, navigate]);

  if (!user || user.role === "recruiter") {
    return null;
  }

  const completionItems = [
    Boolean(user?.profile?.fullname),
    Boolean(user?.profile?.bio),
    Boolean(user?.profile?.resume),
    Boolean(user?.profile?.skills?.length),
  ];
  const completion = Math.round((completionItems.filter(Boolean).length / completionItems.length) * 100);

  const latestApplications = allAppliedJobs?.slice(0, 5) || [];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Candidate dashboard</p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900">Welcome back, {user?.fullname || user?.email}</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-600">
              Manage your applications, track your profile strength, and jump back into jobs matched to your profile.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/browse"
              className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Browse jobs
            </Link>
            <Link
              to="/profile"
              className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm border border-slate-200 transition hover:bg-slate-50"
            >
              Update profile
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Applications submitted</p>
          <p className="mt-4 text-4xl font-bold text-slate-900">{allAppliedJobs?.length ?? 0}</p>
          <p className="mt-2 text-sm text-slate-500">Jobs you have applied for so far.</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Profile completion</p>
          <p className="mt-4 text-4xl font-bold text-slate-900">{completion}%</p>
          <p className="mt-4 h-3 overflow-hidden rounded-full bg-white shadow-inner">
            <span
              className="block h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-700"
              style={{ width: `${completion}%` }}
            />
          </p>
          <p className="mt-2 text-sm text-slate-500">Complete more profile details to improve matching.</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Recent activity</p>
          <p className="mt-4 text-4xl font-bold text-slate-900">{latestApplications.length}</p>
          <p className="mt-2 text-sm text-slate-500">Applications shown from your latest activity.</p>
        </div>
      </div>

      <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Latest applications</h2>
            <p className="mt-1 text-sm text-slate-500">Track your recent applications and status in one place.</p>
          </div>
          <Link
            to="/jobs"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            View all jobs
          </Link>
        </div>

        {latestApplications.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
            No applications yet. Start by browsing jobs that match your skills.
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {latestApplications.map((application, index) => {
              const job = application?.job || application?.jobId || application;
              const title = job?.title || application?.title || "Untitled role";
              const company = job?.company?.name || application?.company?.name || "Unknown company";
              const status = application?.status || "Pending";
              return (
                <div key={application._id || index} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-500">{company}</p>
                      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                    </div>
                    <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                      {status}
                    </span>
                  </div>
                  <div className="mt-3 text-sm text-slate-600">
                    Applied on {new Date(application?.createdAt || application?.appliedAt || Date.now()).toLocaleDateString()}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
};

export default Dashboard;
