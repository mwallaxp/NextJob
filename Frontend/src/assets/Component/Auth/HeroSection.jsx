import { useState } from "react";
import { Search, Globe, Briefcase, TrendingUp, Zap } from "lucide-react";

const CategoryPill = ({ icon, label }) => (
  <div className="flex items-center bg-white shadow-sm rounded-full px-4 py-2 text-sm font-medium hover:shadow-md transition-all cursor-pointer border border-gray-100">
    {icon}
    <span className="ml-2">{label}</span>
  </div>
);

function HeroSection() {
  const [query, setQuery] = useState("");
  
  // These functions would be replaced with your actual Redux dispatch and navigation
  const searchHandler = () => {
    console.log("Searching for:", query);
    // In your actual implementation you would use:
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      searchHandler();
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Hero Content */}
        <div className="flex flex-col lg:flex-row items-center">
          {/* Left Content */}
          <div className="w-full lg:w-1/2 text-left mb-12 lg:mb-0">
            <div className="inline-flex items-center bg-blue-100 rounded-full px-3 py-1 text-sm font-medium text-blue-800 mb-6">
              <Zap size={16} className="mr-1" />
              <span>Over 10,000+ jobs available</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
              Find Your Next <span className="text-indigo-600">Freelance</span> Opportunity
            </h1>
            
            <p className="mt-6 text-lg text-gray-600 max-w-xl">
              Connect with top clients worldwide, showcase your talents, and build your 
              career on your own terms. The future of work is flexible.
            </p>
            
            {/* Search Bar */}
            <div className="mt-8 relative w-full max-w-xl">
              <div className="flex overflow-hidden rounded-full border border-gray-300 bg-white shadow-lg focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2">
                <input
                  type="text"
                  placeholder="What skill are you looking for?"
                  className="w-full py-4 px-6 outline-none text-gray-700"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button 
                  onClick={searchHandler}
                  className="bg-indigo-600 px-6 py-4 text-white font-medium hover:bg-indigo-700 transition-colors flex items-center"
                >
                  <Search size={20} />
                  <span className="ml-2 hidden sm:inline">Search</span>
                </button>
              </div>
            </div>
            
            {/* Popular Categories */}
            <div className="mt-8">
              <p className="text-sm text-gray-500 mb-3">Popular Categories:</p>
              <div className="flex flex-wrap gap-3">
                <CategoryPill icon={<Globe size={16} />} label="Remote" />
                <CategoryPill icon={<Briefcase size={16} />} label="Full-time" />
                <CategoryPill icon={<TrendingUp size={16} />} label="Tech" />
              </div>
            </div>
          </div>
          
          {/* Right Content - Illustration/Stats */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Stats Cards */}
              <div className="absolute -top-4 -left-4 bg-white rounded-lg shadow-lg p-4 w-44">
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-full p-2">
                    <TrendingUp size={16} className="text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs text-gray-500">Active Projects</p>
                    <p className="font-bold text-lg">25.4k+</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-4 w-44">
                <div className="flex items-center">
                  <div className="bg-indigo-100 rounded-full p-2">
                    <Globe size={16} className="text-indigo-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs text-gray-500">Remote Jobs</p>
                    <p className="font-bold text-lg">8.7k+</p>
                  </div>
                </div>
              </div>
              
              {/* Main image */}
              <img 
                src="https://images.unsplash.com/photo-1546514714-df0ccc50d7bf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZnJlZWxhbmNlfGVufDB8fDB8fHww" 
                alt="Freelancer working" 
                className="rounded-2xl shadow-xl w-full"
              />
            </div>
          </div>
        </div>
        
        {/* Client logos */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <p className="text-sm text-center text-gray-500 mb-6">Trusted by leading companies worldwide</p>
          <div className="flex flex-wrap justify-center gap-8 items-center opacity-60">
            {['Company 1', 'Company 2', 'Company 3', 'Company 4', 'Company 5'].map((company, index) => (
              <div key={index} className="h-8">
                <div className="bg-gray-400 h-full w-24 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default HeroSection;