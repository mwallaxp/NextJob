import { ArrowUpRight } from "lucide-react";

const StatTile = ({ icon, label, value, tone = "dark" }) => (
  <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${tone === "dark" ? "bg-zinc-950 text-white" : "bg-zinc-100 text-zinc-950"}`}>
        {icon}
      </div>
      <ArrowUpRight size={18} className="text-zinc-400" />
    </div>
    <p className="mt-6 text-3xl font-semibold tracking-tight text-zinc-950">{value}</p>
    <p className="mt-1 text-sm font-medium text-zinc-500">{label}</p>
  </div>
);

export default StatTile;
