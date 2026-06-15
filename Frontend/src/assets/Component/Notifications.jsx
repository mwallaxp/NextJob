import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Bell, CheckCircle, AlertTriangle } from "lucide-react";
import { NOTIFICATION_API_END_POINT } from "../../utils/constant";
import api from "../../utils/api";

const iconByType = {
  success: CheckCircle,
  info: Bell,
  warning: AlertTriangle,
};

const Notifications = () => {
  const { user } = useSelector((store) => store.auth);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const res = await api.get(`${NOTIFICATION_API_END_POINT}`);
        if (res.data.success) {
          const transformed = res.data.notifications.map(note => ({
            id: note._id,
            title: note.type.replace('_', ' '),
            description: note.message,
            type: note.type === 'APPLICATION_STATUS' && note.message.includes('accepted') ? 'success' : 
                  note.type === 'APPLICATION_STATUS' && note.message.includes('rejected') ? 'warning' : 'info',
            time: new Date(note.createdAt).toLocaleDateString() + ' ' + new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isRead: note.isRead
          }));
          setNotifications(transformed);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [user, navigate]);

  const markAllRead = async () => {
    try {
      await api.delete(`${NOTIFICATION_API_END_POINT}/clear`);
      setNotifications([]);
    } catch (error) {
      console.error("Failed to clear notifications");
    }
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
            className="rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
          >
            Mark all read
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500 animate-pulse font-medium">Fetching your updates...</div>
      ) : notifications.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-14 text-center text-slate-500">
          <p className="text-lg font-semibold">No new notifications</p>
          <p className="mt-2">You're all caught up. Check the latest jobs or visit your dashboard.</p>
          <Link to="/dashboard" className="mt-6 inline-flex rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-600">
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
