import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Badge, 
  ButtonSmall, 
  SectionHeader, 
  EmptyState 
} from "../../../components/DesignSystem";
import { ArrowLeft, Mail, Phone, Target, Check, X, Download, Sparkles } from "lucide-react";
import { toast } from 'react-toastify';
import { ROUTES } from '../../../routes/paths';
import { getJobApplicantsLegacy, updateApplicationStatus } from '../../../services/applicationService';

const JobApplicants = () => {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all'); // New state for status filter

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        setLoading(true);
        const res = await getJobApplicantsLegacy(jobId);
        if (res.data.success) {
          setApplicants(res.data.job.applications);
          setJobTitle(res.data.job.title);
        }
      } catch (error) {
        console.error("Error fetching applicants:", error);
        toast.error("Failed to load applicants");
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [jobId]);

  const filteredApplicants = applicants.filter(app => {
    if (filterStatus === 'all') return true;
    return app.status === filterStatus;
  });

  const handleStatusUpdate = async (status, applicationId) => {
    // Save current state for rollback
    const previousApplicants = [...applicants];

    // Optimistic Update
    setApplicants(prev => prev.map(app => 
      app._id === applicationId ? { ...app, status } : app
    ));

    try {
      const res = await updateApplicationStatus(applicationId, status);
      if (res.data.success) {
        toast.success(`Application ${status}`);
      }
    } catch (error) {
      // Rollback
      setApplicants(previousApplicants);
      toast.error(error.response?.data?.message || "Status update failed");
    }
  };

  return (
    <main className="min-h-screen bg-black-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <button 
          onClick={() => navigate(ROUTES.RECRUITER_JOBS)}
          className="flex items-center gap-2 text-black-600 hover:text-orange-600 transition-colors mb-6 font-semibold"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className="relative overflow-hidden rounded-3xl bg-zinc-950 mb-10 p-10 text-white shadow-2xl border border-white/5">
          <div className="absolute inset-0 opacity-40">
            <img 
              src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200" 
              alt="AI Neural Network" 
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent"></div>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3 text-orange-500">
              <Sparkles size={20} />
              <span className="text-sm font-bold uppercase tracking-widest">AI Intelligence Enabled</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">Applicants for "{jobTitle}"</h1>
            <p className="mt-3 text-lg text-zinc-400 max-w-2xl">Reviewing {applicants.length} candidates with high-fidelity profile matching and automated recruitment workflows.</p>
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex justify-end mb-6">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 rounded-lg border border-black-100 focus:outline-none focus:border-orange-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {loading ? (
          <div className="p-20 text-center animate-pulse text-black-400">Loading applicants...</div>
        ) : filteredApplicants.length === 0 ? (
          <EmptyState 
            icon={Target}
            title={filterStatus === 'all' ? "No applicants yet" : `No ${filterStatus} applicants found`}
            description={
              filterStatus === 'all'
                ? "Once freelancers apply to this job, they will appear here."
                : "Try adjusting your filter or check back later."
            }
          />
        ) : (
          <div className="grid gap-6 mt-8">
            {filteredApplicants.map((app) => (
              <Card key={app._id} className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-xl uppercase shadow-lg border-2 border-white/10">
                        {app.applicant?.fullname?.[0] || 'U'}
                      </div>
                      <div className="absolute -top-2 -right-2 bg-zinc-900 text-orange-400 p-1 rounded-lg border border-orange-500/20 shadow-sm animate-pulse">
                        <Sparkles size={12} />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-black-900">{app.applicant?.fullname}</h3>
                      <p className="text-black-600 text-sm mb-2">{app.applicant?.profile?.bio || "No bio provided"}</p>
                      
                      {app.matchScore !== undefined && (
                        <p className="text-sm text-teal-600 font-semibold mb-3">
                          <Badge variant="teal">{app.matchScore}% Skill Match</Badge>
                        </p>
                      )}

                      <div className="flex flex-wrap gap-3 mb-3">
                        <Link to={`/profile/${app.applicant?._id}`} className="text-orange-600 hover:underline text-sm font-semibold">
                          View Profile
                        </Link>
                        {app.applicant?.profile?.resume && (
                          <a href={app.applicant.profile.resume} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm font-semibold flex items-center gap-1">
                            <Download size={14} /> Resume
                          </a>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-black-500">
                        <span className="flex items-center gap-1"><Mail size={14} /> {app.applicant?.email}</span>
                        <span className="flex items-center gap-1"><Phone size={14} /> {app.applicant?.phonenumber}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-4 min-w-[200px]">
                    <Badge variant={app.status === 'accepted' ? 'success' : app.status === 'rejected' ? 'secondary' : 'warning'}>
                      {app.status.toUpperCase()}
                    </Badge>
                    
                    <div className="flex gap-2">
                      {app.status === 'pending' ? (
                        <>
                          <ButtonSmall 
                            variant="outline" 
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleStatusUpdate('rejected', app._id)}
                          >
                            <X size={16} className="mr-1" /> Reject
                          </ButtonSmall>
                          <ButtonSmall 
                            variant="primary" 
                            onClick={() => handleStatusUpdate('accepted', app._id)}
                          >
                            <Check size={16} className="mr-1" /> Accept
                          </ButtonSmall>
                        </>
                      ) : (
                        <p className="text-xs text-black-400 italic">Decision made on {new Date(app.updatedAt).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default JobApplicants;
