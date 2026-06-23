import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../routes/paths";
import { Building2, Edit2, Trash2 } from "lucide-react";
import EmptyState from "../../../components/recruiter/EmptyState";
import ActionMenu from "../../../components/recruiter/ActionMenu";

const CompaniesTable = () => {
  const { companies, searchCompanyByText } = useSelector((store) => store.company);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const navigate = useNavigate();
  const popoverRef = useRef(null);

  useEffect(() => {
    const filtered = companies.filter((company) =>
      searchCompanyByText
        ? company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase())
        : true
    );
    setFilteredCompanies(filtered);
  }, [companies, searchCompanyByText]);

  const [isPopoverOpen, setPopoverOpen] = useState(null);

  const togglePopover = (id) => {
    setPopoverOpen(isPopoverOpen === id ? null : id);
  };

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setPopoverOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle company deletion
  const handleDeleteCompany = (companyId, companyName) => {
    if (window.confirm(`Are you sure you want to delete ${companyName}?`)) {
      // Here you would call your delete API
      console.log(`Deleting company: ${companyId}`);
      // After successful deletion, the companies list would update via Redux
    }
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <table className="min-w-full border-collapse">
        <caption className="border-b border-zinc-200 p-5 text-left">
          <span className="block text-lg font-semibold text-zinc-950">Company profiles</span>
          <span className="mt-1 block text-sm text-zinc-500">Registered companies available for job postings.</span>
        </caption>
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-[0.16em] text-zinc-500">
            <th className="px-5 py-4 text-left font-semibold">Logo</th>
            <th className="px-5 py-4 text-left font-semibold">Name</th>
            <th className="px-5 py-4 text-left font-semibold">Created</th>
            <th className="px-5 py-4 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {filteredCompanies.length === 0 ? (
            <tr>
              <td colSpan="4">
                <EmptyState
                  icon={Building2}
                  title="No companies yet"
                  description="Create a company profile before posting jobs."
                  action={
                  <button 
                    onClick={() => navigate(ROUTES.RECRUITER_COMPANY_CREATE)}
                    className="inline-flex rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
                  >
                    Create New Company
                  </button>
                  }
                />
              </td>
            </tr>
          ) : (
            filteredCompanies.map((company) => (
              <tr key={company._id} className="transition hover:bg-zinc-50">
                <td className="px-5 py-4">
                  <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-zinc-100">
                    {company.logo ? (
                      <img
                        src={company.logo}
                        alt={`${company.name} logo`}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/default-logo.png";
                        }}
                      />
                    ) : (
                      <span className="text-sm font-bold text-zinc-500">
                        {company.name ? company.name.charAt(0).toUpperCase() : "?"}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-4 font-semibold text-zinc-950">{company.name || "N/A"}</td>
                <td className="px-5 py-4 text-sm text-zinc-500">
                  {company.createdAt
                    ? new Date(company.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })
                    : "N/A"}
                </td>
                <td className="px-5 py-4 text-right">
                  <span ref={popoverRef}>
                    <ActionMenu
                      isOpen={isPopoverOpen === company._id}
                      onToggle={() => togglePopover(company._id)}
                      label="Company options"
                    >
                      <button
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
                        onClick={() => {
                          navigate(ROUTES.RECRUITER_COMPANY_DETAIL(company._id));
                          setPopoverOpen(null);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                        Edit
                      </button>
                      <button 
                        className="flex w-full items-center gap-2 border-t border-zinc-100 px-4 py-2 text-left text-red-600 hover:bg-red-50"
                        onClick={() => {
                          handleDeleteCompany(company._id, company.name);
                          setPopoverOpen(null);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </ActionMenu>
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CompaniesTable;
