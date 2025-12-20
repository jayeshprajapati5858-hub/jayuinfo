import React from 'react';

interface HeaderProps {
  totalCount: number;
}

const Header: React.FC<HeaderProps> = ({ totalCount }) => {
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

          {/* Right Side: Total Beneficiaries Count */}
          <div className="text-right">
             <div className="bg-emerald-800/50 rounded-lg px-4 py-2 border border-emerald-600/30 backdrop-blur-sm">
                <p className="text-emerald-200 text-[10px] font-bold uppercase tracking-wider mb-0.5">કુલ લાભાર્થી</p>
                <p className="text-white font-bold text-2xl leading-none tracking-tight">{totalCount}</p>
             </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;