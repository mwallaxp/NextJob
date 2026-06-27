import { useMemo, useState } from "react";
import { Briefcase, CalendarCheck, Contact2Icon, FileText, MailIcon, MapPin, Pen, UserRound } from "lucide-react";
import { ApplicationJobTable } from "./ApplicationJobTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "./Hooks/useGetAppliedJobs";

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { allAppliedJobs } = useSelector((store) => store.job);

  const completion = useMemo(() => {
    const items = [
      Boolean(user?.fullname),
      Boolean(user?.profile?.bio),
      Boolean(user?.profile?.resume),
      Boolean(user?.profile?.skills?.length),
      Boolean(user?.profile?.profilePhoto),
    ];
    return Math.round((items.filter(Boolean).length / items.length) * 100);
  }, [user]);

  const resumeReady = Boolean(user?.profile?.resume);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row">
              <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 text-slate-500">
                {user?.profile?.profilePhoto ? (
                  <img src={user.profile.profilePhoto} alt={user?.fullname || "Profile"} className="h-full w-full object-cover" />
                ) : (
                  <UserRound size={40} />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Employee profile</p>
                <h1 className="mt-2 text-3xl font-black text-slate-950">{user?.fullname || "Your name"}</h1>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                  {user?.profile?.bio || "Add a short professional bio so recruiters understand your strengths quickly."}
                </p>
                <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-2"><MailIcon size={16} />{user?.email}</span>
                  <span className="inline-flex items-center gap-2"><Contact2Icon size={16} />{user?.phonenumber || "Phone not set"}</span>
                  <span className="inline-flex items-center gap-2"><MapPin size={16} />Preferred location not set</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              onClick={() => setOpen(true)}
            >
              <Pen className="h-4 w-4" />
              Edit profile
            </button>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-950">Profile completion</h2>
                <span className="text-2xl font-black text-blue-600">{completion}%</span>
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-blue-600" style={{ width: `${completion}%` }} />
              </div>
              <p className="mt-3 text-sm text-slate-500">Complete profiles are easier for recruiters to evaluate.</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-950">Resume</h2>
              {resumeReady ? (
                <a href={user.profile.resume} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50">
                  <FileText className="h-4 w-4" />
                  {user?.profile?.resumeOriginalName || "View resume"}
                </a>
              ) : (
                <p className="mt-4 text-sm text-slate-500">No resume uploaded yet.</p>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-950">Preferences</h2>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <p className="flex items-center gap-2"><CalendarCheck size={16} />Availability not set</p>
                <p className="flex items-center gap-2"><Briefcase size={16} />Preferred salary not set</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-950">Skills</h2>
              {user?.profile?.skills?.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {user.profile.skills.map((skill) => (
                    <span key={skill} className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-500">No skills listed yet.</p>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-950">Application tracking</h2>
                  <p className="text-sm text-slate-500">{allAppliedJobs?.length || 0} applications submitted</p>
                </div>
              </div>
              <ApplicationJobTable />
            </div>
          </div>
        </section>
      </div>

      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </main>
  );
};

export default Profile;
