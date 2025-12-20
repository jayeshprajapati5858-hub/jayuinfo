import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-gray-200 z-50 transition-all duration-300">
      <div className="max-w-2xl mx-auto px-4 py-3 flex justify-between items-center">
        
        <div className="flex items-center gap-3">
           <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 p-2 rounded-xl shadow-lg shadow-emerald-200">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
             </svg>
           </div>
           <div>
             <h1 className="text-base font-bold text-gray-900 leading-tight">
               ભરાડા ગ્રામ પંચાયત
             </h1>
             <p className="text-[10px] text-gray-500 font-medium">Digital Portal App</p>
           </div>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 shadow-sm">
           <span className="relative flex h-2 w-2">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
             <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
           </span>
           <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">Live</span>
        </div>

      </div>
    </header>
  );
};

export default Header;