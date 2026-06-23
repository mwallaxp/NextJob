import api from "../utils/api";
import { COMPANY_API_END_POINT } from "../utils/constant";

export const getRecruiterCompanies = () =>
  api.get(`${COMPANY_API_END_POINT}/get`);

export const getCompanyById = (companyId) =>
  api.get(`${COMPANY_API_END_POINT}/get/${companyId}`);

export const createCompany = (payload) =>
  api.post(`${COMPANY_API_END_POINT}/register`, payload);

export const updateCompany = (companyId, payload) =>
  api.put(`${COMPANY_API_END_POINT}/update/${companyId}`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
