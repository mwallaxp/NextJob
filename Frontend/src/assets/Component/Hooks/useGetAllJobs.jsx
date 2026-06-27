import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAllJobs } from "../../../redux/jobSlice";
import { getAllJobs } from "../../../services/jobService";

const useGetAllJobs = (params = {}) => {
  const dispatch = useDispatch();
  const paramsKey = JSON.stringify(params);

  useEffect(() => {
    const stableParams = JSON.parse(paramsKey);
    const fetchAllJobs = async () => {
      try {
        const res = await getAllJobs(stableParams);

        if (res.data.success) {
          dispatch(setAllJobs(res.data.jobs));
        }
      } catch (error) {
        console.error("Error fetching jobs:", error.response?.data || error.message);
        dispatch(setAllJobs([]));
      }
    };

    fetchAllJobs();
  }, [dispatch, paramsKey]);
};

export default useGetAllJobs;
