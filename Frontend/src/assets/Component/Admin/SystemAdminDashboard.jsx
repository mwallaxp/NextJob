import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../utils/api";
import { Activity, Briefcase, FileClock, Shield, Users } from "lucide-react";

const AdminStat = ({ icon, label, value }) => (
  <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-950 text-white">
      {icon}
    </div>
    <p className="mt-6 text-3xl font-semibold tracking-tight text-zinc-950">{value}</p>
    <p className="mt-1 text-sm font-medium text-zinc-500">{label}</p>
  </div>
);

const SystemAdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  const fetchStats = useCallback(async () => {
    try {
      const response = await api.get("/api/v1/admin/stats");
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load admin stats");
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-5 border-b border-zinc-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-500">System admin</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-950">Platform control center</h1>
            <p className="mt-3 max-w-2xl text-zinc-500">Monitor users, jobs, and audit activity outside the recruiter workspace.</p>
          </div>
          <Link
            to="/admin/logs"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            <FileClock size={16} />
            Audit logs
          </Link>
        </div>

        {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">{error}</div>}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <AdminStat icon={<Users size={18} />} label="Candidates" value={stats?.candidates || 0} />
          <AdminStat icon={<Shield size={18} />} label="Recruiters" value={stats?.recruiters || 0} />
          <AdminStat icon={<Briefcase size={18} />} label="Total jobs" value={stats?.totalJobs || 0} />
          <AdminStat icon={<Activity size={18} />} label="Active jobs" value={stats?.activeJobs || 0} />
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-200 p-5">
            <h2 className="text-lg font-semibold text-zinc-950">Recent activity</h2>
            <p className="text-sm text-zinc-500">Latest platform audit events.</p>
          </div>
          <div className="divide-y divide-zinc-100">
            {stats?.recentActivity?.length ? (
              stats.recentActivity.map((log) => (
                <div key={log._id} className="flex items-center justify-between gap-4 p-5">
                  <div>
                    <p className="font-semibold text-zinc-950">{log.action?.replaceAll("_", " ")}</p>
                    <p className="text-sm text-zinc-500">By {log.adminId?.fullname || "System"}</p>
                  </div>
                  <p className="text-sm text-zinc-400">{new Date(log.createdAt).toLocaleString()}</p>
                </div>
              ))
            ) : (
              <p className="p-5 text-sm text-zinc-500">No recent activity yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemAdminDashboard;
