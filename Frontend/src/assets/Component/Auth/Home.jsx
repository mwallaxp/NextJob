import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import NavBar from "../shared/NavBar";
import HeroSection from "./HeroSection";
import { LatestJob } from "../LatestJob";
import useGetAllJobs from "../Hooks/useGetAllJobs";

export const Home = () => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  
  // Call useGetAllJobs with empty keyword
 useGetAllJobs()

  useEffect(() => {
    if (user?.role === "recruiter") {
      navigate("/Admin/Companies"); // Absolute path
    }
  }, [user, navigate]);

  return (
    <div>
      <NavBar />
      <HeroSection />
      <LatestJob />
    </div>
  );
};