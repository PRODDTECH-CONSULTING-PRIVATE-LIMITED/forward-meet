import React from 'react';

const Header = () => {
  return (
    <div className="text-center">
      <div className="relative inline-block mb-8">
        <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full"></div>
        <div className="relative inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-premium border border-indigo-50/50 backdrop-blur-md">
          <svg
            className="w-11 h-11 text-indigo-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
      </div>
      <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-4 font-outfit">
        Forward Meet
      </h1>
      <p className="text-slate-500 text-base font-semibold leading-relaxed max-w-[300px] mx-auto mb-8">
        Discover the perfect venue exactly in the middle.
      </p>
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50/50 rounded-full border border-indigo-100/50 backdrop-blur-sm">
        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
        <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">Predictive Sync Active</span>
      </div>
    </div>
  );
};

export default Header;