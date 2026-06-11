import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import { toast } from 'react-toastify';
import ApplicantsTable from './ApplicantsTable';
import SEO from '../shared/SEO';
import { ArrowLeft, Users } from 'lucide-react';

const Applicants = () => {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchApplicants = async () => {
    try {
      const res = await api.get(`/api/v1/application/${jobId}/applicant`);
      if (res.data.success) {
        setJob(res.data.job);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load candidates");
      navigate('/admin/jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const handleStatusUpdate = async (applicationId, status) => {
    try {
      // Using the route pattern from context: /status/update:id
      const res = await api.post(`/api/v1/application/status/update${applicationId}`, { status });
      if (res.data.success) {
        toast.success(`Application updated to ${status}`);
        fetchApplicants(); // Refresh list to reflect status changes
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-500 font-medium">Analyzing candidate profiles...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SEO title={`Applicants: ${job?.title}`} />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2.5 bg-white border border-slate-200 rounded-xl hover:border-orange-200 hover:bg-orange-50 transition-all text-slate-600 hover:text-orange-600 shadow-sm">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{job?.title}</h1>
            <p className="text-sm text-slate-500 flex items-center gap-1.5"><Users size={14}/> {job?.applications?.length || 0} candidates applied</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <ApplicantsTable 
          applications={job?.applications} 
          onStatusUpdate={handleStatusUpdate} 
        />
      </div>
    </div>
  );
};

export default Applicants;