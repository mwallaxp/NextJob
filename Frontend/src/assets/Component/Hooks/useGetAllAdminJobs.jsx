import api from '../../../utils/api';
import { useEffect, useState } from 'react';
import { JOB_API_END_POINT } from '../../../utils/constant';
import { useDispatch } from 'react-redux';
import { setAllAdminJobs} from '../../../redux/jobSlice';

export const useGetAllAdminJobs = (params = {}) => {
    const dispatch = useDispatch(); // Invoke useDispatch to get the dispatch function
    const [meta, setMeta] = useState({ total: 0, currentPage: 1, totalPages: 1 });

    useEffect(() => {
        const fetchAllAdminJobs = async () => {
            try {
                const res = await api.get(`${JOB_API_END_POINT}/getadminjobs`, { params });
                if (res.data.success) {
                    dispatch(setAllAdminJobs(res.data.jobs)); // Dispatch the action with the jobs data
                    setMeta({
                        total: res.data.total || res.data.jobs?.length || 0,
                        currentPage: res.data.currentPage || 1,
                        totalPages: res.data.totalPages || 1,
                    });
                }
            } catch (error) {
                // console.error('Error fetching jobs:', error); // Log the error for debugging
                console.log(error)
            }
        };

        fetchAllAdminJobs(); // Call the function
    }, [dispatch, params.page, params.limit, params.search, params.status, params.jobType, params.companyId]); // Add dispatch as a dependency

    return meta;
};

export default useGetAllAdminJobs;
