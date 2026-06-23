import React, { useEffect, useState } from "react";
import CompaniesTable from "./CompaniesTable";
import { useNavigate } from "react-router-dom";
import useGetAllCompanies from "../Hooks/useGetAllCompanies";
import { useDispatch } from "react-redux";
import { setSearchCompanyByText } from "../../../redux/companySlice";
import { ROUTES } from "../../../routes/paths";
import PageHeader from "../../../components/recruiter/PageHeader";
import { Building2, Plus, Search } from "lucide-react";

const Companies = () => {
    useGetAllCompanies()
    const [input, setInput]=useState("")
    const navigate =useNavigate()
    const dispatch =useDispatch()

useEffect(()=>{
    dispatch(setSearchCompanyByText(input))
}, [input])

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Company profiles"
        title="Manage companies"
        description="Keep each hiring company polished, complete, and ready to attach to job posts."
        actions={(
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
            onClick={() => navigate(ROUTES.RECRUITER_COMPANY_CREATE)}
          >
            <Plus size={16} />
            New company
          </button>
        )}
      />

      <div className="grid gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full rounded-full border border-zinc-200 bg-white px-11 py-3 text-sm shadow-sm outline-none transition focus:border-zinc-950 focus:ring-4 focus:ring-zinc-950/10"
            placeholder="Search companies by name"
          />
        </div>
        <div className="flex items-center gap-2 rounded-full bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-700">
          <Building2 size={16} />
          Recruiter workspace
        </div>
      </div>

        <CompaniesTable/>
    </div>
  );
};

export default Companies;
