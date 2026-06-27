import React from "react";

export const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-200 py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid gap-8 md:grid-cols-3">
        <div>
          <div className="text-2xl font-bold text-white">NEXTJOB</div>
          <p className="mt-4 text-sm text-slate-400 max-w-sm">
            Connect with global employers, manage applications, and land your next remote or local role.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Explore</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            <li>Browse jobs</li>
            <li>Company directory</li>
            <li>Employee resources</li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Contact</h3>
          <p className="mt-4 text-sm text-slate-300">support@nextjob.example</p>
          <p className="text-sm text-slate-300">+234 800 123 4567</p>
        </div>
      </div>
      <div className="mt-8 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} NEXTJOB. All rights reserved.
      </div>
    </footer>
  );
};
