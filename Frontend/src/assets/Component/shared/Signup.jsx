import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setLoading } from "../../../redux/authSlice";
import { toast } from 'react-toastify';
import NavBar from "./NavBar";
import { USER_API_END_POINT } from "../../../utils/constant";
import { Shield, User, Mail, Phone, Lock, Upload, Building, CheckCircle } from "lucide-react";

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phonenumber: "",
    password: "",
    confirmPassword: "",
    role: "student", // Default role
    file: null,
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: ""
  });

  // Fix the selector issue here
  const { loading, user } = useSelector((state) => state.auth.loading);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // For debugging the loading state
  useEffect(() => {
    console.log("Loading state:", loading);
  }, [loading]);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }

    // Password strength check
    if (name === "password" && value) {
      const score = calculatePasswordStrength(value);
      let feedback = "";
      
      if (score === 0) feedback = "Very weak";
      else if (score === 1) feedback = "Weak";
      else if (score === 2) feedback = "Fair";
      else if (score === 3) feedback = "Good";
      else feedback = "Strong";
      
      setPasswordStrength({ score, feedback });
    }
  };

  const calculatePasswordStrength = (password) => {
    let score = 0;
    
    // Length check
    if (password.length >= 8) score++;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    return Math.min(score, 4);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInput({ ...input, file });
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Clear file error if exists
      if (errors.file) {
        setErrors({ ...errors, file: "" });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Full name validation
    if (!input.fullname.trim()) {
      newErrors.fullname = "Full name is required";
    }
    
    // Email validation
    if (!input.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(input.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Phone number validation
    if (!input.phonenumber.trim()) {
      newErrors.phonenumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(input.phonenumber.replace(/\D/g, ''))) {
      newErrors.phonenumber = "Please enter a valid 10-digit phone number";
    }
    
    // Password validation
    if (!input.password) {
      newErrors.password = "Password is required";
    } else if (input.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    // Confirm password validation
    if (input.password !== input.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    // Role validation
    if (!input.role) {
      newErrors.role = "Please select a role";
    }
    
    // File validation
    // if (!input.file) {
    //   newErrors.file = "Profile picture is required";
    // }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      dispatch(setLoading(true));
      
      const formData = new FormData();
      formData.append('fullname', input.fullname.trim());
      formData.append('email', input.email.trim());
      formData.append('phonenumber', input.phonenumber.trim());
      formData.append('password', input.password);
      formData.append('role', input.role.trim());
      
      if (input.file) {
        formData.append('file', input.file);
      }
      
      const response = await axios.post(`${USER_API_END_POINT}/registration`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true,
      });
      
      if (response.data.success) {
        toast.success("Registration successful! Please login.");
        navigate('/login');
      } else {
        // Handle case where success is false but no error was thrown
        toast.error(response.data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      <NavBar />
      <div className="flex min-h-screen bg-gray-50">
        {/* Left section - Image and security messaging */}
        <div className="hidden lg:flex lg:w-1/2 bg-blue-600 flex-col justify-center items-center text-white p-12">
          <div className="max-w-md mx-auto">
            <Shield size={80} className="mb-8" />
            <h2 className="text-4xl font-bold mb-6">Create Your Secure Account</h2>
            <p className="text-lg mb-8">
              Join our platform with confidence. Your personal information is protected with the highest security standards,
              ensuring your data remains private and secure.
            </p>
            <div className="bg-blue-700 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Account Benefits</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle size={20} className="mr-2 flex-shrink-0" />
                  <span>Personalized job recommendations</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="mr-2 flex-shrink-0" />
                  <span>Secure document storage</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="mr-2 flex-shrink-0" />
                  <span>Direct communication with employers</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="mr-2 flex-shrink-0" />
                  <span>Profile visibility control</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right section - Sign up form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md">
            <form 
              onSubmit={handleSubmit}
              className="bg-white shadow-xl rounded-xl p-8 border border-gray-200"
            >
              <h1 className="font-bold text-3xl mb-2 text-center text-gray-800">
                Create Account
              </h1>
              <p className="text-gray-600 text-center mb-6">
                Please fill in your details to register
              </p>

              <div className="mb-4">
                <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="fullname"
                    name="fullname"
                    placeholder="John Doe"
                    value={input.fullname}
                    onChange={handleChange}
                    className={`pl-10 border ${errors.fullname ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                {errors.fullname && <p className="mt-1 text-sm text-red-500">{errors.fullname}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="example@email.com"
                    value={input.email}
                    onChange={handleChange}
                    className={`pl-10 border ${errors.email ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="phonenumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="phonenumber"
                    name="phonenumber"
                    placeholder="000-000-0000"
                    value={input.phonenumber}
                    onChange={handleChange}
                    className={`pl-10 border ${errors.phonenumber ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                {errors.phonenumber && <p className="mt-1 text-sm text-red-500">{errors.phonenumber}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Create a strong password"
                    value={input.password}
                    onChange={handleChange}
                    className={`pl-10 border ${errors.password ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                
                {/* Password strength indicator */}
                {input.password && (
                  <div className="mt-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700">Password strength:</span>
                      <span className={`text-xs font-medium ${
                        passwordStrength.score < 2 ? 'text-red-500' : 
                        passwordStrength.score < 3 ? 'text-yellow-500' : 'text-green-500'
                      }`}>
                        {passwordStrength.feedback}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${
                          passwordStrength.score < 2 ? 'bg-red-500' : 
                          passwordStrength.score < 3 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Re-enter your password"
                    value={input.confirmPassword}
                    onChange={handleChange}
                    className={`pl-10 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Picture
                </label>
                <div className="flex items-center space-x-4">
                  <div className="relative flex-shrink-0">
                    {previewUrl ? (
                      <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-300">
                        <img src={previewUrl} alt="Profile preview" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border border-gray-300">
                        <User size={24} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <label 
                      htmlFor="file" 
                      className={`flex items-center justify-center px-4 py-2 border ${errors.file ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer`}
                    >
                      <Upload size={16} className="mr-2" />
                      <span>Upload photo</span>
                      <input
                        type="file"
                        id="file"
                        name="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    <p className="mt-1 text-xs text-gray-500">JPG, PNG or GIF. Max 1MB.</p>
                  </div>
                </div>
                {errors.file && <p className="mt-1 text-sm text-red-500">{errors.file}</p>}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Your Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div 
                    className={`flex items-center justify-center gap-2 p-3 cursor-pointer rounded-lg border ${
                      input.role === "student" ? "bg-blue-50 border-blue-500 text-blue-700" : "border-gray-300 text-gray-600"
                    }`}
                    onClick={() => handleChange({ target: { name: "role", value: "student" } })}
                  >
                    <User size={18} />
                    <span className="font-medium">Student</span>
                    <input
                      type="radio"
                      name="role"
                      id="student"
                      value="student"
                      checked={input.role === "student"}
                      onChange={handleChange}
                      className="hidden"
                    />
                  </div>
                  <div 
                    className={`flex items-center justify-center gap-2 p-3 cursor-pointer rounded-lg border ${
                      input.role === "recruiter" ? "bg-blue-50 border-blue-500 text-blue-700" : "border-gray-300 text-gray-600"
                    }`}
                    onClick={() => handleChange({ target: { name: "role", value: "recruiter" } })}
                  >
                    <Building size={18} />
                    <span className="font-medium">Recruiter</span>
                    <input
                      type="radio"
                      name="role"
                      id="recruiter"
                      value="recruiter"
                      checked={input.role === "recruiter"}
                      onChange={handleChange}
                      className="hidden"
                    />
                  </div>
                </div>
                {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>

              <p className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Log in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;