import { setAllJobs } from "../../../redux/jobSlice";
import { JOB_API_END_POINT } from "../../../utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {setAllAppliedJobs} from "../../../redux/jobSlice"
const useGetAllJobs = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get`, {
          withCredentials: true
        });
        
        if (res.data.success) {
              dispatch(setAllJobs(res.data.jobs));
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        // Dispatch empty array on error to maintain state consistency
        dispatch(setAllAppliedJobs([]));
      }
    };

    // Immediately invoke the async function
    fetchAllJobs();
  }, []); 
};

export default useGetAllJobs;