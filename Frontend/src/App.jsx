import { Navigate, createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./assets/Component/shared/Signup";
import { Home } from "./assets/Component/Auth/Home";
import Login from "./assets/Component/Auth/login.jsx";
import ForgotPassword from "./assets/Component/Auth/ForgotPassword.jsx";
import ResetPassword from "./assets/Component/Auth/ResetPassword.jsx";
import Jobs from "./assets/Component/Jobs.jsx";
import Browse from "./assets/Component/Browse.jsx";
import Profile from "./assets/Component/Profile.jsx";
import Dashboard from "./assets/Component/Dashboard.jsx";
import SavedJobs from "./assets/Component/SavedJobs.jsx";
import AboutUs from "./assets/Component/AboutUs.jsx";
import Resources from "./assets/Component/Resources.jsx";
import Support from "./assets/Component/Support.jsx";
import Notifications from "./assets/Component/Notifications.jsx";
import CompanyPage from "./assets/Component/CompanyPage.jsx";
import JobDescription from "./assets/Component/JobDescription.jsx";
import Companies from "./assets/Component/Recruiter/Companies.jsx";
import CompanyCreate from "./assets/Component/Recruiter/CompanyCreate.jsx";
import CompanySetUp from "./assets/Component/Recruiter/CompanySetUp.jsx";
import RecruiterJobs from "./assets/Component/Recruiter/RecruiterJobs.jsx";
import Applicants from "./assets/Component/Recruiter/Applicants.jsx";
import PostJobs from "./assets/Component/Recruiter/PostJobs.jsx";
import AuditLogs from "./assets/Component/Admin/AuditLogs.jsx";
import RecruiterDashboard from "./assets/Component/Recruiter/RecruiterDashboard.jsx";
import SystemAdminDashboard from "./assets/Component/Admin/SystemAdminDashboard.jsx";
import ProtectedRoute from "./assets/Component/Admin/ProtectRoute.jsx";
import RecruiterLayout from "./assets/Component/Recruiter/RecruiterLayout.jsx";
import Layout from "./assets/Component/shared/Layout";
import NotFound from "./assets/Component/shared/NotFound";
import { ROUTES } from "./routes/paths";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "reset-password/:token",
        element: <ResetPassword />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "about",
        element: <AboutUs />,
      },
      {
        path: "resources",
        element: <Resources />,
      },
      {
        path: "support",
        element: <Support />,
      },
      {
        path: "description/:id",
        element: <JobDescription />,
      },
      {
        path: "jobs",
        element: <Jobs />,
      },
      {
        path: "browse",
        element: <Browse />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "saved",
        element: <SavedJobs />,
      },
      {
        path: "notifications",
        element: <Notifications />,
      },
      {
        path: "company/:id",
        element: <CompanyPage />,
      },
      {
        path: "recruiter",
        element: <ProtectedRoute allowedRoles={["recruiter"]}><RecruiterLayout /></ProtectedRoute>,
        children: [
          {
            index: true,
            element: <RecruiterDashboard />,
          },
          {
            path: "companies",
            element: <Companies />,
          },
          {
            path: "companies/create",
            element: <CompanyCreate />,
          },
          {
            path: "companies/:id",
            element: <CompanySetUp />,
          },
          {
            path: "jobs",
            element: <RecruiterJobs />,
          },
          {
            path: "jobs/create",
            element: <PostJobs />,
          },
          {
            path: "jobs/:id/edit",
            element: <PostJobs />,
          },
          {
            path: "jobs/:id/applicants",
            element: <Applicants />,
          },
        ],
      },
      {
        path: "admin",
        element: <ProtectedRoute allowedRoles={["admin"]}><SystemAdminDashboard /></ProtectedRoute>,
      },
      {
        path: "admin/logs",
        element: <ProtectedRoute allowedRoles={["admin"]}><AuditLogs /></ProtectedRoute>,
      },
      {
        path: "admin/*",
        element: <Navigate to={ROUTES.ADMIN} replace />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={appRouter} />;
}

export default App;
