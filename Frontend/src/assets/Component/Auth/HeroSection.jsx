import { useState } from "react";
import { Search, Globe, Briefcase, TrendingUp, Zap, CheckCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchedQuery } from "../../../redux/jobSlice";

const CategoryPill = ({ icon, label }) => (
  <div className="flex items-center bg-white shadow-sm rounded-full px-4 py-2 text-sm font-medium hover:shadow-md transition-all cursor-pointer border border-gray-100">
    {icon}
    <span className="ml-2">{label}</span>
  </div>
);

function HeroSection() {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const searchHandler = () => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      searchHandler();
    }
  };

  return (
    <section className="overflow-hidden bg-slate-50">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-16">
        <div className="text-left">
            <div className="mb-6 inline-flex items-center rounded-full border border-blue-100 bg-white px-3 py-1 text-sm font-semibold text-blue-700 shadow-sm">
              <Zap size={16} className="mr-1" />
              <span>Curated freelance and remote roles</span>
            </div>
            
            <h1 className="max-w-3xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Find serious freelance work without the noise
            </h1>
            
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              NextJob helps freelancers discover quality projects, compare opportunities quickly, and apply with a profile clients can trust.
            </p>
            
            <div className="mt-8 relative w-full max-w-xl">
              <div className="flex overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2">
                <input
                  type="text"
                  placeholder="Search by skill, role, or location"
                  className="w-full px-5 py-4 text-slate-700 outline-none"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
                <button 
                  onClick={searchHandler}
                  className="flex items-center bg-blue-600 px-5 py-4 font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  <Search size={20} />
                  <span className="ml-2 hidden sm:inline">Search</span>
                </button>
              </div>
            </div>
            
            <div className="mt-8">
              <p className="mb-3 text-sm font-semibold text-slate-500">Popular searches</p>
              <div className="flex flex-wrap gap-3">
                <CategoryPill icon={<Globe size={16} />} label="Remote" />
                <CategoryPill icon={<Briefcase size={16} />} label="Contract" />
                <CategoryPill icon={<TrendingUp size={16} />} label="Tech" />
              </div>
            </div>
        </div>
          
        <div className="relative">
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1546514714-df0ccc50d7bf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZnJlZWxhbmNlfGVufDB8fDB8fHww" 
                alt="Freelancer working" 
                className="h-[360px] w-full object-cover sm:h-[440px]"
              />
              <div className="grid grid-cols-3 divide-x divide-slate-200 bg-white">
                {[
                  ["Fast match", "Verified briefs"],
                  ["Remote-first", "Global clients"],
                  ["Profile-led", "Better trust"],
                ].map(([title, text]) => (
                  <div key={title} className="p-4">
                    <CheckCircle size={18} className="mb-2 text-emerald-600" />
                    <p className="text-sm font-bold text-slate-950">{title}</p>
                    <p className="mt-1 text-xs text-slate-500">{text}</p>
                  </div>
                ))}
              </div>
            </div>
        </div>
      </div>
    </section>
  );
}
export default HeroSection;
