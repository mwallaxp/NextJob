import axios from "axios";
import React, { useEffect } from "react";
import { COMPANY_API_END_POINT } from "../../../utils/constant";
import { useDispatch } from "react-redux";
import { setAllJobs } from "../../../redux/jobSlice";
import { setSingleCompany } from "../../../redux/companySlice";
// import { useEffect } from 'react';

export const useGetCompanyById = (ComapanyId) => {
  const dispatch = useDispatch(); // Invoke useDispatch to get the dispatch function

  useEffect(() => {
    const fetchSingleCompany = async () => {
      try {
        const res = await axios.get(
          `${COMPANY_API_END_POINT}/get${ComapanyId}`,
          { withCredentials: true }
        );
        console.log(res.data.company);
        if (res.data.success) {
          dispatch(setSingleCompany(res.data.company)); // Dispatch the action with the jobs data
        }
      } catch (error) {
        // console.error('Error fetching jobs:', error); // Log the error for debugging
        console.log(error);
      }
    };

    fetchSingleCompany(); // Call the function
  }, [ComapanyId, dispatch]); // Add dispatch as a dependency
};

export default useGetCompanyById;
