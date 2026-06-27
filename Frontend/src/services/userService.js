import api from "../utils/api";
import { USER_API_END_POINT } from "../utils/constant";

export const getSavedJobs = () =>
  api.get(`${USER_API_END_POINT}/saved-jobs`);

export const toggleSavedJob = (jobId) =>
  api.post(`${USER_API_END_POINT}/saved-jobs/${jobId}`);
