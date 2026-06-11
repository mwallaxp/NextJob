import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Copy } from "lucide-react";
import { toast } from "react-toastify";
import api from "../../../utils/api";
import { USER_API_END_POINT } from "../../../utils/constant";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetUrl, setResetUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    setLoading(true);
    setResetUrl("");

    try {
      const res = await api.post(`${USER_API_END_POINT}/forgot-password`, {
        email: email.trim(),
      });

      toast.success(res.data.message || "Reset request submitted");
      if (res.data.resetUrl) {
        setResetUrl(res.data.resetUrl);
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Unable to start password reset";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const copyResetLink = async () => {
    try {
      await navigator.clipboard.writeText(resetUrl);
      toast.success("Reset link copied");
    } catch {
      toast.error("Unable to copy reset link");
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

        <h1 className="text-3xl font-bold text-slate-900">Reset password</h1>
        <p className="mt-2 text-sm text-slate-600">
          Enter your account email and we will send you a secure reset link.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Email Address
            </label>
            <div className="relative mt-1">
              <Mail
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full rounded-lg border border-slate-300 px-10 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Sending link..." : "Send reset link"}
          </button>
        </form>

        {resetUrl && (
          <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4">
            <p className="text-sm font-medium text-blue-950">Development reset link</p>
            <div className="mt-3 flex gap-2">
              <Link
                to={new URL(resetUrl).pathname}
                className="min-w-0 flex-1 truncate rounded-md bg-white px-3 py-2 text-sm text-blue-700 ring-1 ring-blue-200"
              >
                {resetUrl}
              </Link>
              <button
                type="button"
                onClick={copyResetLink}
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 text-white hover:bg-blue-700"
                aria-label="Copy reset link"
              >
                <Copy size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
