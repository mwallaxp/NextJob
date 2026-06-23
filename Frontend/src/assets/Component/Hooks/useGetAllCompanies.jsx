import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCompanies } from '../../../redux/companySlice';
import { getRecruiterCompanies } from '../../../services/companyService';

export const useGetAllCompanies = () => {
    const dispatch = useDispatch(); // Invoke useDispatch to get the dispatch function

    useEffect(() => {
        const fetchCompanies
         = async () => {
            try {
                const res = await getRecruiterCompanies();
                if (res.data.success) {
                    dispatch(setCompanies(res.data.companies)); // Dispatch the action with the companies data
                }
            } catch (error) {
                // console.error('Error fetching companies:', error); // Log the error for debugging
                console.log(error)
            }
        };

        fetchCompanies(); // Call the function
    }, [dispatch]); // Add dispatch as a dependency
};

export default useGetAllCompanies;
