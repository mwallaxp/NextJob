import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthChecked, setLoading, setUser } from "../../../redux/authSlice";
import api from "../../../utils/api";
import { USER_API_END_POINT } from "../../../utils/constant";

const AuthInitializer = () => {
  const dispatch = useDispatch();
  const { user, authChecked } = useSelector((store) => store.auth);

  useEffect(() => {
    let active = true;

    const loadCurrentUser = async () => {
      const token = localStorage.getItem('token');
      if (authChecked) return;

      if (!token && !user) {
        dispatch(setAuthChecked(true));
        return;
      }

      dispatch(setLoading(true));
      try {
        const res = await api.get(`${USER_API_END_POINT}/current`, {
          skipAuthRedirect: true,
        });

        if (active && res.data.success) {
          dispatch(setUser(res.data.user));
        }
      } catch {
        if (active) {
          localStorage.removeItem("token");
          dispatch(setUser(null));
        }
      } finally {
        if (active) {
          dispatch(setLoading(false));
          dispatch(setAuthChecked(true));
        }
      }
    };

    loadCurrentUser();

    return () => {
      active = false; // Cleanup to prevent state updates on unmounted component
    };
  }, [authChecked, dispatch, user]);

  return null;
};

export default AuthInitializer;
