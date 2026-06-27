import { useMemo, useState } from "react";
import Job from "./Job";
import { useSelector } from "react-redux";
import useGetAllJobs from "./Hooks/useGetAllJobs";
import { Search, SlidersHorizontal } from "lucide-react";

const Browse = () => {
  const { allJobs } = useSelector((store) => store.job);
  const [query, setQuery] = useState("");
  const [jobType, setJobType] = useState("all");
  const [salaryRange, setSalaryRange] = useState("all");
  const [workMode, setWorkMode] = useState("all");
  const [experienceLevel, setExperienceLevel] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const apiParams = useMemo(() => ({
    keyword: query,
    jobType,
    salaryRange,
    workMode,
    experienceLevel,
    sortBy,
    limit: 50,
  }), [experienceLevel, jobType, query, salaryRange, sortBy, workMode]);

  useGetAllJobs(apiParams);

  const jobTypes = useMemo(() => {
    const types = new Set(allJobs.map((job) => job?.jobType).filter(Boolean));
    return ["all", ...Array.from(types)];
  }, [allJobs]);

  const filteredJobs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const salaryValue = (job) => {
      if (job?.salaryMax) return Number(job.salaryMax);
      if (job?.salaryMin) return Number(job.salaryMin);
      const numbers = String(job?.salary || "").match(/\d+/g);
      if (!numbers?.length) return 0;
      return Math.max(...numbers.map(Number));
    };

    const relevanceScore = (job) => {
      if (!normalizedQuery) return 0;
      const title = job?.title?.toLowerCase() || "";
      const company = job?.company?.name?.toLowerCase() || "";
      const skills = [...(job?.skills || []), ...(job?.requirements || [])].join(" ").toLowerCase();
      return [
        title.includes(normalizedQuery) ? 4 : 0,
        skills.includes(normalizedQuery) ? 3 : 0,
        company.includes(normalizedQuery) ? 2 : 0,
      ].reduce((sum, score) => sum + score, 0);
    };

    return [...allJobs]
      .filter((job) => {
        const searchableText = [
          job?.title,
          job?.description,
          job?.location,
          job?.jobType,
          job?.salary,
          job?.company?.name,
          job?.company?.location,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const matchesQuery = !normalizedQuery || searchableText.includes(normalizedQuery);
        const matchesType = jobType === "all" || job?.jobType === jobType;
        const salary = salaryValue(job);
        const matchesSalary =
          salaryRange === "all" ||
          (salaryRange === "under-500k" && salary <= 500000) ||
          (salaryRange === "500k-2m" && salary >= 500000 && salary <= 2000000) ||
          (salaryRange === "2m-plus" && salary >= 2000000);
        const location = `${job?.location || ""} ${job?.company?.location || ""}`.toLowerCase();
        const type = `${job?.jobType || ""}`.toLowerCase();
        const matchesWorkMode =
          workMode === "all" ||
          (workMode === "remote" && (location.includes("remote") || type.includes("remote"))) ||
          (workMode === "onsite" && !location.includes("remote") && !type.includes("remote"));
        const experience = Number(String(job?.experience || "").match(/\d+/)?.[0] || 0);
        const matchesExperience =
          experienceLevel === "all" ||
          (experienceLevel === "entry" && experience <= 2) ||
          (experienceLevel === "mid" && experience >= 3 && experience <= 5) ||
          (experienceLevel === "senior" && experience >= 6);

        return matchesQuery && matchesType && matchesSalary && matchesWorkMode && matchesExperience;
      })
      .sort((a, b) => {
        if (sortBy === "relevance") {
          return relevanceScore(b) - relevanceScore(a);
        }

        if (sortBy === "oldest") {
          return new Date(a?.createdAt || 0) - new Date(b?.createdAt || 0);
        }

        if (sortBy === "salary") {
          return salaryValue(b) - salaryValue(a);
        }

        return new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0);
      });
  }, [allJobs, experienceLevel, jobType, query, salaryRange, sortBy, workMode]);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Job Search</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950">{filteredJobs.length} opportunities found</h1>
            <p className="mt-2 text-sm text-slate-600">Search by role, company, location, skill, or job type.</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:w-[860px] xl:grid-cols-[minmax(220px,1fr)_130px_130px_130px_130px_130px]">
            <label className="relative block">
              <span className="sr-only">Search jobs</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search jobs"
                className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="relative block">
              <span className="sr-only">Filter by job type</span>
              <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                value={jobType}
                onChange={(event) => setJobType(event.target.value)}
                className="h-11 w-full appearance-none rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {jobTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === "all" ? "All types" : type}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="sr-only">Sort jobs</span>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="relevance">Most relevant</option>
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="salary">Salary high to low</option>
              </select>
            </label>

            <label className="block">
              <span className="sr-only">Filter by salary</span>
              <select
                value={salaryRange}
                onChange={(event) => setSalaryRange(event.target.value)}
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">Any salary</option>
                <option value="under-500k">Under 500k</option>
                <option value="500k-2m">500k-2m</option>
                <option value="2m-plus">2m+</option>
              </select>
            </label>

            <label className="block">
              <span className="sr-only">Filter by work mode</span>
              <select
                value={workMode}
                onChange={(event) => setWorkMode(event.target.value)}
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">Any mode</option>
                <option value="remote">Remote</option>
                <option value="onsite">On-site</option>
              </select>
            </label>

            <label className="block">
              <span className="sr-only">Filter by experience</span>
              <select
                value={experienceLevel}
                onChange={(event) => setExperienceLevel(event.target.value)}
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">Any level</option>
                <option value="entry">Entry</option>
                <option value="mid">Mid-level</option>
                <option value="senior">Senior</option>
              </select>
            </label>
          </div>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
            <h2 className="text-lg font-bold text-slate-950">No matching jobs</h2>
            <p className="mt-2 text-sm text-slate-500">Try a different keyword, job type, or sort option.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredJobs.map((job) => (
              <Job key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};
export default Browse;
