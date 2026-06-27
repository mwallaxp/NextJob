import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const stageLabels = {
  applied: "Applied",
  screening: "Viewed",
  interview: "Interview",
  offer: "Offer",
  hired: "Hired",
  rejected: "Rejected",
};

const statusStyles = {
  applied: "bg-blue-50 text-blue-700",
  screening: "bg-indigo-50 text-indigo-700",
  interview: "bg-amber-50 text-amber-700",
  offer: "bg-emerald-50 text-emerald-700",
  hired: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-700",
};

export const ApplicationJobTable = () => {
  const { allAppliedJobs } = useSelector((store) => store.job);

  if (!allAppliedJobs?.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
        <p className="font-semibold text-slate-950">No applications yet</p>
        <p className="mt-2 text-sm text-slate-500">Apply to jobs and track every stage here.</p>
        <Link to="/browse" className="mt-5 inline-flex rounded-lg bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
          Browse jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 bg-white text-sm">
        <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Job</th>
            <th className="px-4 py-3">Company</th>
            <th className="px-4 py-3">Pipeline</th>
            <th className="px-4 py-3 text-right">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {allAppliedJobs.map((application) => {
            const stage = application.interviewStage || (application.status === "rejected" ? "rejected" : "applied");
            const job = application.job || {};

            return (
              <tr key={application._id} className="hover:bg-slate-50">
                <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                  {application.createdAt ? new Date(application.createdAt).toLocaleDateString() : "N/A"}
                </td>
                <td className="px-4 py-4">
                  <Link to={`/description/${job._id}`} className="font-semibold text-slate-950 hover:text-blue-600">
                    {job.title || "Job unavailable"}
                  </Link>
                </td>
                <td className="px-4 py-4 text-slate-600">{job.company?.name || "Company"}</td>
                <td className="px-4 py-4">
                  <div className="flex min-w-[220px] items-center gap-1">
                    {["applied", "screening", "interview", "hired"].map((step) => {
                      const steps = ["applied", "screening", "interview", "hired"];
                      const active = steps.indexOf(stage) >= steps.indexOf(step) && stage !== "rejected";
                      return <span key={step} className={`h-2 flex-1 rounded-full ${active ? "bg-blue-600" : "bg-slate-200"}`} />;
                    })}
                  </div>
                </td>
                <td className="px-4 py-4 text-right">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${statusStyles[stage] || statusStyles.applied}`}>
                    {stageLabels[stage] || application.status || "Applied"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationJobTable;
