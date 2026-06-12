import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

const ProtectedRoute = ({ children, allowedRoles = ["recruiter"] }) => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      navigate("/", { replace: true });
    }
  }, [allowedRoles, user, navigate]);

  return <>{user && allowedRoles.includes(user.role) ? children : null}</>;
};

export default ProtectedRoute;
