import React from 'react';

interface HeaderProps {
  totalCount: number;
}

const Header: React.FC<HeaderProps> = ({ totalCount }) => {
  return (
    <header className="bg-emerald-700 shadow-lg pb-12 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          
          {/* Brand Section */}
          <div className="flex items-center gap-3">
             {/* Simple Icon */}
            <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold text-white tracking-wide">
                કૃષિ રાહત પેકેજ
              </h1>
              <p className="text-emerald-100 text-xs font-medium uppercase tracking-widest opacity-90">
                DBT Beneficiary Portal
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-emerald-800/50 rounded-lg px-4 py-2 border border-emerald-600 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
              </span>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase text-emerald-200 font-semibold tracking-wider">Total Beneficiaries</span>
                <span className="text-white font-mono font-bold text-xl leading-none">
                  {totalCount}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;