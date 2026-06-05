import { ArrowRight, Briefcase, Clock, DollarSign, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const LatestJobCards = ({ job }) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleClick = () => {
    if (user) {
      navigate(`/description/${job._id}`);
    } else {
      navigate("/login");
    }
  };

  if (!job) return null;

  const companyName = job.company?.name || "Independent Client";
  const location = job.location || job.company?.location || "Remote";
  
  return (
    <div 
      onClick={handleClick}
      key={job._id} 
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      role="button"
      tabIndex={0}
      className="group flex h-full flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl cursor-pointer"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">{companyName}</p>
          <div className="mt-1 flex items-center text-sm text-slate-500">
            <MapPin size={15} className="mr-1.5 shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
          Featured
        </span>
      </div>
      
      <div className="flex-1">
        <h3 className="text-lg font-bold leading-snug text-slate-950">{job.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{job.description}</p>
      </div>
      
      <div className="mt-5 flex flex-wrap gap-2">
        <div className="flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
          <Briefcase size={14} className="mr-1.5" />
          {job.position || "Open role"}
        </div>
        
        <div className="flex items-center rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
          <Clock size={14} className="mr-1.5" />
          {job.jobType || "Flexible"}
        </div>
        
        <div className="flex items-center rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
          <DollarSign size={14} className="mr-1.5" />
          {job.salary || "Negotiable"} 
        </div>
      </div>
      
      <div className="mt-5 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            handleClick();
          }}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          View opportunity
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
