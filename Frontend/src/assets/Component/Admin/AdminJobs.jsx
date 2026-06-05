import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import useGetAllAdminJobs from "../Hooks/useGetAllAdminJobs";
import AdminJobsTable from './AdminJobsTable'
import { setSearchJobByText } from "../../../redux/jobSlice";

const AdminJobs = () => {
  useGetAllAdminJobs();
    const [input, setInput]=useState("")
    const navigate =useNavigate()
    const dispatch =useDispatch()

useEffect(()=>{
    dispatch(setSearchJobByText(input))
}, [input])

  return (
    <div>
      <div className="max-w-6xl mx-auto my-10">
<div className="flex flex-wrap gap-4 justify-between items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full max-w-sm rounded-lg border border-slate-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:outline-none"
            placeholder="Search jobs by title or company"
          />

          <button
            type="button"
            className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            onClick={() => navigate("/admin/jobs/create")}
          >
            New job
          </button>


        </div>
        <AdminJobsTable/>
      </div>
    </div>
  );
};

export default AdminJobs;
