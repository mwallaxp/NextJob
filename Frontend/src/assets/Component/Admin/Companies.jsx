import React, { useEffect, useState } from "react";
import NavBar from "../shared/NavBar";
import CompaniesTable from "./CompaniesTable";
import { useNavigate } from "react-router-dom";
import useGetAllCompanies from "../Hooks/useGetAllCompanies";
import { useDispatch } from "react-redux";
import { setSearchCompanyByText } from "../../../redux/companySlice";

const Companies = () => {
    useGetAllCompanies()
    const [input, setInput]=useState("")
    const navigate =useNavigate()
    const dispatch =useDispatch()

useEffect(()=>{
    dispatch(setSearchCompanyByText(input))
}, [input])

  return (
    <div>
      <NavBar />
      <div className="max-w-6xl mx-auto my-10">
        <div className="flex justify-between items-center">
          <input type="text" className="w-fit" placeholder="fill by name" />

          <button className=" bg-black text-white w-auto p-2 rounded-lg" 
          onChange={(e)=>setInput(e.target.value)}
          onClick={()=>navigate("/Admin/Companies/create")}>
            New company
          </button>


        </div>
        <CompaniesTable/>
      </div>
    </div>
  );
};

export default Companies;
