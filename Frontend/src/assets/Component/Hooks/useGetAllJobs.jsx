import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAllJobs } from "../../../redux/jobSlice";
import { getAllJobs } from "../../../services/jobService";

const useGetAllJobs = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const res = await getAllJobs();

        if (res.data.success) {
          dispatch(setAllJobs(res.data.jobs));
        }
      } catch (error) {
        console.error("Error fetching jobs:", error.response?.data || error.message);
        dispatch(setAllJobs([]));
      }
    };

    fetchAllJobs();
  }, [dispatch]);
};

export default useGetAllJobs;
