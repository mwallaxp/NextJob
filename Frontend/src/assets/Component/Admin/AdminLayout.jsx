import { NavLink, Outlet } from "react-router-dom";

const adminLinks = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/companies", label: "Companies" },
  { to: "/admin/jobs", label: "Job postings" },
  { to: "/admin/jobs/create", label: "Post job" },
  { to: "/admin/logs", label: "Audit Logs" },
];

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
            <aside className="border-r border-slate-200 bg-slate-50 p-6">
              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Recruiter dashboard</p>
                <h1 className="mt-3 text-2xl font-bold text-slate-900">Admin panel</h1>
              </div>
              <nav className="space-y-2">
                {adminLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                        isActive
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            </aside>
            <section className="p-6">
              <Outlet />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
