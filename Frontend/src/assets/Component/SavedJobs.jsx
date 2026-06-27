import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Bookmark } from "lucide-react";
import { getSavedJobs, toggleSavedJob } from "../../services/userService";

const SavedJobs = () => {
  const { allJobs } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const [savedIds, setSavedIds] = useState([]);
  const [savedJobsFromApi, setSavedJobsFromApi] = useState([]);

  useEffect(() => {
    const loadSavedJobs = async () => {
      const stored = JSON.parse(window.localStorage.getItem("nextjobSavedJobs") || "[]");
      setSavedIds(stored);

      if (!user) return;

      try {
        const res = await getSavedJobs();
        const jobs = res.data.jobs || [];
        setSavedJobsFromApi(jobs);
        const ids = jobs.map((job) => job._id || job.id);
        setSavedIds(ids);
        window.localStorage.setItem("nextjobSavedJobs", JSON.stringify(ids));
      } catch {
        setSavedJobsFromApi([]);
      }
    };

    loadSavedJobs();
  }, [user]);

  const savedJobs = savedJobsFromApi.length
    ? savedJobsFromApi
    : allJobs?.filter((job) => savedIds.includes(job._id || job.id));

  const removeSaved = async (jobId) => {
    const nextSaved = savedIds.filter((id) => id !== jobId);
    setSavedIds(nextSaved);
    setSavedJobsFromApi((jobs) => jobs.filter((job) => (job._id || job.id) !== jobId));
    window.localStorage.setItem("nextjobSavedJobs", JSON.stringify(nextSaved));

    if (user) {
      try {
        await toggleSavedJob(jobId);
      } catch {
        setSavedIds(savedIds);
      }
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Saved jobs</p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900">Your favorites</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-600">
              Review the jobs you saved for later and apply when you are ready.
            </p>
          </div>
          <Link
            to="/jobs"
            className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Browse more jobs
          </Link>
        </div>
      </div>

      {savedJobs?.length ? (
        <div className="space-y-4">
          {savedJobs.map((job) => (
            <article key={job._id || job.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{job?.company?.name || "Company"}</p>
                  <h2 className="mt-1 text-xl font-semibold text-slate-900">{job?.title}</h2>
                  <p className="mt-2 text-sm text-slate-600">{job?.location || "Remote"} • {job?.jobType || "Full-time"}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to={`/description/${job?._id || job?.id}`}
                    className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    View details
                  </Link>
                  <button
                    type="button"
                    onClick={() => removeSaved(job._id || job?.id)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <Bookmark className="h-4 w-4" />
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
          <p className="text-lg font-semibold">No saved jobs yet.</p>
          <p className="mt-2">Save jobs from the browse page to keep them here.</p>
          <Link
            to="/jobs"
            className="mt-6 inline-flex rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            Browse jobs
          </Link>
        </div>
      )}
    </main>
  );
};

export default SavedJobs;
