import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import HeroSection from "./HeroSection";
import { LatestJob } from "../LatestJob";
import useGetAllJobs from "../Hooks/useGetAllJobs";
import { ROUTES } from "../../../routes/paths";

export const Home = () => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  
  // Call useGetAllJobs with empty keyword
 useGetAllJobs()

  useEffect(() => {
    if (user?.role === "recruiter") {
      navigate(ROUTES.RECRUITER);
    }
  }, [user, navigate]);

  return (
    <div>
      <HeroSection />
      <LatestJob />
    </div>
  );
};
