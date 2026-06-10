import { useState } from "react";
import { Search, Globe, Briefcase, TrendingUp, CheckCircle, Zap, Star, Users, ArrowRight } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchedQuery } from "../../../redux/jobSlice";
import { ButtonPrimary, ButtonSecondary, Badge, FeatureGrid } from "../../../components/DesignSystem";

const CategoryPill = ({ icon, label }) => (
  <div className="flex items-center bg-white shadow-soft hover:shadow-medium rounded-full px-4 py-2 text-sm font-medium hover:bg-orange-50 transition-all cursor-pointer border border-black-100">
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

  const features = [
    {
      icon: <CheckCircle size={24} className="text-orange-500" />,
      title: "Quality Projects",
      description: "Hand-picked projects matched to your expertise and experience level"
    },
    {
      icon: <TrendingUp size={24} className="text-orange-500" />,
      title: "Grow Your Income",
      description: "Earn competitively with transparent pricing and secure payments"
    },
    {
      icon: <Users size={24} className="text-orange-500" />,
      title: "Trusted Network",
      description: "Connect with verified clients who value quality work"
    },
    {
      icon: <Zap size={24} className="text-orange-500" />,
      title: "Quick Applications",
      description: "Apply with one profile instead of repeating your story"
    },
    {
      icon: <Globe size={24} className="text-orange-500" />,
      title: "Work Remotely",
      description: "Freedom to work from anywhere with flexible schedules"
    },
    {
      icon: <Star size={24} className="text-orange-500" />,
      title: "Build Your Reputation",
      description: "Earn reviews and ratings that open new opportunities"
    },
  ];

  return (
    <div className="bg-gradient-to-b from-orange-50 to-white">
      {/* Hero Section */}
      <section className="overflow-hidden pt-12 pb-12">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="text-left animate-slideUp">
            <Badge variant="primary" className="mb-6">
              <Zap size={16} className="mr-2" />
              The freelance platform for serious work
            </Badge>
            
            <h1 className="max-w-3xl text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-black-900 mb-4">
              Land the Right Projects. Build Your Career.
            </h1>
            
            <p className="mt-6 max-w-2xl text-lg leading-8 text-black-600 mb-8">
              Join thousands of freelancers earning stable income on projects they love. 
              NextJob connects you with quality projects from trusted companies worldwide.
            </p>
            
            {/* Search Bar */}
            <div className="mt-8 relative w-full max-w-2xl mb-8">
              <div className="flex overflow-hidden rounded-2xl border-2 border-black-100 bg-white shadow-medium focus-within:ring-2 focus-within:ring-orange-500 focus-within:ring-offset-2">
                <input
                  type="text"
                  placeholder="Search by skill, role, or technology..."
                  className="w-full px-6 py-4 text-black-900 outline-none placeholder-black-400"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
                <button 
                  onClick={searchHandler}
                  className="flex items-center bg-orange-500 hover:bg-orange-600 px-6 py-4 font-semibold text-white transition-all"
                >
                  <Search size={20} />
                  <span className="ml-2 hidden sm:inline">Search</span>
                </button>
              </div>
            </div>
            
            {/* Popular Searches */}
            <div>
              <p className="mb-3 text-sm font-semibold text-black-600">Popular searches</p>
              <div className="flex flex-wrap gap-3">
                <CategoryPill icon={<Globe size={16} />} label="Remote Work" />
                <CategoryPill icon={<Briefcase size={16} />} label="Full-time Projects" />
                <CategoryPill icon={<TrendingUp size={16} />} label="Tech Skills" />
              </div>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative animate-fadeIn">
            <div className="overflow-hidden rounded-3xl border-2 border-black-100 bg-white shadow-lg-custom">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0" 
                alt="Freelancer collaborating" 
                className="h-[360px] w-full object-cover sm:h-[440px]"
              />
              <div className="grid grid-cols-3 divide-x divide-black-100 bg-white p-4">
                {[
                  { number: "50K+", label: "Active Projects" },
                  { number: "20K+", label: "Happy Freelancers" },
                  { number: "500M+", label: "Total Earnings" },
                ].map(({ number, label }) => (
                  <div key={label} className="text-center">
                    <p className="text-xl font-bold text-orange-600">{number}</p>
                    <p className="text-xs text-black-600 mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 border-t border-black-100">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-black-900 mb-4">Why Choose NextJob?</h2>
            <p className="text-lg text-black-600 max-w-2xl mx-auto">
              We're building the most transparent and fair freelance platform for quality work
            </p>
          </div>
          <FeatureGrid features={features} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-black-900">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Start?</h2>
          <p className="text-lg text-white/80 mb-8">
            Join our community of top-rated freelancers and start earning today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate("/signup")}
              className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              Sign Up Now <ArrowRight size={20} />
            </button>
            <button 
              onClick={() => navigate("/browse")}
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black-900 transition-all"
            >
              Browse Projects
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HeroSection;
