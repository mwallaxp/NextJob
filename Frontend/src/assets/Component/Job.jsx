import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Bookmark, Building2, MapPin } from "lucide-react";

const Job = ({ job }) => {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState([]);

  const displayCreatedDate = (createdAt) => {
    if (!createdAt) return "Date not available";
    const createdDate = new Date(createdAt);
    const currentDate = new Date();
    const timeDifference = currentDate - createdDate;
    const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return daysAgo === 0 ? "Today" : `${daysAgo} days ago`;
  };

  useEffect(() => {
    const stored = window.localStorage.getItem("nextjobSavedJobs") || "[]";
    setSavedJobs(JSON.parse(stored));
  }, []);

  const toggleSavedJob = () => {
    const jobId = job?._id || job?.id;
    if (!jobId) return;

    const nextSaved = savedJobs.includes(jobId)
      ? savedJobs.filter((id) => id !== jobId)
      : [...savedJobs, jobId];

    setSavedJobs(nextSaved);
    window.localStorage.setItem("nextjobSavedJobs", JSON.stringify(nextSaved));
  };

  const isSaved = job && savedJobs.includes(job._id || job.id);

  if (!job) {
    return <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">No job data available</div>;
  }

  return (
    <article className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-slate-500">{displayCreatedDate(job.createdAt)}</p>
        <button className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-blue-600" aria-label="Save job">
          <Bookmark className="h-5 w-5" />
        </button>
      </div>
      <div className="flex items-center gap-3 mb-4">
        {job?.company?.logo ? (
          <img
            src={job.company.logo}
            alt={`${job?.company?.name || "Company"} logo`}
            width={44}
            height={44}
            className="h-11 w-11 rounded-md object-cover"
          />
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-md bg-slate-100 text-slate-500">
            <Building2 size={20} />
          </div>
        )}
        <div>
          {job?.company?._id ? (
            <Link to={`/company/${job.company._id}`} className="font-semibold text-slate-950 hover:text-blue-600">
              {job?.company?.name || "Independent Client"}
            </Link>
          ) : (
            <h2 className="font-semibold text-slate-950">{job?.company?.name || "Independent Client"}</h2>
          )}
          <p className="flex items-center gap-1 text-sm text-slate-500"><MapPin size={14} />{job?.location || job?.company?.location || "Remote"}</p>
        </div>
      </div>
      <div className="mb-4 flex-1">
        <h3 className="text-lg font-bold leading-snug text-slate-950">{job?.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{job?.description}</p>
      </div>
      <div className="flex gap-2 flex-wrap mb-4">
        <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
          {job.position} Position{Number(job?.position) !== 1 ? "s" : ""}
        </span>
        <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
          {job?.jobType}
        </span>
        <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
          {job?.salary}
        </span>
      </div>
      <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
        <button
          onClick={() => navigate(`/description/${job?._id}`)}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Details
          <ArrowRight size={16} />
        </button>
        <button
          onClick={toggleSavedJob}
          className={`rounded-md border px-4 py-2.5 text-sm font-semibold transition ${
            isSaved
              ? "border-blue-600 bg-blue-50 text-blue-700 hover:bg-blue-100"
              : "border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          {isSaved ? "Saved" : "Save"}
        </button>
      </div>
    </article>
  );
};

export default Job;
