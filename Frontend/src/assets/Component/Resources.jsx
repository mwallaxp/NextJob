import React from 'react';
import SEO from './shared/SEO';
import { Search, Eye, Award, CheckCircle } from 'lucide-react';

const Resources = () => {
  const guides = [
    {
      icon: <Search className="text-orange-500" />,
      title: "Finding the Perfect Job",
      content: "Use advanced filters to narrow down by salary, location, and job type. Don't just apply to everything; tailor your search to your specific tech stack."
    },
    {
      icon: <Eye className="text-teal-600" />,
      title: "Boost Your Visibility",
      content: "Ensure your profile is 100% complete. Profiles with high-quality profile photos and detailed bios are 3x more likely to be contacted by recruiters."
    },
    {
      icon: <Award className="text-gold-500" />,
      title: "Portfolio Matters",
      content: "Showcase your best projects. Recruiter's value visual proof of your skills over a list of bullet points."
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <SEO title="Career Resources" description="How to find the perfect job and increase your visibility on NextJob." />
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">Career Success Guide</h1>
          <p className="text-center text-gray-600">Master the platform and land your dream role.</p>
        </div>

        <div className="grid gap-8">
          {guides.map((guide, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-6">
              <div className="p-4 bg-gray-50 rounded-xl">{guide.icon}</div>
              <div>
                <h2 className="text-2xl font-bold mb-2">{guide.title}</h2>
                <p className="text-gray-600 leading-relaxed">{guide.content}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-orange-600 rounded-3xl p-10 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">Ready to be visible?</h2>
            <p className="mb-6 opacity-90 max-w-lg">Update your profile now and start appearing in recruiter searches today.</p>
            <button className="bg-white text-orange-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition">
              Update My Profile
            </button>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
            <CheckCircle size={300} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;