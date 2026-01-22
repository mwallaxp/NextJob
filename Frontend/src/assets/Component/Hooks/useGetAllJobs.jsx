import { setAllJobs } from "../../../redux/jobSlice";
// import { JOB_API_END_POINT } from "../../../utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {setAllAppliedJobs} from "../../../redux/jobSlice"
const useGetAllJobs = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllJobs = async () => {
  try {
    const res = await axios.get("https://nextjob-sw2d.onrender.com/api/v1/job/get");
    if (res.data.success) {
      dispatch(setAllJobs(res.data.jobs));
    } else {
      console.warn("Jobs fetch returned success=false:", res.data);
      dispatch(setAllJobs([]));
    }
  } catch (error) {
    if (error.response) {
      console.error("Jobs fetch failed:", error.response.status, error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
    dispatch(setAllJobs([]));
  }
};

    // Immediately invoke the async function
    fetchAllJobs();
  }, []); 
};

export default useGetAllJobs;