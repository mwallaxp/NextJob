import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import useGetAppliedJobs from "./Hooks/useGetAppliedJobs";
import useGetAllJobs from "./Hooks/useGetAllJobs";
import { Card, StatCard, ProgressBar, ButtonPrimary, Badge, EmptyState, SectionHeader } from "../../components/DesignSystem";
import { Bookmark, Briefcase, TrendingUp, CheckCircle, Clock, AlertCircle, Zap, Target, User, Download } from "lucide-react";
import { ROUTES } from "../../routes/paths";

const Dashboard = () => {
  const { user } = useSelector((store) => store.auth);
  const { allAppliedJobs, allJobs } = useSelector((store) => store.job);
  const navigate = useNavigate();
  const [statsData, setStatsData] = useState(null);
  const [savedIds, setSavedIds] = useState([]);

  useGetAppliedJobs();
  useGetAllJobs();

  useEffect(() => {
    const stored = window.localStorage.getItem("nextjobSavedJobs") || "[]";
    setSavedIds(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (!user) {
      navigate(ROUTES.LOGIN, { replace: true });
      return;
    }

    if (user.role === "recruiter") {
      navigate(ROUTES.RECRUITER, { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    // Calculate dashboard statistics
    if (allAppliedJobs && user) {
      const completionItems = [
        Boolean(user?.fullname),
        Boolean(user?.profile?.bio),
        Boolean(user?.profile?.resume),
        Boolean(user?.profile?.skills?.length),
      ];
      const completion = Math.round((completionItems.filter(Boolean).length / completionItems.length) * 100);
      
      const acceptedJobs = allAppliedJobs.filter(application => application.status === 'accepted' || application.interviewStage === 'hired').length;
      const pendingJobs = allAppliedJobs.filter(application => application.status === 'pending' || application.interviewStage === 'applied').length;
      const thisMonthJobs = allAppliedJobs.filter(job => {
        const jobDate = new Date(job.createdAt);
        const now = new Date();
        return jobDate.getMonth() === now.getMonth() && jobDate.getFullYear() === now.getFullYear();
      }).length;

      setStatsData({
        completion,
        acceptedJobs,
        pendingJobs,
        thisMonthJobs,
        totalApplications: allAppliedJobs.length,
      });
    }
  }, [allAppliedJobs, user]);

  if (!user || user.role === "recruiter") {
    return null;
  }

  if (!statsData) {
    return <div className="animate-pulse">Loading...</div>;
  }

  const latestApplications = allAppliedJobs?.slice(0, 5) || [];
  const appliedJobIds = new Set(allAppliedJobs?.map((application) => application?.job?._id || application?.job).filter(Boolean));
  const savedJobs = allJobs?.filter((job) => savedIds.includes(job._id || job.id)).slice(0, 3) || [];
  const userSkills = user?.profile?.skills || [];
  const recommendedJobs = allJobs
    ?.filter((job) => !appliedJobIds.has(job._id))
    ?.map((job) => {
      const jobSkills = job?.skills || job?.requirements || [];
      const matchCount = jobSkills.filter((skill) =>
        userSkills.some((userSkill) => userSkill.toLowerCase() === skill.toLowerCase())
      ).length;
      return { ...job, matchCount };
    })
    ?.sort((a, b) => b.matchCount - a.matchCount || new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    ?.slice(0, 3) || [];
  const nextSteps = [
    { completed: !!user?.profile?.fullname, label: "Complete Profile", action: () => navigate("/profile"), icon: <User size={18} /> },
    { completed: !!user?.profile?.resume, label: "Upload Resume", action: () => navigate("/profile"), icon: <Download size={18} /> },
    { completed: (user?.profile?.skills?.length || 0) >= 3, label: "Add 3+ Skills", action: () => navigate("/profile"), icon: <Target size={18} /> },
    { completed: statsData.totalApplications >= 5, label: "Apply to 5 Jobs", action: () => navigate("/browse"), icon: <Briefcase size={18} /> },
  ];

  const completedSteps = nextSteps.filter(s => s.completed).length;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Welcome Header */}
        <div className="mb-8 rounded-3xl border-2 border-slate-100 bg-gradient-to-br from-orange-50 to-white p-8 shadow-soft">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-orange-600">Employee Dashboard</p>
              <h1 className="mt-3 text-4xl font-bold text-slate-950">Welcome back, {user?.fullname || user?.email}</h1>
              <p className="mt-3 max-w-2xl text-base text-slate-600">
                Track your applications, improve your profile, and keep your job search moving from one place.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/browse"
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition-all"
              >
                <Zap size={18} />
                Browse Jobs
              </Link>
              <Link
                to="/profile"
                className="inline-flex items-center gap-2 rounded-xl bg-white border-2 border-black-100 px-6 py-3 text-sm font-semibold text-black-900 shadow-soft hover:bg-black-50 transition-all"
              >
                <User size={18} />
                Edit Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Key Statistics */}
        <div className="grid gap-6 mb-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            icon={Briefcase} 
            label="Applications Sent" 
            value={statsData.totalApplications}
            backgroundColor="bg-orange-50"
          />
          <StatCard 
            icon={CheckCircle} 
            label="Accepted" 
            value={statsData.acceptedJobs}
            backgroundColor="bg-emerald-50"
          />
          <StatCard 
            icon={Clock} 
            label="Pending Review" 
            value={statsData.pendingJobs}
            backgroundColor="bg-yellow-50"
          />
          <StatCard 
            icon={TrendingUp} 
            label="This Month" 
            value={statsData.thisMonthJobs}
            backgroundColor="bg-teal-50"
          />
        </div>

        <div className="grid gap-6 mb-8 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <SectionHeader
              title="Recommended Jobs"
              subtitle="Matched from your skills and recent openings"
              action={<Link to={ROUTES.BROWSE} className="text-orange-600 font-semibold hover:text-orange-700">Search all</Link>}
            />
            {recommendedJobs.length === 0 ? (
              <EmptyState
                icon={Target}
                title="No recommendations yet"
                description="Add skills to your profile or check back after more jobs are posted."
                action={<Link to={ROUTES.PROFILE} className="inline-block px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all">Improve profile</Link>}
              />
            ) : (
              <div className="space-y-3">
                {recommendedJobs.map((job) => (
                  <Link
                    key={job._id}
                    to={`/description/${job._id}`}
                    className="block rounded-xl border border-slate-200 bg-white p-4 transition hover:border-orange-300 hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-bold text-slate-950">{job.title}</p>
                        <p className="mt-1 text-sm text-slate-500">{job.company?.name || "Company"} - {job.location || "Remote"}</p>
                      </div>
                      <Badge variant={job.matchCount > 0 ? "success" : "secondary"}>
                        {job.matchCount > 0 ? `${job.matchCount} skill match` : "New"}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <SectionHeader
              title="Saved Jobs"
              subtitle="Jobs you marked for later"
              action={<Link to={ROUTES.SAVED_JOBS} className="text-orange-600 font-semibold hover:text-orange-700">View saved</Link>}
            />
            {savedJobs.length === 0 ? (
              <EmptyState
                icon={Bookmark}
                title="No saved jobs"
                description="Save jobs from search so you can compare them before applying."
                action={<Link to={ROUTES.BROWSE} className="inline-block px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all">Browse jobs</Link>}
              />
            ) : (
              <div className="space-y-3">
                {savedJobs.map((job) => (
                  <Link key={job._id || job.id} to={`/description/${job._id || job.id}`} className="block rounded-xl border border-slate-200 p-4 hover:border-orange-300">
                    <p className="font-bold text-slate-950">{job.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{job.company?.name || "Company"} - {job.jobType || "Role"}</p>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Profile Completion */}
        <Card className="mb-8 bg-gradient-to-br from-orange-50 to-white">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-black-900">Profile Strength</h3>
              <p className="text-sm text-black-600 mt-1">Complete your profile to stand out to employers</p>
            </div>
            <div className="text-3xl font-bold text-orange-600">{statsData.completion}%</div>
          </div>
          <ProgressBar value={statsData.completion} />
          <div className="mt-6 p-4 bg-white rounded-lg border border-black-100">
            <h4 className="font-semibold text-black-900 mb-4">Complete These to Boost Profile:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { completed: !!user?.fullname, label: "Full Name" },
                { completed: !!user?.profile?.bio, label: "Professional Bio" },
                { completed: !!user?.profile?.resume, label: "Upload Resume" },
                { completed: (user?.profile?.skills?.length || 0) > 0, label: "Add Skills" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  {item.completed ? (
                    <CheckCircle size={18} className="text-emerald-500" />
                  ) : (
                    <AlertCircle size={18} className="text-orange-500" />
                  )}
                  <span className={item.completed ? "text-black-600 line-through" : "text-black-900 font-medium"}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Next Steps */}
        <div className="grid gap-6 mb-8 lg:grid-cols-2">
          <Card>
            <h3 className="text-lg font-bold text-black-900 mb-6">Quick Actions</h3>
            <div className="space-y-3">
              {nextSteps.map((step, idx) => (
                <button
                  key={idx}
                  onClick={step.action}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                    step.completed
                      ? 'bg-emerald-50 border-emerald-200 hover:border-emerald-300'
                      : 'bg-orange-50 border-orange-200 hover:border-orange-400 hover:bg-orange-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${step.completed ? 'bg-emerald-200 text-emerald-700' : 'bg-orange-200 text-orange-700'}`}>
                      {step.icon}
                    </div>
                    <span className={`font-semibold ${step.completed ? 'text-emerald-900' : 'text-orange-900'}`}>
                      {step.label}
                    </span>
                  </div>
                  {step.completed && <CheckCircle size={18} className="text-emerald-600" />}
                </button>
              ))}
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-teal-50 to-white">
            <h3 className="text-lg font-bold text-black-900 mb-4">Job Search Progress</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-black-600 mb-2">Completion Progress</p>
                <p className="text-3xl font-bold text-teal-600">{completedSteps}/{nextSteps.length}</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-teal-200">
                <p className="text-sm text-black-700">
                  {completedSteps === nextSteps.length 
                    ? "Excellent. Your profile is in good shape, so keep applying to strong matches." 
                    : `You're ${Math.round((completedSteps / nextSteps.length) * 100)}% of the way to a complete profile!`}
                </p>
              </div>
              <button className="w-full py-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold transition-all">
                View Tips to Succeed
              </button>
            </div>
          </Card>
        </div>

        {/* Recent Applications */}
        <div>
          <SectionHeader 
            title="Recent Applications" 
            subtitle="Your latest job applications and their status"
            action={<Link to="/saved" className="text-orange-600 font-semibold hover:text-orange-700">View All →</Link>}
          />
          
          {latestApplications.length === 0 ? (
            <EmptyState 
              icon={Briefcase}
              title="No Applications Yet"
              description="Start applying to jobs to see your applications here"
              action={<Link to="/browse" className="inline-block px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all">
                Browse Jobs
              </Link>}
            />
          ) : (
            <div className="space-y-4">
              {latestApplications.map((job, idx) => (
                <Card key={idx} hoverable className="flex items-center justify-between p-6">
                  <div className="flex-1">
                    <h4 className="font-bold text-black-900 text-lg mb-2">{job?.job?.title || job.title}</h4>
                    <p className="text-black-600 text-sm mb-3">{job?.job?.company?.name || job.company?.name || "Company"}</p>
                    <div className="flex items-center gap-2">
                      {(job.status === 'accepted' || job.interviewStage === 'hired') && <Badge variant="success">Hired</Badge>}
                      {(job.interviewStage === 'interview' || job.interviewStage === 'screening') && <Badge variant="warning">Interview</Badge>}
                      {(job.status === 'pending' || job.interviewStage === 'applied') && <Badge variant="warning">Applied</Badge>}
                      {job.status === 'rejected' && <Badge variant="secondary">Rejected</Badge>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-black-600 mb-3">
                      Applied {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                    <Link 
                      to={`/description/${job?.job?._id || job._id}`}
                      className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700"
                    >
                      View Job →
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
