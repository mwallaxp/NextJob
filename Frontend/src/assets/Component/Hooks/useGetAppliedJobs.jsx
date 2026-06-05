import api from "../../../utils/api";
import { useEffect } from "react";
import React from 'react'
import { useDispatch } from "react-redux";
import { APPLICATION_API_END_POINT } from "../../../utils/constant";
import { setAllAppliedJobs } from "../../../redux/jobSlice";

const useGetAppliedJobs = () => {
    const dispatch =useDispatch()
     
    useEffect (()=>{
        const fectAppliedJob = async () =>{
            try {
                const res = await api.get(`${APPLICATION_API_END_POINT}/get`)
                if(res.data.success)
                    console.log("succesfull")
                dispatch(setAllAppliedJobs(res.data.applications))
            } catch (error) {
                console.log(error)
            }
        } 
        fectAppliedJob()
    }, [])

}

export default useGetAppliedJobs