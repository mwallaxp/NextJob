import Job from "./Job";
import { useSelector } from "react-redux";
import useGetAllJobs from "./Hooks/useGetAllJobs";

const Browse = () => {
  const {allJobs}= useSelector(Store=>Store.job)
useGetAllJobs()
  return (
    <div>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Search results</p>
      <h1 className="mt-2 text-3xl font-black text-slate-950">{allJobs.length} opportunities found</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {allJobs.map((job) => {
          return <Job key={job._id} job={job} />
        })}
      </div>
    </main>
    </div>
  );
};
export default Browse;
