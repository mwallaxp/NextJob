import { useState } from 'react';
import { Badge, ButtonSmall } from '../../../components/DesignSystem';
import { ArrowUpDown, ExternalLink, MessageSquarePlus } from 'lucide-react';

const ApplicantsTable = ({ applications = [], onStatusUpdate, onReviewUpdate }) => {
  // Default sort by Match Score (descending) to show best matches first
  const [sortConfig, setSortConfig] = useState({ key: 'matchScore', direction: 'desc' });
  const [reviewDrafts, setReviewDrafts] = useState({});

  const sortedApplications = [...applications].sort((a, b) => {
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    // Helper for sorting by candidate name
    if (sortConfig.key === 'fullname') {
      aValue = a.applicant?.fullname?.toLowerCase() || '';
      bValue = b.applicant?.fullname?.toLowerCase() || '';
    }

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const updateDraft = (applicationId, key, value) => {
    setReviewDrafts((drafts) => ({
      ...drafts,
      [applicationId]: {
        ...(drafts[applicationId] || {}),
        [key]: value,
      },
    }));
  };

  const submitReview = (applicationId) => {
    const draft = reviewDrafts[applicationId] || {};
    onReviewUpdate(applicationId, draft);
    setReviewDrafts((drafts) => ({ ...drafts, [applicationId]: {} }));
  };

  const getScoreStyle = (score) => {
    if (score >= 80) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (score >= 50) return "bg-orange-50 text-orange-700 border-orange-200";
    return "bg-slate-50 text-slate-600 border-slate-200";
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-bold tracking-wider">
          <tr>
            <th className="px-6 py-4 cursor-pointer hover:text-orange-600 transition" onClick={() => toggleSort('fullname')}>
              <div className="flex items-center gap-1">Candidate <ArrowUpDown size={12} /></div>
            </th>
            <th className="px-6 py-4 cursor-pointer hover:text-orange-600 transition" onClick={() => toggleSort('matchScore')}>
              <div className="flex items-center gap-1">Match Score <ArrowUpDown size={12} /></div>
            </th>
            <th className="px-6 py-4">Applied Date</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Stage & notes</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {sortedApplications.length === 0 ? (
            <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-400 font-medium">No applicants found for this position.</td></tr>
          ) : (
            sortedApplications.map((app) => (
              <tr key={app._id} className="hover:bg-slate-50/50 transition">
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-900">{app.applicant?.fullname}</div>
                  <div className="text-xs text-slate-500">{app.applicant?.email}</div>
                </td>
                <td className="px-6 py-4">
                  <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getScoreStyle(app.matchScore)}`}>
                    {app.matchScore}% Match
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {new Date(app.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <Badge variant={app.status === 'accepted' ? 'success' : app.status === 'rejected' ? 'danger' : 'warning'}>
                    {app.status}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="grid min-w-[260px] gap-2">
                    <select
                      value={reviewDrafts[app._id]?.interviewStage ?? app.interviewStage ?? "applied"}
                      onChange={(event) => updateDraft(app._id, "interviewStage", event.target.value)}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold outline-none focus:border-slate-950"
                    >
                      <option value="applied">Applied</option>
                      <option value="screening">Screening</option>
                      <option value="interview">Interview</option>
                      <option value="offer">Offer</option>
                      <option value="hired">Hired</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <input
                      type="text"
                      value={reviewDrafts[app._id]?.recruiterComment ?? app.recruiterComment ?? ""}
                      onChange={(event) => updateDraft(app._id, "recruiterComment", event.target.value)}
                      placeholder="Recruiter comment"
                      className="rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-slate-950"
                    />
                    <input
                      type="text"
                      value={reviewDrafts[app._id]?.note ?? ""}
                      onChange={(event) => updateDraft(app._id, "note", event.target.value)}
                      placeholder="Add private note"
                      className="rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-slate-950"
                    />
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end items-center gap-2">
                    {app.status === 'pending' && (
                      <>
                        <ButtonSmall variant="primary" onClick={() => onStatusUpdate(app._id, 'accepted')}>
                          Shortlist
                        </ButtonSmall>
                        <ButtonSmall variant="outline" onClick={() => onStatusUpdate(app._id, 'rejected')}>
                          Reject
                        </ButtonSmall>
                      </>
                    )}
                    <button className="p-2 text-slate-400 hover:text-orange-600 transition" title="View Profile">
                      <ExternalLink size={16} />
                    </button>
                    <button
                      onClick={() => submitReview(app._id)}
                      className="p-2 text-slate-400 hover:text-slate-950 transition"
                      title="Save review"
                    >
                      <MessageSquarePlus size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicantsTable;
