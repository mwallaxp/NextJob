import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";
import { toast } from "react-toastify";
import api from "../../../utils/api";
import { USER_API_END_POINT } from "../../../utils/constant";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [input, setInput] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (input.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (input.password !== input.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post(`${USER_API_END_POINT}/reset-password/${token}`, {
        password: input.password,
        confirmPassword: input.confirmPassword,
      });

      toast.success(res.data.message || "Password reset successfully");
      navigate("/login");
    } catch (error) {
      const message =
        error.response?.data?.message || "Unable to reset password";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-xl">
        <Link
          to="/login"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft size={16} />
          Back to login
        </Link>

        <h1 className="text-3xl font-bold text-slate-900">Create new password</h1>
        <p className="mt-2 text-sm text-slate-600">
          Choose a new password with at least 8 characters.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              New Password
            </label>
            <div className="relative mt-1">
              <Lock
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                id="password"
                name="password"
                type="password"
                value={input.password}
                onChange={handleChange}
                placeholder="Enter new password"
                className="w-full rounded-lg border border-slate-300 px-10 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
              Confirm Password
            </label>
            <div className="relative mt-1">
              <Lock
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={input.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                className="w-full rounded-lg border border-slate-300 px-10 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Resetting..." : "Reset password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
