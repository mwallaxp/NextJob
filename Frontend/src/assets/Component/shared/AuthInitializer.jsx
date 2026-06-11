import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "../../../redux/authSlice";
import api from "../../../utils/api";
import { USER_API_END_POINT } from "../../../utils/constant";

const AuthInitializer = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  useEffect(() => {
    let active = true;

    const loadCurrentUser = async () => {
      if (user) return;

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
        }
      }
    };

    loadCurrentUser();

    return () => {
      active = false;
    };
  }, [dispatch, user]);

  return null;
};

export default AuthInitializer;
