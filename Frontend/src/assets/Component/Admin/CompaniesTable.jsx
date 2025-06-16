import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

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
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
        <caption className="text-lg font-bold p-4 bg-gray-800 text-white text-left">
          List of Your Recent Registrations
        </caption>
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="py-3 px-6 text-left font-semibold text-gray-700">Logo</th>
            <th className="py-3 px-6 text-left font-semibold text-gray-700">Name</th>
            <th className="py-3 px-6 text-left font-semibold text-gray-700">Date</th>
            <th className="py-3 px-6 text-left font-semibold text-gray-700">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredCompanies.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-8 text-gray-500">
                <div className="flex flex-col items-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-12 w-12 text-gray-400 mb-2" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
                    />
                  </svg>
                  <p>You haven't registered any companies yet</p>
                  <button 
                    onClick={() => navigate('/admin/companies/create')}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Create New Company
                  </button>
                </div>
              </td>
            </tr>
          ) : (
            filteredCompanies.map((company) => (
              <tr key={company._id} className="hover:bg-gray-50 border-b border-gray-200">
                <td className="py-4 px-6">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    {company.logo ? (
                      <img
                        src={company.logo}
                        alt={`${company.name} logo`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/default-logo.png";
                        }}
                      />
                    ) : (
                      <span className="text-lg font-bold text-gray-400">
                        {company.name ? company.name.charAt(0).toUpperCase() : "?"}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-6 font-medium">{company.name || "N/A"}</td>
                <td className="py-4 px-6 text-gray-600">
                  {company.createdAt
                    ? new Date(company.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })
                    : "N/A"}
                </td>
                <td className="py-4 px-6 relative">
                  <button
                    className="p-1 rounded-md hover:bg-gray-200"
                    onClick={() => togglePopover(company._id)}
                    aria-label="Company options"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                    </svg>
                  </button>
                  {isPopoverOpen === company._id && (
                    <div 
                      ref={popoverRef}
                      className="absolute top-full right-0 mt-2 w-36 bg-white border rounded-lg shadow-lg z-10"
                    >
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                        onClick={() => {
                          navigate(`/admin/companies/${company._id}`);
                          setPopoverOpen(null);
                        }}
                      >
                        <span className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </span>
                      </button>
                      <button 
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 border-t border-gray-100"
                        onClick={() => {
                          handleDeleteCompany(company._id, company.name);
                          setPopoverOpen(null);
                        }}
                      >
                        <span className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </span>
                      </button>
                    </div>
                  )}
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