import axios from 'axios';
import React, { useEffect } from 'react';
import { JOB_API_END_POINT } from '../../../utils/constant';
import { useDispatch } from 'react-redux';
import { setAllAdminJobs} from '../../../redux/jobSlice';

export const useGetAllAdminJobs = () => {
    const dispatch = useDispatch(); // Invoke useDispatch to get the dispatch function

    useEffect(() => {
        const fetchAllAdminJobs = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setAllAdminJobs(res.data.jobs)); // Dispatch the action with the jobs data
                }
            } catch (error) {
                // console.error('Error fetching jobs:', error); // Log the error for debugging
                console.log(error)
            }
        };

        fetchAllAdminJobs(); // Call the function
    }, [dispatch]); // Add dispatch as a dependency
};

export default useGetAllAdminJobs;
