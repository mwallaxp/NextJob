import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { setSingleJob } from "../../redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import api from "../../utils/api";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "../../utils/constant";
import { toast } from "react-toastify";
import useGetAllJobs from "./Hooks/useGetAllJobs";
import { Bookmark, Briefcase, Building2, CheckCircle2, Flag, MapPin, ShieldCheck, Users } from "lucide-react";

const getSavedJobs = () => JSON.parse(window.localStorage.getItem("nextjobSavedJobs") || "[]");

export const JobDescription = () => {
  const { id: jobId } = useParams();
  const dispatch = useDispatch();
  const { singleJob, allJobs } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [savedIds, setSavedIds] = useState([]);

  useGetAllJobs();

  useEffect(() => {
    setSavedIds(getSavedJobs());
  }, []);

  useEffect(() => {
    const fetchSingleJob = async () => {
      if (!jobId) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(`${JOB_API_END_POINT}/get/${jobId}`);
        if (res.data.success && res.data.job) {
          dispatch(setSingleJob(res.data.job));
        } else {
          toast.error("Job not found");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load job details");
      } finally {
        setLoading(false);
      }
    };

    fetchSingleJob();
  }, [jobId, dispatch]);

  useEffect(() => {
    setHasApplied(false);
  }, [jobId]);

  const isApplied = hasApplied || (user && singleJob?.applications?.some((app) => app.applicant === user._id || app.applicant?._id === user._id));
  const isSaved = savedIds.includes(jobId);
  const profileComplete = Boolean(user?.profile?.resume && user?.profile?.bio && user?.profile?.skills?.length);
  const requirements = singleJob?.requirements?.length ? singleJob.requirements : singleJob?.skills || [];
  const benefits = ["Verified employer", "Clear application status", "Secure profile sharing"];

  const similarJobs = useMemo(() => {
    if (!singleJob) return [];

    return allJobs
      .filter((job) => job._id !== singleJob._id)
      .filter((job) => job.jobType === singleJob.jobType || job.location === singleJob.location || job.company?._id === singleJob.company?._id)
      .slice(0, 3);
  }, [allJobs, singleJob]);

  const toggleSavedJob = () => {
    const nextSaved = isSaved ? savedIds.filter((id) => id !== jobId) : [...savedIds, jobId];
    setSavedIds(nextSaved);
    window.localStorage.setItem("nextjobSavedJobs", JSON.stringify(nextSaved));
    toast.success(isSaved ? "Removed from saved jobs" : "Saved job");
  };

  const applyJob = async () => {
    if (!user) {
      toast.error("Please login to apply for this job");
      return;
    }

    if (isApplied) {
      toast.info("You have already applied for this job");
      return;
    }

    setApplying(true);
    try {
      const res = await api.post(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {});

      if (res.data.success) {
        setHasApplied(true);
        toast.success(res.data.message || "Application submitted successfully");
        dispatch(setSingleJob({
          ...singleJob,
          applications: [...(singleJob.applications || []), { applicant: user._id }],
        }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Application failed. Please try again.");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="animate-pulse space-y-5">
          <div className="h-10 w-2/3 rounded bg-slate-200" />
          <div className="h-5 w-1/3 rounded bg-slate-200" />
          <div className="h-56 rounded-2xl bg-slate-200" />
        </div>
      </main>
    );
  }

  if (!singleJob) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-slate-950">Job not found</h1>
        <p className="mt-2 text-slate-500">The job may have been removed or closed.</p>
        <Link to="/browse" className="mt-6 inline-flex rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
          Browse jobs
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <section className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-4">
                  {singleJob.company?.logo ? (
                    <img src={singleJob.company.logo} alt={`${singleJob.company?.name || "Company"} logo`} className="h-16 w-16 rounded-xl object-cover" />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                      <Building2 size={26} />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-blue-600">{singleJob.company?.name || "Company"}</p>
                    <h1 className="mt-2 text-3xl font-black text-slate-950">{singleJob.title}</h1>
                    <p className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                      <span className="inline-flex items-center gap-1"><MapPin size={15} />{singleJob.location || "Remote"}</span>
                      <span className="inline-flex items-center gap-1"><Briefcase size={15} />{singleJob.jobType || "Job"}</span>
                      <span className="inline-flex items-center gap-1"><Users size={15} />{singleJob.position || 1} opening{Number(singleJob.position) === 1 ? "" : "s"}</span>
                    </p>
                  </div>
                </div>
                <span className="inline-flex w-fit items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  <ShieldCheck size={14} />
                  Verified company
                </span>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Salary</p>
                  <p className="mt-2 font-bold text-slate-950">{singleJob.salary || "Not disclosed"}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Experience</p>
                  <p className="mt-2 font-bold text-slate-950">{singleJob.experience ? `${singleJob.experience} years` : "Not specified"}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Applicants</p>
                  <p className="mt-2 font-bold text-slate-950">{singleJob.applications?.length || 0}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-950">Job description</h2>
              <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-700">{singleJob.description}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-950">Required skills</h2>
                {requirements.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {requirements.map((item) => (
                      <span key={item} className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">{item}</span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-slate-500">No specific skills listed.</p>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-950">Benefits</h2>
                <div className="mt-4 space-y-3">
                  {benefits.map((benefit) => (
                    <p key={benefit} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      {benefit}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {similarJobs.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-950">Similar jobs</h2>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {similarJobs.map((job) => (
                    <Link key={job._id} to={`/description/${job._id}`} className="rounded-xl border border-slate-200 p-4 hover:border-blue-300">
                      <p className="font-bold text-slate-950">{job.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{job.company?.name || "Company"}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </section>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <button
                type="button"
                onClick={applyJob}
                disabled={isApplied || applying || !user}
                className={`w-full rounded-xl px-5 py-3 text-sm font-bold text-white transition ${
                  isApplied || applying || !user ? "bg-slate-400" : "bg-slate-950 hover:bg-blue-700"
                }`}
              >
                {applying ? "Applying..." : isApplied ? "Already applied" : profileComplete ? "Apply in one click" : "Apply now"}
              </button>
              {!profileComplete && user && (
                <p className="mt-3 text-sm text-slate-500">
                  Add your resume, bio, and skills for a faster one-click application.
                </p>
              )}
              {!user && <p className="mt-3 text-sm text-slate-500">Login as an employee to apply.</p>}

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={toggleSavedJob}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current text-blue-600" : ""}`} />
                  {isSaved ? "Saved" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => toast.info("Thanks. Reporting flow can be connected to admin review next.")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <Flag className="h-4 w-4" />
                  Report
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default JobDescription;
