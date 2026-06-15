import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import { JOB_API_END_POINT } from '../../utils/constant';
import { 
  Card, 
  StatCard, 
  Badge, 
  ButtonPrimary, 
  SectionHeader, 
  EmptyState 
} from "../../components/DesignSystem";
import { 
  Plus, 
  Briefcase, 
  Users, 
  Eye, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle,
  MoreVertical
} from "lucide-react";
import { toast } from 'react-toastify';

const RecruiterDashboard = () => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    if (!user || user.role !== 'recruiter') {
      navigate('/login', { replace: true });
    }

    const fetchAdminJobs = async () => {
      try {
        setLoading(true);
        const res = await api.get(`${JOB_API_END_POINT}/getadminjobs`);
        if (res.data.success) {
          setJobs(res.data.jobs);
        }
      } catch (error) {
        console.error("Error fetching recruiter jobs:", error);
        toast.error("Failed to load your job postings");
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'recruiter') {
      fetchAdminJobs();
    }
  }, [user, navigate]);

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => 
      job.title.toLowerCase().includes(filterText.toLowerCase()) ||
      job.company?.name?.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [jobs, filterText]);

  const stats = useMemo(() => {
    const totalApplicants = jobs.reduce((acc, job) => acc + (job.applications?.length || 0), 0);
    const activeJobs = jobs.filter(j => !j.isClosed).length;
    return {
      totalJobs: jobs.length,
      totalApplicants,
      activeJobs,
      pendingReviews: totalApplicants // Placeholder for actual pending count if available
    };
  }, [jobs]);

  if (!user || user.role !== 'recruiter') {
    return null;
  }

  return (
    <main className="min-h-screen bg-black-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-orange-600">Recruiter Portal</p>
            <h1 className="mt-2 text-4xl font-bold text-black-900">Welcome, {user.fullname.split(' ')[0]}!</h1>
            <p className="mt-2 text-black-600">Manage your active postings and track incoming talent.</p>
          </div>
          <Link to="/admin/jobs/create">
            <ButtonPrimary className="flex items-center gap-2">
              <Plus size={18} />
              Post New Job
            </ButtonPrimary>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 mb-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Briefcase} label="Total Postings" value={stats.totalJobs} backgroundColor="bg-orange-50" />
          <StatCard icon={Users} label="Total Applicants" value={stats.totalApplicants} backgroundColor="bg-blue-50" />
          <StatCard icon={CheckCircle} label="Active Roles" value={stats.activeJobs} backgroundColor="bg-emerald-50" />
          <StatCard icon={Clock} label="Pending Reviews" value={stats.pendingReviews} backgroundColor="bg-amber-50" />
        </div>

        {/* Management Section */}
        <SectionHeader 
          title="Manage Postings" 
          subtitle="View and manage all jobs you have posted on the platform"
        />

        <Card className="mt-4 overflow-hidden">
          <div className="p-4 border-b border-black-100 bg-white flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black-400" size={18} />
              <input 
                type="text"
                placeholder="Filter by job title..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-black-100 focus:outline-none focus:border-orange-500"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="p-20 text-center animate-pulse text-black-400">Loading your postings...</div>
          ) : filteredJobs.length === 0 ? (
            <EmptyState 
              icon={Briefcase}
              title="No jobs found"
              description={filterText ? "Try adjusting your search filter" : "You haven't posted any jobs yet."}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-black-50 text-black-600 text-sm uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-bold">Job Role</th>
                    <th className="px-6 py-4 font-bold">Date Posted</th>
                    <th className="px-6 py-4 font-bold text-center">Applicants</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black-100">
                  {filteredJobs.map((job) => (
                    <tr key={job._id} className="hover:bg-black-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-black-900">{job.title}</p>
                        <p className="text-xs text-black-500">{job.company?.name}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-black-600">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant="teal">{job.applications?.length || 0} applied</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={job.isClosed ? "secondary" : "success"}>
                          {job.isClosed ? "Closed" : "Active"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                          className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700 transition-colors"
                        >
                          <Users size={16} />
                          <span>Applicants</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </main>
  );
};

export default RecruiterDashboard;