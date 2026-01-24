import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setAllJobs, setAllAppliedJobs } from "../../../redux/jobSlice";
import { JOB_API_END_POINT } from "../../../utils/constant";

const useGetAllJobs = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.warn("No token found. User might not be logged in.");
          dispatch(setAllAppliedJobs([]));
          return;
        }

        const res = await axios.get(`${JOB_API_END_POINT}/get`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success) {
          dispatch(setAllJobs(res.data.jobs));
        } else {
          dispatch(setAllAppliedJobs([]));
        }
      } catch (error) {
        console.error("Error fetching jobs:", error.response?.data || error.message);
        dispatch(setAllAppliedJobs([]));
      }
    };

    fetchAllJobs();
  }, [dispatch]);
};

export default useGetAllJobs;
