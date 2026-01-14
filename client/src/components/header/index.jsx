import React from 'react';

const Header = () => {
  return (
    <div className="text-center mb-20 px-6 pt-10">
      <div className="relative inline-block mb-6">
        <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 rounded-full animate-pulse"></div>
        <div className="relative inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-premium border border-indigo-50/50 backdrop-blur-sm">
          <svg
            className="w-9 h-9 text-indigo-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
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
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100/50">
        <div className="flex -space-x-1">
          <div className="w-4 h-4 rounded-full bg-indigo-500 border border-white"></div>
          <div className="w-4 h-4 rounded-full bg-purple-500 border border-white"></div>
        </div>
        <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Predictive Sync</span>
      </div>
    </div>
  );
};

export default Header;