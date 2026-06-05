import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Bell, CheckCircle, AlertTriangle } from "lucide-react";

const initialNotifications = [
  {
    id: 1,
    title: "New job match available",
    description: "A new role that matches your profile has been posted.",
    type: "success",
    time: "2 hours ago",
  },
  {
    id: 2,
    title: "Application updated",
    description: "One of your applications has a status change.",
    type: "info",
    time: "Yesterday",
  },
  {
    id: 3,
    title: "Profile recommendation",
    description: "Complete your profile to improve your job match score.",
    type: "warning",
    time: "3 days ago",
  },
];

const iconByType = {
  success: CheckCircle,
  info: Bell,
  warning: AlertTriangle,
};

const Notifications = () => {
  const { user } = useSelector((store) => store.auth);
  const [notifications, setNotifications] = useState(initialNotifications);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  const markAllRead = () => {
    setNotifications([]);
  };

  if (!user) {
    return null;
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Notifications</p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900">Stay updated</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-600">
              Keep track of application status updates, new job matches, and profile recommendations.
            </p>
          </div>
          <button
            onClick={markAllRead}
            className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Mark all read
          </button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-14 text-center text-slate-500">
          <p className="text-lg font-semibold">No new notifications</p>
          <p className="mt-2">You're all caught up. Check the latest jobs or visit your dashboard.</p>
          <Link to="/dashboard" className="mt-6 inline-flex rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
            Go to dashboard
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((item) => {
            const Icon = iconByType[item.type] || Bell;
            return (
              <div key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <span className="mt-1 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-semibold text-slate-900">{item.title}</h2>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                        {item.time}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default Notifications;
