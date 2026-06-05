import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Signup from "./assets/Component/shared/Signup";
import { Home } from "./assets/Component/Auth/Home";
import Login from "./assets/Component/Auth/login.jsx";
import Jobs from "./assets/Component/Jobs.jsx";
import Browse from "./assets/Component/Browse.jsx";
import Profile from "./assets/Component/Profile.jsx";
import Dashboard from "./assets/Component/Dashboard.jsx";
import SavedJobs from "./assets/Component/SavedJobs.jsx";
import Notifications from "./assets/Component/Notifications.jsx";
import CompanyPage from "./assets/Component/CompanyPage.jsx";
import JobDescription from "./assets/Component/JobDescription.jsx";
import Companies from "./assets/Component/Admin/Companies.jsx";
import CompanyCreate from "./assets/Component/Admin/CompanyCreate.jsx";
import CompanySetUp from "./assets/Component/Admin/CompanySetUp.jsx";
import AdminJobs from "./assets/Component/Admin/AdminJobs.jsx";
import Applicants from "./assets/Component/Admin/Applicants.jsx";
import PostJobs from "./assets/Component/Admin/PostJobs.jsx";
import AdminDashboard from "./assets/Component/Admin/AdminDashboard.jsx";
import ProtectedRoute from "./assets/Component/Admin/ProtectRoute.jsx";
import AdminLayout from "./assets/Component/Admin/AdminLayout.jsx";
import Layout from "./assets/Component/shared/Layout";
import NotFound from "./assets/Component/shared/NotFound";

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
        path: "signup",
        element: <Signup />,
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
        path: "admin",
        element: <ProtectedRoute><AdminLayout /></ProtectedRoute>,
        children: [
          {
            index: true,
            element: <AdminDashboard />,
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
            element: <AdminJobs />,
          },
          {
            path: "jobs/create",
            element: <PostJobs />,
          },
          {
            path: "jobs/:id/applicants",
            element: <Applicants />,
          },
        ],
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
