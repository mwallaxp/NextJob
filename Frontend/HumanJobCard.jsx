import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

const HumanJobCard = ({ job }) => {
  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-brand-500/5 transition-all group"
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center overflow-hidden border border-brand-50">
            {job?.logo ? <img src={job.logo} alt="logo" /> : <Briefcase className="text-brand-500" />}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 group-hover:text-brand-600 transition-colors">{job?.title}</h2>
            <p className="text-sm text-slate-500 font-medium">{job?.company?.name || "Company Name"}</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider">
          {job?.jobType}
        </span>
      </div>

      <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-600">
        <div className="flex items-center gap-1.5"><MapPin size={16} className="text-slate-400" /> {job?.location}</div>
        <div className="flex items-center gap-1.5"><DollarSign size={16} className="text-slate-400" /> {job?.salary} LPA</div>
      </div>

      <button className="w-full mt-6 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-900 transition-colors shadow-lg shadow-brand-500/20 active:scale-95">
        Details & Apply
      </button>
    </motion.div>
  );
};

export default HumanJobCard;