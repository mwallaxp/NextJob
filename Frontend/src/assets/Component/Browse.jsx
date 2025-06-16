import React from "react";
import Job from "./Job";
import { Divide } from "lucide-react";
import NavBar from "./shared/NavBar";
import { useSelector } from "react-redux";
import useGetAllJobs from "./Hooks/useGetAllJobs";

const randomJobs = [1, 2, 3, 4];

const Browse = () => {
  const {allJobs}= useSelector(Store=>Store.job)
useGetAllJobs()
  return (
    <div>
        <NavBar/>
    <div className="max-w-7xl mx-auto">
      <h1 className="font-bold text-xl my-10">Search Result ({allJobs.length})</h1>
      <div className="grid grid-cols-3 gap-4 mt-4">
        {allJobs.map((job) => {
          return <Job key={job.id} job={job} />
        })}
      </div>
    </div>
    </div>
  );
};
export default Browse;
