import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import useGetAllJobs from "./Hooks/useGetAllJobs";
import { Card, Badge, ButtonSmall, SectionHeader, EmptyState, StatCard } from "../../components/DesignSystem";
import { Search, Filter, MapPin, DollarSign, Briefcase, TrendingUp, X } from "lucide-react";
import { cva } from 'class-variance-authority';
import { clsx } from 'clsx';
import { Link } from "react-router-dom";

const JobCardSkeleton = () => (
  <div className="bg-white border-2 border-black-100 rounded-3xl p-6 animate-pulse">
    <div className="h-6 bg-black-100 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-black-50 rounded w-1/2 mb-6"></div>
    <div className="h-4 bg-black-50 rounded w-full mb-2"></div>
    <div className="h-4 bg-black-50 rounded w-full mb-4"></div>
    <div className="flex gap-2 mb-6">
      <div className="h-8 bg-black-100 rounded-full w-20"></div>
      <div className="h-8 bg-black-100 rounded-full w-20"></div>
    </div>
    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-black-100">
      <div className="h-4 bg-black-50 rounded w-full"></div>
      <div className="h-4 bg-black-50 rounded w-full"></div>
      <div className="h-4 bg-black-50 rounded w-full"></div>
    </div>
  </div>
);

const BrowseJobs = () => {
  const { allJobs, isLoading } = useSelector((store) => store.job);
  useGetAllJobs();

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    jobType: "",
    level: "",
    location: "",
    budgetMin: 0,
    budgetMax: 10000,
    sortBy: "recent",
  });
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    let result = allJobs.filter((job) => {
      const matchesSearch =
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company?.name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = !filters.jobType || job.jobType === filters.jobType;
      const matchesLevel = !filters.level || job.level === filters.level;
      const matchesLocation =
        !filters.location ||
        job.location?.toLowerCase().includes(filters.location.toLowerCase()) ||
        job.company?.location?.toLowerCase().includes(filters.location.toLowerCase());
      const matchesBudget =
        job.budget >= filters.budgetMin && job.budget <= filters.budgetMax;

      return (
        matchesSearch &&
        matchesType &&
        matchesLevel &&
        matchesLocation &&
        matchesBudget
      );
    });

    // Sort
    if (filters.sortBy === "recent") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (filters.sortBy === "budget_high") {
      result.sort((a, b) => b.budget - a.budget);
    } else if (filters.sortBy === "budget_low") {
      result.sort((a, b) => a.budget - b.budget);
    }

    return result;
  }, [allJobs, searchTerm, filters]);

  const jobTypes = ["Full-time", "Part-time", "Contract", "Project"];
  const levels = ["Entry", "Intermediate", "Expert", "Senior"];

  return (
    <main className="min-h-screen bg-black-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-600 mb-2">
            Opportunities
          </p>
          <h1 className="text-4xl font-bold text-black-900 mb-4">
            {filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"} found
          </h1>
          <p className="text-black-600">
            Choose from quality projects matched to your skills
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black-400" size={20} />
              <input
                type="text"
                placeholder="Search by skill, title, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-black-100 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 rounded-xl border-2 border-black-100 hover:border-orange-500 hover:bg-orange-50 transition-all flex items-center gap-2 font-semibold text-black-900"
            >
              <Filter size={20} />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? "block" : "hidden"} lg:block lg:col-span-1`}>
            <Card className="sticky top-24">
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <h3 className="font-bold text-black-900">Filters</h3>
                <button onClick={() => setShowFilters(false)} className="text-black-600">
                  <X size={20} />
                </button>
              </div>

              {/* Clear Filters */}
              {Object.values(filters).some((v) => v) && (
                <button
                  onClick={() =>
                    setFilters({
                      jobType: "",
                      level: "",
                      location: "",
                      budgetMin: 0,
                      budgetMax: 10000,
                      sortBy: "recent",
                    })
                  }
                  className="w-full mb-6 py-2 text-sm font-semibold text-orange-600 hover:text-orange-700 border-b-2 border-black-100"
                >
                  Clear all filters
                </button>
              )}

              {/* Sort By */}
              <div className="mb-6 pb-6 border-b border-black-100">
                <h4 className="font-semibold text-black-900 mb-3">Sort By</h4>
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters({ ...filters, sortBy: e.target.value })
                  }
                  className="w-full p-2 rounded-lg border border-black-100 focus:outline-none focus:border-orange-500"
                >
                  <option value="recent">Most Recent</option>
                  <option value="budget_high">Highest Budget</option>
                  <option value="budget_low">Lowest Budget</option>
                </select>
              </div>

              {/* Job Type */}
              <div className="mb-6 pb-6 border-b border-black-100">
                <h4 className="font-semibold text-black-900 mb-3">Job Type</h4>
                <div className="space-y-2">
                  {jobTypes.map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.jobType === type}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            jobType: e.target.checked ? type : "",
                          })
                        }
                        className="w-4 h-4 rounded border-black-300 text-orange-500"
                      />
                      <span className="text-sm text-black-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Level */}
              <div className="mb-6 pb-6 border-b border-black-100">
                <h4 className="font-semibold text-black-900 mb-3">Level</h4>
                <div className="space-y-2">
                  {levels.map((level) => (
                    <label key={level} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.level === level}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            level: e.target.checked ? level : "",
                          })
                        }
                        className="w-4 h-4 rounded border-black-300 text-orange-500"
                      />
                      <span className="text-sm text-black-700">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="mb-6 pb-6 border-b border-black-100">
                <h4 className="font-semibold text-black-900 mb-3">Location</h4>
                <input
                  type="text"
                  placeholder="e.g., Remote, NYC"
                  value={filters.location}
                  onChange={(e) =>
                    setFilters({ ...filters, location: e.target.value })
                  }
                  className="w-full p-2 rounded-lg border border-black-100 focus:outline-none focus:border-orange-500 text-sm"
                />
              </div>

              {/* Budget Range */}
              <div>
                <h4 className="font-semibold text-black-900 mb-4">Budget Range</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-black-700 mb-2 block">
                      Min: ${filters.budgetMin}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      value={filters.budgetMin}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          budgetMin: parseInt(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-black-700 mb-2 block">
                      Max: ${filters.budgetMax}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      value={filters.budgetMax}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          budgetMax: parseInt(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Jobs List */}
          <div className="lg:col-span-3">
            {filteredJobs.length === 0 ? (
              <EmptyState
                icon={Briefcase}
                title="No jobs found"
                description="Try adjusting your filters or search terms to find more opportunities"
                action={
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setFilters({
                        jobType: "",
                        level: "",
                        location: "",
                        budgetMin: 0,
                        budgetMax: 10000,
                        sortBy: "recent",
                      });
                    }}
                    className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all"
                  >
                    Reset Filters
                  </button>
                }
              />
            ) : (
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

// Centralized styling for JobCard elements using cva and clsx
const saveButtonVariants = cva(
  "p-2 rounded-lg transition-all",
  {
    variants: {
      saved: {
        true: "bg-orange-100 text-orange-600",
        false: "bg-black-100 text-black-600",
      },
    },
    defaultVariants: {
      saved: false,
    },
  }
);

const jobTitleClasses = clsx("text-2xl font-bold text-black-900");
const companyNameClasses = clsx("text-black-600 text-sm mt-1");
const postingDateClasses = clsx("text-xs font-medium text-orange-600 uppercase tracking-widest mt-2");
const descriptionClasses = clsx("text-black-600 line-clamp-2 mb-3 flex-1");
const metaInfoContainerClasses = clsx("grid grid-cols-3 gap-3 pt-4 border-t border-black-100");
const metaItemLabelClasses = clsx("text-xs text-black-600");
const metaItemValueClasses = clsx("font-bold text-black-900");
const metaItemIconClasses = clsx("text-orange-500");

// Improved Job Card Component
const JobCard = ({ job }) => {
  const [saved, setSaved] = useState(false);

  const displayCreatedDate = (createdAt) => {
    if (!createdAt) return "Recently posted";
    const createdDate = new Date(createdAt);
    const currentDate = new Date();
    const timeDifference = currentDate - createdDate;
    const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return daysAgo === 0 ? "Posted today" : `${daysAgo} days ago`;
  };

  return (
    <Link to={`/description/${job._id}`}>
      <Card hoverable className="h-full flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className={jobTitleClasses}>{job.title}</h3>
            <p className={companyNameClasses}>{job.company?.name || "Independent Client"}</p>
            <p className={postingDateClasses}>
              {displayCreatedDate(job.createdAt)}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              setSaved(!saved);
            }}
            className={saveButtonVariants({ saved })}
            aria-label={saved ? "Unsave job" : "Save job"}
          >
            <svg
              className="w-6 h-6"
              fill={saved ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 19V5z"
              />
            </svg>
          </button>
        </div>

        <p className={descriptionClasses}>{job.description}</p>

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {job.jobType && <Badge variant="primary">{job.jobType}</Badge>}
          {job.level && <Badge variant="teal">{job.level}</Badge>}
        </div>

        <div className={metaInfoContainerClasses}>
          <div className="flex items-center gap-2">
            <DollarSign size={18} className={metaItemIconClasses} />
            <div>
              <p className={metaItemLabelClasses}>Budget</p>
              <p className={metaItemValueClasses}>${job.budget}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={18} className={metaItemIconClasses} />
            <div>
              <p className={metaItemLabelClasses}>Location</p>
              <p className={metaItemValueClasses}>
                {job.location || job.company?.location || "Remote"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase size={18} className={metaItemIconClasses} />
            <div>
              <p className={metaItemLabelClasses}>Positions</p>
              <p className={metaItemValueClasses}>{job.position || 1}</p>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default BrowseJobs;
