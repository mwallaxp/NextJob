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
        const token = localStorage.getItem("token");

        const res = await axios.get(`${JOB_API_END_POINT}/get`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success) {
          dispatch(setAllJobs(res.data.jobs));
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        dispatch(setAllAppliedJobs([]));
      }
    };

    fetchAllJobs();
  }, [dispatch]);
};

export default useGetAllJobs;