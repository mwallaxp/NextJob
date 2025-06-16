import React, { useState } from "react";
import NavBar from "../shared/NavBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { COMPANY_API_END_POINT } from "../../../utils/constant";
import { useDispatch } from "react-redux";
import { setSingleCompany } from "../../../redux/companySlice";

const CompanyCreate = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const registerNewCompany = async () => {
    if (!companyName.trim()) {
      setError("Company name is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // console.log("Register payload:", { companyName });
      const res = await axios.post(
        `${COMPANY_API_END_POINT}/register`,
        { companyName }, // Changed to match backend
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      // console.log("Register response:", res.data);

      if (res.data?.success) {
        dispatch(setSingleCompany(res.data.company));
        const companyId = res.data.company?._id;
        if (companyId) {
          navigate(`/Admin/Companies/${companyId}`);
        } else {
          setError("Company created, but ID not found. Please try again.");
        }
      } else {
        setError(res.data?.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Company registration error:", error);
      setError(
        error.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="mb-8">
            <h1 className="font-bold text-3xl text-gray-800 mb-2">
              Your Company Name
            </h1>
            <p className="text-gray-500">
              What would you like to name your company? You can change it later.
            </p>
          </div>

          <div className="mb-6">
            <label
              htmlFor="companyName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="e.g., Microsoft, Google, NextJob"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              disabled={isLoading}
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>

          <div className="flex items-center gap-4 mt-6">
            <button
              className="px-5 py-2 border border-gray-300 rounded-md font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
              onClick={() => navigate("/Admin/Companies")}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              className={`px-5 py-2 rounded-md font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              onClick={registerNewCompany}
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyCreate;