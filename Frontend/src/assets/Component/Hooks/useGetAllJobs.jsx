import { setAllJobs } from "../../../redux/jobSlice";
import { JOB_API_END_POINT } from "../../../utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllJobs = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(`${JOB_API_END_POINT}/get`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success) {
          dispatch(setAllJobs(res.data.jobs));
        }
      } catch (error) {
        console.error("Error fetching jobs:", {
  message: s?.message,
  response: s?.response?.data,
  status: s?.response?.status,
  error: error
})

        dispatch(setAllJobs([]));
      }
    };

    fetchAllJobs();
  }, [dispatch]);
};

export default useGetAllJobs;
