import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./assets/Component/shared/Signup";
import { Home } from "./assets/Component/Auth/Home";
import Login from "./assets/Component/Auth/login.jsx";
import Jobs from "./assets/Component/Jobs.jsx";
import Browse from "./assets/Component/Browse.jsx";
import Profile from "./assets/Component/Profile.jsx";
import JobDescription from "./assets/Component/JobDescription.jsx";
import Companies from "./assets/Component/Admin/Companies.jsx";
import CompanyCreate from "./assets/Component/Admin/CompanyCreate.jsx";
import CompanySetUp from "./assets/Component/Admin/CompanySetUp.jsx";
import AdminJobs from "./assets/Component/Admin/AdminJobs.jsx";
import Applicants from "./assets/Component/Admin/applicants.jsx";
import PostJobs from "./assets/Component/Admin/PostJobs.jsx";
import ProtectedRoute from "./assets/Component/Admin/ProtectRoute.jsx";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },

  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/Signup",
    element: <Signup />
  },
  {
    path: "/Description/:id",
    element: <JobDescription/>
  },
  {
    path: "/Jobs",
    element: <Jobs />,
  },
  {
    path: "/Browse",
    element: <Browse />,
  },
  {
    path: "/Profile",
    element: <Profile />,
  },
  //Admin
  {
    path:"/Admin/Companies",
    element:<ProtectedRoute><Companies/></ProtectedRoute>
  },
  {
    path:"/Admin/Companies/create",
    element:<CompanyCreate/>
  },
  {
    path:"/Admin/Companies/:id",
    element:<CompanySetUp/>
  }
  ,
  {
    path:"/Admin/jobs",
    element:<AdminJobs/>
  },
  {
    path:"/Admin/jobs/create",
    element:<PostJobs/>
  }
  ,
  {
    path:"/Admin/jobs/:id/applicant",
    element:<Applicants/>
  }
]);
function App() {
  return (
    <>
      <RouterProvider router={appRouter} />
    </>
  );
}

export default App;
