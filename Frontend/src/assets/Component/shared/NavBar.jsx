import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Bell } from "lucide-react";
import { USER_API_END_POINT } from "../../../utils/constant";
import api from "../../../utils/api"; // Ensure api is imported
import { useAuth } from "./AuthContext";
import { toast } from 'react-toastify';
import { ROUTES } from "../../../routes/paths";

const NavBar = () => {
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();
  const location = useLocation();
  
  const { logout, exitShadowMode } = useAuth(); // Import both from AuthContext
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const isShadowMode = sessionStorage.getItem('adminOriginalToken') !== null;

  const logoutHandler = async () => {
    try {
      if (isShadowMode) {
        await exitShadowMode();
        toast.info("Exited shadow mode.");
        navigate(ROUTES.RECRUITER);
      } else {
        await logout();
        toast.success("LogOut successful!");
        navigate(ROUTES.HOME); 
      }
    } catch (error) {
      console.error("Logout failed:", error);
      // toast.error("Failed to logout. Please try again.");
    }
  };

  const isActive = (path) => {
    return location.pathname === path ? "text-blue-600 font-semibold" : "text-gray-700";
  };

  // Navigation links based on user role
  const getNavLinks = () => {
    if (user && user.role === 'recruiter') {
      return [
        { to: ROUTES.RECRUITER, label: "Dashboard" },
        { to: ROUTES.RECRUITER_COMPANIES, label: "Companies" },
        { to: ROUTES.RECRUITER_JOBS, label: "Jobs" }
      ];
    }
    if (user && user.role === 'student') {
      return [
        { to: "/dashboard", label: "Dashboard" },
        { to: "/jobs", label: "Jobs" },
        { to: "/browse", label: "Browse" },
        { to: "/saved", label: "Saved" }
      ];
    }
    return [
      { to: "/", label: "Home" },
      { to: "/jobs", label: "Jobs" },
      { to: "/browse", label: "Browse" },
      { to: "/about", label: "About" },
      { to: "/support", label: "Support" }
    ];
  };

  const navLinks = getNavLinks();

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Main Nav */}
          <div className="flex items-center">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-gray-800">
                NEXT<span className="text-blue-600">JOB</span>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`${isActive(link.to)} inline-flex items-center px-1 pt-1 text-md font-medium border-b-2 ${
                    location.pathname === link.to
                      ? "border-blue-500"
                      : "border-transparent hover:border-gray-300"
                  } transition duration-300`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side - Auth buttons or User menu */}
          <div className="flex items-center">
            {/* Search icon - can be implemented later */}
            <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {user && (
              <Link
                to="/notifications"
                className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none mr-2"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
              </Link>
            )}

            {/* Auth buttons or profile dropdown */}
            {!user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="hidden sm:inline-flex items-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition duration-300"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition duration-300"
                >
                  Sign up
                </Link>
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <div>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <img
                      className="h-10 w-10 rounded-full object-cover border-2 border-blue-600"
                      src={user?.profile?.profilePhoto || "https://via.placeholder.com/150"}
                      alt="User profile"
                    />
                  </button>
                </div>

                {/* Profile dropdown */}
                {isProfileOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100">
                    <div className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <img
                            className="h-12 w-12 rounded-full object-cover border border-gray-200"
                            src={user?.profile?.profilePhoto || "https://via.placeholder.com/150"}
                            alt="User profile"
                          />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{user.fullname}</p>
                          <p className="text-xs text-gray-500 truncate max-w-[180px]">{user?.profile?.bio || "No bio available"}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      {user && user.role === "student" && (
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 group"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500 group-hover:text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                          View Profile
                        </Link>
                      )}
                      
                      {isShadowMode && (
                        <button
                          onClick={logoutHandler} // This will now call exitShadowMode
                          className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 group"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-red-500 group-hover:text-red-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.586 2.586a1 1 0 001.414-1.414L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          Exit Shadow Mode
                        </button>
                      )}

                      <button
                        onClick={logoutHandler}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 group"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500 group-hover:text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 6h-2.586l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L11.414 11H14a1 1 0 100-2z" clipRule="evenodd" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`${
                  location.pathname === link.to
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                } block px-3 py-2 rounded-md text-base font-medium transition duration-300`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          {/* Mobile login/signup buttons */}
          {!user && (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4 space-x-3">
                <Link
                  to="/login"
                  className="flex-1 block text-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition duration-300"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="flex-1 block text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition duration-300"
                >
                  Sign up
                </Link>
              </div>
            </div>
          )}
          
          {/* Mobile user menu */}
          {user && (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full object-cover"
                    src={user?.profile?.profilePhoto || "https://via.placeholder.com/150"}
                    alt="User profile"
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user.fullname}</div>
                  <div className="text-sm font-medium text-gray-500 truncate max-w-[220px]">
                    {user?.profile?.bio || "No bio available"}
                  </div>
                </div>
              </div>
              
              <div className="mt-3 space-y-1">
                {user && user.role === "student" && (
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                  >
                    View Profile
                  </Link>
                )}
                {isShadowMode && (
                  <button
                    onClick={logoutHandler} // This will now call exitShadowMode
                    className="w-full text-left block px-4 py-2 text-base font-medium text-red-600 hover:bg-red-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 1 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Exit Shadow Mode
                  </button>
                )}

                <button
                  onClick={logoutHandler}
                  className="w-full text-left block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavBar;
