import "./PostJobs.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import useGetAllCompanies from "../Hooks/useGetAllCompanies";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Check,
  CircleDollarSign,
  FileText,
  Loader2,
  MapPin,
  Plus,
  Sparkles,
  Users,
} from "lucide-react";
import { ROUTES } from "../../../routes/paths";
import { createJob, getJobById, updateJob } from "../../../services/jobService";

const initialInput = {
  title: "",
  description: "",
  requirements: "",
  salary: "",
  currency: "USD",
  location: "",
  jobType: "Full-Time",
  experienceLevel: "Mid Level",
  position: 1,
  companyId: "",
  companyName: "",
  skills: "",
};

const jobTypes = ["Full-Time", "Part-Time", "Contract", "Remote", "Internship"];
const experienceLevels = ["Entry Level", "Mid Level", "Senior", "Manager", "Executive"];
const currencies = ["USD", "NGN", "EUR", "GBP"];

const fieldClass = (hasError) =>
  `w-full rounded-xl border bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-950 focus:ring-4 focus:ring-zinc-950/10 ${
    hasError ? "border-red-400" : "border-zinc-200"
  }`;

const splitList = (value) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const PostJobs = () => {
  useGetAllCompanies();

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [input, setInput] = useState(initialInput);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { id: jobId } = useParams();
  const { companies = [] } = useSelector((store) => store.company);
  const isEditing = Boolean(jobId);

  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) return;

      try {
        setLoading(true);
        const res = await getJobById(jobId);
        if (res.data.success) {
          const job = res.data.job;
          setInput({
            title: job.title || "",
            description: job.description || "",
            requirements: Array.isArray(job.requirements) ? job.requirements.join(", ") : "",
            salary: job.salary || "",
            currency: job.currency || "USD",
            location: job.location || "",
            jobType: job.jobType || "Full-Time",
            experienceLevel: job.experience || "Mid Level",
            position: job.position || 1,
            companyId: job.company?._id || job.company || "",
            companyName: "",
            skills: Array.isArray(job.skills) ? job.skills.join(", ") : "",
          });
        }
      } catch (error) {
        setErrors({ submit: error.response?.data?.message || "Unable to load job" });
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const validate = () => {
    const nextErrors = {};

    if (!input.title.trim()) nextErrors.title = "Job title is required";
    if (!input.description.trim()) nextErrors.description = "Description is required";
    if (splitList(input.requirements).length === 0) nextErrors.requirements = "Add at least one requirement";
    if (!input.salary.trim()) nextErrors.salary = "Salary is required";
    if (!input.location.trim()) nextErrors.location = "Location is required";
    if (!input.position || Number(input.position) < 1) nextErrors.position = "Openings must be at least 1";
    if (!input.companyId && !input.companyName.trim()) {
      nextErrors.companyName = "Select a company or enter a new company name";
    }
    if (splitList(input.skills).length === 0) nextErrors.skills = "Add at least one skill";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const changeEventHandler = (event) => {
    const { name, value } = event.target;
    setInput((prev) => ({
      ...prev,
      [name]: name === "position" ? value.replace(/[^\d]/g, "") : value,
      ...(name === "companyId" && value ? { companyName: "" } : {}),
      ...(name === "companyName" && value ? { companyId: "" } : {}),
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    if (loading || !validate()) return;

    const payload = {
      ...input,
      position: Number(input.position),
      requirements: splitList(input.requirements),
      skills: splitList(input.skills),
      companyName: input.companyName.trim(),
    };

    try {
      setLoading(true);
      const res = isEditing
        ? await updateJob(jobId, payload)
        : await createJob(payload);

      if (res.data.success) {
        setSubmitted(true);
        setTimeout(() => navigate(ROUTES.RECRUITER_JOBS), 1300);
      }
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || "An error occurred while posting the job",
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[70vh] bg-white px-4 py-16">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-950 text-white">
            <Check size={30} />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">{isEditing ? "Job updated" : "Job posted"}</h1>
          <p className="mt-3 text-zinc-500">Redirecting to your job dashboard.</p>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setInput(initialInput);
              setErrors({});
            }}
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            <Plus size={16} />
            Post another job
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-5 border-b border-zinc-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              to={ROUTES.RECRUITER_JOBS}
              className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 transition hover:text-zinc-950"
            >
              <ArrowLeft size={16} />
              Job postings
            </Link>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">{isEditing ? "Edit job" : "Post a job"}</h1>
            <p className="mt-3 max-w-2xl text-base text-zinc-500">
              Create a clear role profile with compensation, skills, and screening signals for better applicants.
            </p>
          </div>
          <div className="rounded-full bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-700">
            Recruiter workspace
          </div>
        </div>

        <form onSubmit={submitHandler} className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-8">
            <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-950 text-white">
                  <Briefcase size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-zinc-950">Role details</h2>
                  <p className="text-sm text-zinc-500">The information candidates scan first.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label htmlFor="title" className="mb-2 block text-sm font-semibold text-zinc-800">
                    Job title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    placeholder="Senior Frontend Engineer"
                    value={input.title}
                    onChange={changeEventHandler}
                    className={fieldClass(errors.title)}
                  />
                  {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title}</p>}
                </div>

                <div>
                  <label htmlFor="jobType" className="mb-2 block text-sm font-semibold text-zinc-800">
                    Job type
                  </label>
                  <select name="jobType" id="jobType" value={input.jobType} onChange={changeEventHandler} className={fieldClass(errors.jobType)}>
                    {jobTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="experienceLevel" className="mb-2 block text-sm font-semibold text-zinc-800">
                    Experience level
                  </label>
                  <select
                    name="experienceLevel"
                    id="experienceLevel"
                    value={input.experienceLevel}
                    onChange={changeEventHandler}
                    className={fieldClass(errors.experienceLevel)}
                  >
                    {experienceLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="location" className="mb-2 block text-sm font-semibold text-zinc-800">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      name="location"
                      id="location"
                      placeholder="Remote, Lagos, London"
                      value={input.location}
                      onChange={changeEventHandler}
                      className={`${fieldClass(errors.location)} pl-11`}
                    />
                  </div>
                  {errors.location && <p className="mt-2 text-sm text-red-600">{errors.location}</p>}
                </div>

                <div>
                  <label htmlFor="position" className="mb-2 block text-sm font-semibold text-zinc-800">
                    Open positions
                  </label>
                  <div className="relative">
                    <Users className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      inputMode="numeric"
                      name="position"
                      id="position"
                      value={input.position}
                      onChange={changeEventHandler}
                      className={`${fieldClass(errors.position)} pl-11`}
                    />
                  </div>
                  {errors.position && <p className="mt-2 text-sm text-red-600">{errors.position}</p>}
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-950 text-white">
                  <Building2 size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-zinc-950">Company</h2>
                  <p className="text-sm text-zinc-500">Use an existing company or create one as you post.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="companyId" className="mb-2 block text-sm font-semibold text-zinc-800">
                    Existing company
                  </label>
                  <select id="companyId" name="companyId" value={input.companyId} onChange={changeEventHandler} className={fieldClass(errors.companyName)}>
                    <option value="">Select company</option>
                    {companies.map((company) => (
                      <option value={company._id} key={company._id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="companyName" className="mb-2 block text-sm font-semibold text-zinc-800">
                    New company name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    id="companyName"
                    placeholder="Create a company while posting"
                    value={input.companyName}
                    onChange={changeEventHandler}
                    className={fieldClass(errors.companyName)}
                  />
                  {errors.companyName && <p className="mt-2 text-sm text-red-600">{errors.companyName}</p>}
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-950 text-white">
                  <FileText size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-zinc-950">Candidate brief</h2>
                  <p className="text-sm text-zinc-500">Write the role in a way strong candidates can qualify quickly.</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label htmlFor="description" className="mb-2 block text-sm font-semibold text-zinc-800">
                    Job description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows="5"
                    placeholder="Describe responsibilities, team context, and what success looks like."
                    value={input.description}
                    onChange={changeEventHandler}
                    className={fieldClass(errors.description)}
                  />
                  {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description}</p>}
                </div>

                <div>
                  <label htmlFor="requirements" className="mb-2 block text-sm font-semibold text-zinc-800">
                    Requirements
                  </label>
                  <textarea
                    name="requirements"
                    id="requirements"
                    rows="4"
                    placeholder="React, TypeScript, REST APIs, 4+ years experience"
                    value={input.requirements}
                    onChange={changeEventHandler}
                    className={fieldClass(errors.requirements)}
                  />
                  {errors.requirements && <p className="mt-2 text-sm text-red-600">{errors.requirements}</p>}
                </div>

                <div>
                  <label htmlFor="skills" className="mb-2 block text-sm font-semibold text-zinc-800">
                    Skills for matching
                  </label>
                  <input
                    type="text"
                    name="skills"
                    id="skills"
                    placeholder="React, Node.js, MongoDB"
                    value={input.skills}
                    onChange={changeEventHandler}
                    className={fieldClass(errors.skills)}
                  />
                  {errors.skills && <p className="mt-2 text-sm text-red-600">{errors.skills}</p>}
                </div>
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-6 lg:self-start">
            <section className="rounded-2xl border border-zinc-200 bg-zinc-950 p-5 text-white shadow-sm sm:p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-zinc-950">
                  <CircleDollarSign size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Compensation</h2>
                  <p className="text-sm text-zinc-400">Be direct. Better salary clarity means better applicants.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="currency" className="mb-2 block text-sm font-semibold text-zinc-200">
                    Currency
                  </label>
                  <select
                    name="currency"
                    id="currency"
                    value={input.currency}
                    onChange={changeEventHandler}
                    className="w-full rounded-xl border border-white/10 bg-white px-4 py-3 text-sm text-zinc-950 outline-none focus:ring-4 focus:ring-white/20"
                  >
                    {currencies.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="salary" className="mb-2 block text-sm font-semibold text-zinc-200">
                    Salary range
                  </label>
                  <input
                    type="text"
                    name="salary"
                    id="salary"
                    placeholder="80000-100000"
                    value={input.salary}
                    onChange={changeEventHandler}
                    className="w-full rounded-xl border border-white/10 bg-white px-4 py-3 text-sm text-zinc-950 outline-none focus:ring-4 focus:ring-white/20"
                  />
                  {errors.salary && <p className="mt-2 text-sm text-red-300">{errors.salary}</p>}
                </div>
              </div>
            </section>

            <section className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-1 h-5 w-5 text-zinc-950" />
                <div>
                  <h3 className="font-semibold text-zinc-950">Posting quality</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    Add 3-6 skills and a concrete salary range to improve matching in the applicant table.
                  </p>
                </div>
              </div>
            </section>

            {errors.submit && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                {errors.submit}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-zinc-950 px-5 py-4 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Posting job
                </>
              ) : (
                <>
              <Plus size={16} />
              {isEditing ? "Save changes" : "Publish job"}
                </>
              )}
            </button>
          </aside>
        </form>
      </div>
    </div>
  );
};

export default PostJobs;
