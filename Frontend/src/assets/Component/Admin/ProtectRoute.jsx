import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    if (user.role !== "recruiter") {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  return <>{user && user.role === "recruiter" ? children : null}</>;
};

export default ProtectedRoute;
