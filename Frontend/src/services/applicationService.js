import api from "../utils/api";
import { APPLICATION_API_END_POINT } from "../utils/constant";

export const getAppliedJobs = () =>
  api.get(`${APPLICATION_API_END_POINT}/get`);

export const getJobApplicants = (jobId, params = {}) =>
  api.get(`${APPLICATION_API_END_POINT}/${jobId}/applicant`, { params });

export const getJobApplicantsLegacy = (jobId) =>
  api.get(`${APPLICATION_API_END_POINT}/${jobId}/applicants`);

export const applyToJob = (jobId) =>
  api.post(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {});

export const updateApplicationStatus = (applicationId, status) =>
  api.post(`${APPLICATION_API_END_POINT}/status/${applicationId}/update`, { status });

export const updateApplicationReview = (applicationId, payload) =>
  api.patch(`${APPLICATION_API_END_POINT}/${applicationId}/review`, payload);
