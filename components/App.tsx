import React, { useState, useMemo } from 'react';
import Header from './Header';
import SearchBar from './SearchBar';
import { BeneficiaryList } from './BeneficiaryList';
import { beneficiaryData } from '../data/beneficiaries';
import { Beneficiary } from '../types';

// --- Phonetic Search Logic ---
const normalizeToSkeleton = (text: string) => {
  let normalized = text.toLowerCase();
  const gujMap: { [key: string]: string } = {
    'ક': 'k', 'ખ': 'k', 'ગ': 'g', 'ઘ': 'g', 'ચ': 'c', 'છ': 'c', 'જ': 'j', 'ઝ': 'j',
    'ટ': 't', 'ઠ': 't', 'ડ': 'd', 'ઢ': 'd', 'ણ': 'n', 'ત': 't', 'થ': 't', 'દ': 'd',
    'ધ': 'd', 'ન': 'n', 'પ': 'p', 'ફ': 'p', 'બ': 'b', 'ભ': 'b', 'મ': 'm', 'ય': 'y',
    'ર': 'r', 'લ': 'l', 'વ': 'v', 'શ': 's', 'ષ': 's', 'સ': 's', 'હ': 'h', 'ળ': 'l',
    'ક્ષ': 'x', 'જ્ઞ': 'gn'
  };
  normalized = normalized.replace(/[^\u0000-\u007F]/g, (char) => gujMap[char] || '');
  normalized = normalized
    .replace(/h/g, '').replace(/z/g, 'j').replace(/w/g, 'v').replace(/f/g, 'p')
    .replace(/[aeiou]/g, '').replace(/[^a-z0-9]/g, '');
  return normalized;
};

const NoticeTicker = () => {
  return (
    <div className="bg-orange-600 overflow-hidden py-2 relative">
       <div className="whitespace-nowrap animate-marquee flex gap-12">
          <span className="text-white text-sm font-bold inline-flex items-center gap-2">
            <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded">LIVE</span>
            કૃષિ સહાય પેકેજની યાદી જાહેર.
          </span>
       </div>
    </div>
  );
};

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return beneficiaryData;
    const searchTerms = searchQuery.toLowerCase().trim().split(/\s+/);
    return beneficiaryData.filter((item: Beneficiary) => {
      const itemData = `${item.id} ${item.applicationNo} ${item.name} ${item.accountNo} ${item.village}`.toLowerCase();
      const itemSkeleton = normalizeToSkeleton(itemData);
      return searchTerms.every(term => {
        const termSkeleton = normalizeToSkeleton(term);
        return itemData.includes(term) || itemSkeleton.includes(termSkeleton);
      });
    });
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />
      <div className="h-[60px]"></div>
      <NoticeTicker />
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
        <BeneficiaryList data={filteredData} />
      </main>
    </div>
  );
};

export default App;