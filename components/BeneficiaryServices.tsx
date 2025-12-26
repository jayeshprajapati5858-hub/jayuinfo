
import React, { useState, useMemo } from 'react';
import { beneficiaryData } from '../data/beneficiaries';
import SearchBar from './SearchBar';
import { BeneficiaryList } from './BeneficiaryList';

const BeneficiaryServices: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!searchTerm) return beneficiaryData;
    const lowerTerm = searchTerm.toLowerCase().trim();
    return beneficiaryData.filter(item => 
      item.name.toLowerCase().includes(lowerTerm) ||
      item.applicationNo.includes(lowerTerm) ||
      item.accountNo.includes(lowerTerm)
    );
  }, [searchTerm]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-8 animate-fade-in pb-20">
      
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-700 rounded-3xl p-6 text-white shadow-xl shadow-green-200 mb-8 relative overflow-hidden">
         <div className="absolute right-0 top-0 w-40 h-40 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
         <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2">કૃષિ સહાય લાભાર્થી યાદી</h2>
            <p className="text-emerald-100 font-medium text-sm md:text-base">
               તમારું નામ, અરજી નંબર અથવા ખાતા નંબર લખીને સર્ચ કરો.
            </p>
         </div>
         <div className="mt-4 flex gap-2">
            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold border border-white/10">
               કુલ લાભાર્થી: {beneficiaryData.length}
            </span>
            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold border border-white/10">
               વર્ષ: 2024-25
            </span>
         </div>
      </div>
      
      {/* Search Section */}
      <div className="mb-8 sticky top-20 z-30">
        <div className="bg-white p-2 rounded-2xl shadow-lg border border-gray-100">
           <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>
      </div>

      {/* Results Section */}
      <div className="bg-white rounded-3xl p-1 shadow-sm border border-gray-100 min-h-[400px]">
         <BeneficiaryList data={filteredData} />
      </div>

    </div>
  );
};

export default BeneficiaryServices;
