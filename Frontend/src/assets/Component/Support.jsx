import React, { useState } from 'react';
import SEO from './shared/SEO';
import { Mail, MessageCircle, HelpCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const Support = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Thank you! Our support team will contact you shortly.");
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-white py-16">
      <SEO title="Support" description="Contact NextJob support for help with your account or jobs." />
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <h1 className="text-4xl font-bold mb-6 text-gray-900">How can we <span className="text-orange-600">help?</span></h1>
            <p className="text-gray-600 mb-10 text-lg">Have a question or facing an issue? Reach out to us and we'll get back to you within 24 hours.</p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-50 text-orange-600 rounded-full"><Mail size={24}/></div>
                <div>
                  <p className="font-bold">Email Us</p>
                  <p className="text-gray-500">support@nextjob.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-teal-50 text-teal-600 rounded-full"><MessageCircle size={24}/></div>
                <div>
                  <p className="font-bold">Live Chat</p>
                  <p className="text-gray-500">Available Mon-Fri, 9am - 6pm</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
            <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                type="text" placeholder="Your Name" required
                value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
              <input 
                type="email" placeholder="Email Address" required
                value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
              <textarea 
                placeholder="Describe your issue..." rows="5" required
                value={form.message} onChange={(e) => setForm({...form, message: e.target.value})}
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              ></textarea>
              <button type="submit" className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-orange-700 transition">Submit Request</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;