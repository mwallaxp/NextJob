import React from 'react';
import SEO from './shared/SEO';

const AboutUs = () => {
  return (
    <div className="bg-white min-h-screen">
      <SEO 
        title="About Us" 
        description="Learn more about NextJob, our mission, and how we empower freelancers and recruiters."
      />
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            Our Mission at <span className="text-orange-600">NextJob</span>
          </h1>
          <p className="text-xl text-gray-600">Connecting talent with opportunity through a secure and innovative marketplace.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold mb-4 border-l-4 border-orange-500 pl-4">Who We Are</h2>
            <p className="text-gray-700 leading-relaxed">
              NextJob was founded to bridge the gap between world-class talent and forward-thinking companies. 
              We believe that the future of work is flexible, global, and meritocratic.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4 border-l-4 border-teal-600 pl-4">Our Commitment</h2>
            <p className="text-gray-700 leading-relaxed">
              We prioritize security, transparency, and user experience. Whether you are a student looking for your first internship 
              or a senior recruiter, our platform is designed to help you succeed.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-10 rounded-3xl text-center shadow-inner">
          <h2 className="text-3xl font-bold mb-6">Built for the Modern Professional</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-orange-600 font-bold text-3xl">10k+</div>
              <div className="text-sm text-gray-500 uppercase">Users</div>
            </div>
            <div>
              <div className="text-orange-600 font-bold text-3xl">5k+</div>
              <div className="text-sm text-gray-500 uppercase">Jobs Posted</div>
            </div>
            <div>
              <div className="text-orange-600 font-bold text-3xl">99%</div>
              <div className="text-sm text-gray-500 uppercase">Satisfaction</div>
            </div>
            <div>
              <div className="text-orange-600 font-bold text-3xl">24/7</div>
              <div className="text-sm text-gray-500 uppercase">Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;