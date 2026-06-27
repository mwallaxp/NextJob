export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  JOBS: "/jobs",
  BROWSE: "/browse",
  PROFILE: "/profile",
  EMPLOYEE_DASHBOARD: "/dashboard",
  SAVED_JOBS: "/saved",
  NOTIFICATIONS: "/notifications",
  ABOUT: "/about",
  RESOURCES: "/resources",
  SUPPORT: "/support",

  RECRUITER: "/recruiter",
  RECRUITER_COMPANIES: "/recruiter/companies",
  RECRUITER_COMPANY_CREATE: "/recruiter/companies/create",
  RECRUITER_COMPANY_DETAIL: (id) => `/recruiter/companies/${id}`,
  RECRUITER_JOBS: "/recruiter/jobs",
  RECRUITER_JOB_CREATE: "/recruiter/jobs/create",
  RECRUITER_JOB_EDIT: (id) => `/recruiter/jobs/${id}/edit`,
  RECRUITER_JOB_APPLICANTS: (id) => `/recruiter/jobs/${id}/applicants`,

  ADMIN: "/admin",
  ADMIN_LOGS: "/admin/logs",
};

export const getDashboardRouteForRole = (role) => {
  if (role === "recruiter") return ROUTES.RECRUITER;
  if (role === "admin") return ROUTES.ADMIN;
  return ROUTES.EMPLOYEE_DASHBOARD;
};
