import React, { useEffect, useState } from "react";
import NavBar from "../shared/NavBar";
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
      <NavBar />
      <div className="max-w-6xl mx-auto my-10">
        <div className="flex justify-between items-center">
          <input type="text" className="w-fit" placeholder="fill by name, role" />

          <button className=" bg-black text-white w-auto p-2 rounded-lg" 
          onChange={(e)=>setInput(e.target.value)}
          onClick={()=>navigate("/Admin/jobs/create")}>
            New company
          </button>


        </div>
        <AdminJobsTable/>
      </div>
    </div>
  );
};

export default AdminJobs;
