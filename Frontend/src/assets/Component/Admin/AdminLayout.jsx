import { NavLink, Outlet } from "react-router-dom";
import { BarChart3, Briefcase, Building2, PlusCircle } from "lucide-react";

const adminLinks = [
  { to: "/recruiter", label: "Dashboard", icon: BarChart3 },
  { to: "/recruiter/companies", label: "Companies", icon: Building2 },
  { to: "/recruiter/jobs", label: "Job postings", icon: Briefcase },
  { to: "/recruiter/jobs/create", label: "Post job", icon: PlusCircle },
];

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-sm">
          <div className="grid min-h-[calc(100vh-3rem)] lg:grid-cols-[260px_1fr]">
            <aside className="border-b border-zinc-200 bg-zinc-950 p-5 text-white lg:border-b-0 lg:border-r lg:border-zinc-900">
              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">NextJob</p>
                <h1 className="mt-3 text-2xl font-semibold tracking-tight">Recruiter</h1>
              </div>
              <nav className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                {adminLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === "/recruiter"}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-full px-4 py-3 text-sm font-semibold transition ${
                        isActive
                          ? "bg-white text-zinc-950"
                          : "text-zinc-400 hover:bg-white/10 hover:text-white"
                      }`
                    }
                  >
                    <link.icon size={17} />
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            </aside>
            <section className="bg-white p-5 sm:p-7 lg:p-8">
              <Outlet />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
