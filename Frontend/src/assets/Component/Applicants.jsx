import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { APPLICATION_API_END_POINT } from '../../utils/constant';
import { MoreHorizontal, CheckCircle, XCircle, ExternalLink, User } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Applicants = () => {
  const { id: jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchApplicants = async () => {
    try {
      const res = await axios.get(`${APPLICATION_API_END_POINT}/${jobId}/applicants`, {
        withCredentials: true,
      });
      if (res.data.status === 'success') {
        setApplicants(res.data.job.applications);
        setJobTitle(res.data.job.title);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch applicants");
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (status, applicationId) => {
    try {
      const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${applicationId}/update`, 
        { status }, 
        { withCredentials: true }
      );
      if (res.data.status === 'success') {
        toast.success(res.data.message);
        // Refresh local state to reflect change
        setApplicants((prev) => 
          prev.map(app => app._id === applicationId ? { ...app, status: status.toLowerCase() } : app)
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  if (loading) return <div className="flex justify-center items-center h-screen text-slate-500">Loading applicants...</div>;

  return (
    <div className="max-w-7xl mx-auto my-10 px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Applicants</h1>
        <p className="text-slate-500 mt-1 font-medium">{jobTitle} • {applicants.length} Total</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Full Name</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Email</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Contact</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Resume</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Date</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence>
                {applicants.map((app) => (
                  <motion.tr 
                    key={app._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                          <User size={16} />
                        </div>
                        <span className="font-semibold text-slate-700">{app.applicant?.fullname}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">{app.applicant?.email}</td>
                    <td className="px-6 py-4 text-slate-600 text-sm">{app.applicant?.phonenumber || 'N/A'}</td>
                    <td className="px-6 py-4">
                      {app.applicant?.profile?.resume ? (
                        <a 
                          href={app.applicant.profile.resume} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-brand-600 flex items-center gap-1 text-sm font-medium hover:underline"
                        >
                          View <ExternalLink size={14} />
                        </a>
                      ) : <span className="text-slate-400 text-sm">No Resume</span>}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <button 
                          onClick={() => statusHandler("accepted", app._id)}
                          className={cn(
                            "p-2 rounded-lg transition-all",
                            app.status === 'accepted' ? "bg-emerald-100 text-emerald-700" : "text-slate-400 hover:bg-emerald-50 hover:text-emerald-600"
                          )}
                          title="Accept"
                        >
                          <CheckCircle size={20} />
                        </button>
                        <button 
                          onClick={() => statusHandler("rejected", app._id)}
                          className={cn(
                            "p-2 rounded-lg transition-all",
                            app.status === 'rejected' ? "bg-rose-100 text-rose-700" : "text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                          )}
                          title="Reject"
                        >
                          <XCircle size={20} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {applicants.length === 0 && (
            <div className="p-10 text-center text-slate-400">No applicants yet for this position.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Applicants;