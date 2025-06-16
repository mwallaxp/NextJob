import React, { useEffect, useState } from "react";
import NavBar from "../shared/NavBar";
import { ArrowLeft, Upload, CheckCircle, AlertCircle, Building, Globe, MapPin, FileText } from "lucide-react";
import axios from "axios";
import { COMPANY_API_END_POINT } from "../../../utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetCompanyById from "../Hooks/useGetCompanyById";

const CompanySetUp = () => {
  const params = useParams();
  useGetCompanyById(params.id);
  const { singleCompany } = useSelector((store) => store.company);
  const [currentStep, setCurrentStep] = useState(1);
  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    file: null,
  });
  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // Initialize form with company data
  useEffect(() => {
    if (singleCompany) {
      setInput({
        name: singleCompany.name || "",
        description: singleCompany.description || "",
        website: singleCompany.website || "",
        location: singleCompany.location || "",
        file: null,
      });
      setLogoPreview(singleCompany.logo || null);
    }
  }, [singleCompany]);

  // Steps configuration
  const steps = [
    { id: 1, name: "Basic Info", icon: Building },
    { id: 2, name: "Details", icon: FileText },
    { id: 3, name: "Review", icon: CheckCircle },
  ];

  // Validate form inputs
  const validate = () => {
    const newErrors = {};
    if (!input.name.trim()) newErrors.name = "Company name is required";
    if (!input.description.trim()) newErrors.description = "Description is required";
    if (input.website && !/^https?:\/\/.+/.test(input.website))
      newErrors.website = "Enter a valid URL (e.g., https://example.com)";
    if (!input.location.trim()) newErrors.location = "Location is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle text input changes
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // Handle file input changes
  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({...errors, file: "File size should be less than 5MB"});
        return;
      }
      setInput({ ...input, file });
      setLogoPreview(URL.createObjectURL(file));
      setErrors({...errors, file: ""});
    }
  };

  // Move to next step
  const nextStep = () => {
    if (currentStep === 1) {
      if (!input.name.trim() || !input.description.trim()) {
        validate();
        return;
      }
    }
    if (currentStep === 2) {
      if (!input.location.trim() || (input.website && !/^https?:\/\/.+/.test(input.website))) {
        validate();
        return;
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  // Move to previous step
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Handle form submission
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.description);
    formData.append("website", input.website);
    formData.append("location", input.location);
    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      setLoading(true);
      const res = await axios.put(
        `${COMPANY_API_END_POINT}/update/${params.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setShowSuccessMessage(true);
        setTimeout(() => {
          navigate("/admin/companies");
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating company:", error);
      setErrors({
        submission: error.response?.data?.message || "Failed to update company. Please try again."
      });
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  // Render form based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company Name <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={input.name}
                  onChange={changeEventHandler}
                  className={`pl-10 block w-full p-2.5 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter company name"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <textarea
                  name="description"
                  value={input.description}
                  onChange={changeEventHandler}
                  className={`block w-full p-2.5 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter company description"
                  rows="4"
                />
              </div>
              {errors.description && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.description}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Write a brief description about the company (100-250 characters recommended)
              </p>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Website
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="website"
                  value={input.website}
                  onChange={changeEventHandler}
                  className={`pl-10 block w-full p-2.5 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    errors.website ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="https://example.com"
                />
              </div>
              {errors.website && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.website}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Include the full URL with http:// or https://
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="location"
                  value={input.location}
                  onChange={changeEventHandler}
                  className={`pl-10 block w-full p-2.5 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    errors.location ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="City, Country"
                />
              </div>
              {errors.location && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.location}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company Logo
              </label>
              <div className="mt-1 flex items-center gap-4">
                {logoPreview ? (
                  <div className="relative group">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-20 h-20 object-contain rounded-full border border-gray-300 p-1 bg-white transition-all duration-300 group-hover:border-blue-500"
                    />
                    <div 
                      className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity duration-300"
                      onClick={() => {
                        setLogoPreview(null);
                        setInput({...input, file: null});
                      }}
                    >
                      <span className="text-white text-xs font-medium">Remove</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border border-gray-300">
                    <Building className="h-10 w-10 text-gray-400" />
                  </div>
                )}
                <label className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-center w-full p-3 border-2 border-dashed border-gray-300 rounded-md hover:border-blue-500 transition-colors bg-gray-50 hover:bg-gray-100">
                    <Upload className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">
                      {input.file ? "Change logo" : "Upload logo (optional)"}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={changeFileHandler}
                    className="hidden"
                  />
                </label>
              </div>
              {errors.file && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.file}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Recommended: Square image (1:1), max 5MB in size, JPG or PNG format
              </p>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Ready to update</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>Please review your company information before updating.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-md divide-y divide-gray-200">
              <div className="p-4">
                <h4 className="text-sm font-medium text-gray-500">Basic Information</h4>
                <div className="mt-2 flex flex-col space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Company Name</span>
                    <span className="text-sm text-gray-900">{input.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Description</span>
                    <span className="text-sm text-gray-900 text-right max-w-xs line-clamp-2">{input.description}</span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h4 className="text-sm font-medium text-gray-500">Contact Details</h4>
                <div className="mt-2 flex flex-col space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Website</span>
                    <span className="text-sm text-gray-900">{input.website || "Not provided"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Location</span>
                    <span className="text-sm text-gray-900">{input.location}</span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h4 className="text-sm font-medium text-gray-500">Company Logo</h4>
                <div className="mt-2 flex justify-center">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-24 h-24 object-contain rounded-full border border-gray-300 p-1 bg-white"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border border-gray-300">
                      <Building className="h-12 w-12 text-gray-400" />
                      <span className="text-xs text-gray-500 mt-1">No logo</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-3xl mx-auto my-10 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center space-x-2">
          <button
            onClick={() => navigate("/admin/companies")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium transition-colors p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Back to Companies</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-800 ml-2">Update Company</h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between w-full mb-2">
            {steps.map((step) => (
              <div key={step.id} className="relative flex-1">
                <div 
                  className={`flex items-center justify-center w-10 h-10 mx-auto rounded-full transition-colors duration-300 ${
                    currentStep >= step.id 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  <step.icon className="w-5 h-5" />
                </div>
                <div className="text-xs text-center font-medium mt-2">{step.name}</div>
                {step.id !== steps.length && (
                  <div 
                    className={`absolute top-1/2 -translate-y-1/2 left-full transform -translate-x-1/2 w-full h-0.5 transition-colors duration-300 ${
                      currentStep > step.id ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200">
          {/* Form header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <h2 className="text-white text-lg font-medium">
              {currentStep === 1 && "Basic Company Information"}
              {currentStep === 2 && "Additional Details"}
              {currentStep === 3 && "Review & Submit"}
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              {currentStep === 1 && "Enter the core information about your company"}
              {currentStep === 2 && "Fill in contact details and upload your company logo"}
              {currentStep === 3 && "Review your information before updating"}
            </p>
          </div>

          {/* Success message */}
          {showSuccessMessage && (
            <div className="bg-green-50 p-4 animate-fadeIn">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Company updated successfully!</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>Redirecting to companies page...</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error message */}
          {errors.submission && (
            <div className="bg-red-50 p-4 animate-fadeIn">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Update failed</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{errors.submission}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={submitHandler}>
            <div className="p-6">
              {renderStepContent()}
            </div>

            {/* Form footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Previous
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading || submitting}
                  className={`py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300 ${
                    (loading || submitting) ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {submitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </span>
                  ) : (
                    "Update Company"
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Tips and help */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Tips for company profile</h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1 flex-shrink-0 mt-0.5" />
              <span>Use a clear, high-quality logo to improve brand recognition</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1 flex-shrink-0 mt-0.5" />
              <span>Write a concise but informative description that highlights your company's value proposition</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1 flex-shrink-0 mt-0.5" />
              <span>Ensure your location is accurate as it affects local search results</span>
            </li>
          </ul>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CompanySetUp;