import React from 'react';

const Header = () => {
  return (
    <div className="text-center mb-8 px-4">
      <div className="inline-flex items-center justify-center p-3 mb-4 bg-indigo-50 rounded-2xl">
        <svg
          className="w-8 h-8 text-indigo-600"
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
      <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">
        Midway Place Finder
      </h1>
      <p className="text-slate-500 text-base font-medium leading-relaxed max-w-[280px] mx-auto">
         The perfect meeting spot between two locations
      </p>
    </div>
  );
};

export default Header;