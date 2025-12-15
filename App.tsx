import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import BeneficiaryList from './components/BeneficiaryList';
import { beneficiaryData } from './data/beneficiaries';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter logic: checks name, application number, or account number
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return beneficiaryData;
    
    const lowerQuery = searchQuery.toLowerCase().trim();
    
    return beneficiaryData.filter((item) => 
      item.name.toLowerCase().includes(lowerQuery) ||
      item.applicationNo.includes(lowerQuery) ||
      item.accountNo.includes(lowerQuery) ||
      item.id.toString().includes(lowerQuery)
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header totalCount={beneficiaryData.length} />
      
      <main className="flex-grow">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <BeneficiaryList data={filteredData} />
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Krushi Sahay Portal. Data provided for informational purposes.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;