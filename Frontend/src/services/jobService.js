import api from "../utils/api";
import { JOB_API_END_POINT } from "../utils/constant";

export const getAllJobs = (params = {}) =>
  api.get(`${JOB_API_END_POINT}/get`, { params });

export const getJobById = (jobId) =>
  api.get(`${JOB_API_END_POINT}/get/${jobId}`);

export const getRecruiterJobs = (params = {}) =>
  api.get(`${JOB_API_END_POINT}/recruiter`, { params });

export const createJob = (payload) =>
  api.post(`${JOB_API_END_POINT}/post`, payload);

export const updateJob = (jobId, payload) =>
  api.patch(`${JOB_API_END_POINT}/${jobId}`, payload);

export const updateJobStatus = (jobId, status) =>
  api.patch(`${JOB_API_END_POINT}/${jobId}/status`, { status });
