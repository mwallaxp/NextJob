import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAllAppliedJobs } from "../../../redux/jobSlice";
import { getAppliedJobs } from "../../../services/applicationService";

const useGetAppliedJobs = () => {
    const dispatch =useDispatch()
     
    useEffect (()=>{
        const fectAppliedJob = async () =>{
            try {
                const res = await getAppliedJobs()
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
