import React from 'react';

interface HeaderProps {
  totalCount: number;
}

const Header: React.FC<HeaderProps> = ({ totalCount }) => {
  // Mock Weather Data for Header
  const date = new Date().toLocaleDateString('gu-IN', { day: 'numeric', month: 'short' });

  return (
    <header className="bg-emerald-700 pt-3 pb-3 shadow-md relative z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Brand Section */}
          <div className="flex items-center gap-3">
             {/* Building Icon / Logo */}
            <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="text-left">
              <h1 className="text-lg sm:text-2xl font-bold text-white tracking-wide leading-tight">
                ભરાડા ગ્રામ પંચાયત
              </h1>
              <p className="text-emerald-100 text-[10px] font-medium uppercase tracking-widest opacity-80">
                ડિજિટલ પોર્ટલ
              </p>
            </div>
          </div>

          {/* Compact Weather Widget (Replaces Total Beneficiaries) */}
          <div className="bg-emerald-800/60 rounded-lg px-3 py-1.5 border border-emerald-600/50 backdrop-blur-sm flex items-center gap-3 shadow-sm hover:bg-emerald-800/80 transition-colors cursor-pointer" title="આજનું હવામાન">
             <div className="text-yellow-300 bg-white/5 p-1 rounded-full">
                <svg className="w-6 h-6 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
             </div>
             <div className="text-right">
                <div className="flex items-center justify-end gap-1 text-white">
                   <span className="font-bold text-lg leading-none">32°C</span>
                </div>
                <p className="text-[10px] text-emerald-100 font-medium whitespace-nowrap">{date} • સની</p>
             </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;