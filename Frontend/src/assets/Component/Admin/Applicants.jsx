import React, { useEffect } from "react";
import NavBar from "../shared/NavBar";
import ApplicantTable from "./ApplicantTable";
import axios from "axios";
import { APPLICATION_API_END_POINT } from "../../../utils/constant";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAllApplicants } from "../../../redux/ApplicationSlice";

const Applicants = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const { application } = useSelector((store) => store.Application);

  useEffect(() => {
    const fetchAllApplicant = async () => {
      try {
        const res = await axios.get(
          `${APPLICATION_API_END_POINT}/${params.id}/applicants`,
          { withCredentials: true }
        );
        if (res.data.success) {
          dispatch(setAllApplicants(res.data.job));
        }
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    };

    fetchAllApplicant();
  }, [params, dispatch]);

  return (
    <div>
      <NavBar />
      <div className="items-center max-w-7xl mx-auto">
        <h1 className="font-bold text-xl my-5">
          Applications ({application?.length || 0})
        </h1>
        <ApplicantTable />
      </div>
    </div>
  );
};

export default Applicants;
