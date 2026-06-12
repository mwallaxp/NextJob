import { useCallback, useEffect, useState } from 'react';
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
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [interviewStage, setInterviewStage] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, currentPage: 1, totalPages: 1 });

  const fetchApplicants = useCallback(async () => {
    try {
      const res = await api.get(`/api/v1/application/${jobId}/applicant`, {
        params: { search, status, interviewStage, page, limit: 10 },
      });
      if (res.data.success) {
        setJob(res.data.job);
        setMeta({
          total: res.data.total || 0,
          currentPage: res.data.currentPage || 1,
          totalPages: res.data.totalPages || 1,
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load candidates");
      navigate('/recruiter/jobs');
    } finally {
      setLoading(false);
    }
  }, [interviewStage, jobId, navigate, page, search, status]);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  const handleStatusUpdate = async (applicationId, status) => {
    try {
      const res = await api.post(`/api/v1/application/status/${applicationId}/update`, { status });
      if (res.data.success) {
        toast.success(`Application updated to ${status}`);
        fetchApplicants(); // Refresh list to reflect status changes
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
    }
  };

  const handleReviewUpdate = async (applicationId, payload) => {
    try {
      const res = await api.patch(`/api/v1/application/${applicationId}/review`, payload);
      if (res.data.success) {
        toast.success("Application review updated");
        fetchApplicants();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Review update failed");
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

      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_180px_180px]">
        <input
          type="text"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Search candidate name, email, phone"
          className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/10"
        />
        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/10"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
        <select
          value={interviewStage}
          onChange={(event) => {
            setInterviewStage(event.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/10"
        >
          <option value="">All stages</option>
          <option value="applied">Applied</option>
          <option value="screening">Screening</option>
          <option value="interview">Interview</option>
          <option value="offer">Offer</option>
          <option value="hired">Hired</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <ApplicantsTable 
          applications={job?.applications} 
          onStatusUpdate={handleStatusUpdate} 
          onReviewUpdate={handleReviewUpdate}
        />
      </div>

      <div className="flex items-center justify-between gap-3 text-sm text-slate-500">
        <span>{meta.total} applicants found</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((current) => Math.max(current - 1, 1))}
            className="rounded-full border border-slate-200 px-4 py-2 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          <span>Page {meta.currentPage} of {meta.totalPages || 1}</span>
          <button
            type="button"
            disabled={page >= meta.totalPages}
            onClick={() => setPage((current) => current + 1)}
            className="rounded-full border border-slate-200 px-4 py-2 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Applicants;
