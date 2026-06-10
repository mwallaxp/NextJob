import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, LinkedIn, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black-900 text-white mt-16">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">NJ</span>
              </div>
              <span className="text-2xl font-bold">NextJob</span>
            </div>
            <p className="text-white/70 mb-6">
              The platform for serious freelancers and quality work. Join thousands earning stable income on projects they love.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-white/70 hover:text-orange-500 transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white/70 hover:text-orange-500 transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-white/70 hover:text-orange-500 transition">
                <LinkedIn size={20} />
              </a>
              <a href="#" className="text-white/70 hover:text-orange-500 transition">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* For Freelancers */}
          <div>
            <h4 className="text-lg font-bold mb-4">For Freelancers</h4>
            <ul className="space-y-3">
              <li><Link to="/browse" className="text-white/70 hover:text-orange-500 transition">Browse Jobs</Link></li>
              <li><Link to="/" className="text-white/70 hover:text-orange-500 transition">How It Works</Link></li>
              <li><Link to="/" className="text-white/70 hover:text-orange-500 transition">Pricing</Link></li>
              <li><Link to="/" className="text-white/70 hover:text-orange-500 transition">Safety Tips</Link></li>
              <li><Link to="/" className="text-white/70 hover:text-orange-500 transition">Success Stories</Link></li>
            </ul>
          </div>

          {/* For Clients */}
          <div>
            <h4 className="text-lg font-bold mb-4">For Clients</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-white/70 hover:text-orange-500 transition">Post a Job</Link></li>
              <li><Link to="/" className="text-white/70 hover:text-orange-500 transition">Find Talent</Link></li>
              <li><Link to="/" className="text-white/70 hover:text-orange-500 transition">Pricing</Link></li>
              <li><Link to="/" className="text-white/70 hover:text-orange-500 transition">Enterprise</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-4">Get In Touch</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-orange-500 mt-1 flex-shrink-0" />
                <span className="text-white/70">support@nextjob.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-orange-500 mt-1 flex-shrink-0" />
                <span className="text-white/70">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-orange-500 mt-1 flex-shrink-0" />
                <span className="text-white/70">San Francisco, CA</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <p className="text-white/70 text-sm">© 2024 NextJob. All rights reserved.</p>
            <div className="flex gap-6 justify-start md:justify-end text-sm">
              <Link to="/" className="text-white/70 hover:text-orange-500 transition">Privacy Policy</Link>
              <Link to="/" className="text-white/70 hover:text-orange-500 transition">Terms of Service</Link>
              <Link to="/" className="text-white/70 hover:text-orange-500 transition">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Floating CTA */}
      <div className="border-t border-white/10 bg-black-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold">Ready to land your next gig?</h3>
              <p className="text-white/70 mt-1">Join 20,000+ freelancers already earning on NextJob</p>
            </div>
            <button className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all whitespace-nowrap">
              Start Applying Now
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
