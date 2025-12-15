import React from 'react';

interface HeaderProps {
  totalCount: number;
}

const Header: React.FC<HeaderProps> = ({ totalCount }) => {
  return (
    <header className="bg-emerald-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              કૃષિ રાહત પેકેજ (DBT)
            </h1>
            <p className="mt-2 text-emerald-100 text-sm md:text-base">
              Agricultural Relief Package Beneficiary Portal
            </p>
          </div>
          <div className="mt-4 md:mt-0 bg-emerald-800 bg-opacity-50 px-4 py-2 rounded-lg backdrop-blur-sm border border-emerald-600">
            <span className="text-emerald-200 text-sm uppercase tracking-wider font-semibold">Total Beneficiaries</span>
            <div className="text-3xl font-bold text-white text-center">{totalCount}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;