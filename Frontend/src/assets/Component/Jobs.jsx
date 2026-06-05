import { useEffect, useState } from "react";
import { FilterCard } from "./FilterCard";
import Job from "./Job";
import { useSelector } from "react-redux";
import { motion } from 'framer-motion'

export const Jobs = () => {
  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  const [filter, setFilter] = useState(allJobs);

  useEffect(() => {
    let filteredJobs = allJobs;
    
    if (searchedQuery) {
      filteredJobs = allJobs?.filter((job) => {
        
        return (
          job?.title?.toLowerCase().includes(searchedQuery.toLowerCase()) ||
          job?.description?.toLowerCase().includes(searchedQuery.toLowerCase()) ||
          job?.location?.toLowerCase().includes(searchedQuery.toLowerCase()) ||
          job?.jobType?.toLowerCase().includes(searchedQuery.toLowerCase())
        );
      });
    }
    
    setFilter(filteredJobs);
  }, [allJobs, searchedQuery]);

  return (
    <div>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Browse work</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">Find your next project</h1>
        </div>
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <div>
            <FilterCard />
          </div>
          
          {filter?.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">No jobs found</div>
          ) : (
            <div className="pb-5">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filter?.map((job) => (
                  <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                     key={job._id}
                  >
                    <Job job={job} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Jobs;
