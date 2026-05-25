import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, CheckCircle2, Clock, XCircle, Search } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const FreelancerDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get('/api/v1/application/get', { withCredentials: true });
        setApplications(res.data.applications);
      } catch (err) {
        toast.error("Failed to load your bids.");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'rejected': return 'bg-rose-50 text-rose-700 border-rose-100';
      default: return 'bg-amber-50 text-amber-700 border-amber-100';
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-surface p-6 lg:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header & Stats */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Bids</h1>
          <p className="text-slate-500">Track your proposals and application status.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Total Applications', value: applications.length, icon: Briefcase, color: 'text-brand-600' },
            { label: 'Shortlisted', value: applications.filter(a => a.status === 'accepted').length, icon: CheckCircle2, color: 'text-emerald-600' },
            { label: 'Pending Response', value: applications.filter(a => a.status === 'pending').length, icon: Clock, color: 'text-amber-600' }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className={cn("p-3 rounded-xl bg-slate-50", stat.color)}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bids List */}
        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600"></div></div>
        ) : applications.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <Search className="mx-auto text-slate-300 mb-4" size={48} />
            <p className="text-slate-500">You haven't applied for any jobs yet.</p>
          </div>
        ) : (
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
            {applications.map((app) => (
              <motion.div key={app._id} variants={item} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
                    {app.job?.company?.logo ? <img src={app.job.company.logo} alt="logo" /> : <Briefcase className="text-slate-400" size={20} />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{app.job?.title}</h3>
                    <p className="text-sm text-slate-500">{app.job?.company?.name} • Applied {new Date(app.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className={cn("px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border", getStatusStyle(app.status))}>
                    {app.status || 'pending'}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FreelancerDashboard;