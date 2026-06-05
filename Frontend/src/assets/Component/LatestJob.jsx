import { LatestJobCards } from './LatestJobCards';
import { useSelector } from 'react-redux';

export const LatestJob = () => {
  const { allJobs } = useSelector((store) => store.job);

  return (
    <section className="mx-auto max-w-7xl px-6 py-14">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Fresh opportunities</p>
          <h2 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">Latest freelance openings</h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-slate-600">
          Browse current roles with clear job type, pay, and location signals before you commit time to applying.
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {allJobs.length === 0 ? (
          <div className="col-span-full rounded-lg border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
            <span>No job openings available at the moment. Please check back later!</span>
          </div>
        ) : (
          allJobs.slice(0, 6).map((job) => (
            <LatestJobCards key={job._id} job={job} />
          ))
        )}
      </div>
    </section>
  );
};
