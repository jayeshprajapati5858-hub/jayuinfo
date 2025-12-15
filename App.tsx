import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import BeneficiaryList from './components/BeneficiaryList';
import { beneficiaryData } from './data/beneficiaries';

// Helper to create a phonetic skeleton for fuzzy search (English & Gujarati)
const normalizeToSkeleton = (text: string) => {
  let normalized = text.toLowerCase();
  
  // 1. Map Gujarati consonants to English counterparts (Simplified)
  // We ignore vowels/matras in Gujarati to match the 'remove vowels' strategy in English
  const gujMap: { [key: string]: string } = {
    'ક': 'k', 'ખ': 'k', 'ગ': 'g', 'ઘ': 'g',
    'ચ': 'c', 'છ': 'c', 'જ': 'j', 'ઝ': 'j',
    'ટ': 't', 'ઠ': 't', 'ડ': 'd', 'ઢ': 'd',
    'ણ': 'n', 'ત': 't', 'થ': 't', 'દ': 'd', 'ધ': 'd', 'ન': 'n',
    'પ': 'p', 'ફ': 'p', 'બ': 'b', 'ભ': 'b', // p for f/ph
    'મ': 'm', 'ય': 'y', 'ર': 'r', 'લ': 'l', 'વ': 'v',
    'શ': 's', 'ષ': 's', 'સ': 's', 'હ': 'h',
    'ળ': 'l', 'ક્ષ': 'x', 'જ્ઞ': 'gn'
  };
  
  // Replace Gujarati characters with mapped English consonants
  // This effectively strips Gujarati vowels/matras as they aren't in the map
  normalized = normalized.replace(/[^\u0000-\u007F]/g, (char) => gujMap[char] || '');

  // 2. English phonetic simplifications
  normalized = normalized
    .replace(/h/g, '')        // Remove 'h' (kh->k, bh->b, th->t)
    .replace(/z/g, 'j')       // z -> j (Zala/Jhala normalization)
    .replace(/w/g, 'v')       // w -> v
    .replace(/f/g, 'p')       // f -> p (Ph/F normalization)
    .replace(/[aeiou]/g, '')  // Remove vowels
    .replace(/[^a-z0-9]/g, ''); // Keep only alphanumeric
    
  return normalized;
};

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter logic: checks name, application number, account number, village, or ID
  // Supports multi-term search (e.g., "Patel 925") and phonetic matching
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return beneficiaryData;
    
    // Split query by whitespace to allow searching multiple terms
    const searchTerms = searchQuery.toLowerCase().trim().split(/\s+/);
    
    return beneficiaryData.filter((item) => {
      // Create a single string containing all searchable data for the beneficiary
      const itemData = `
        ${item.id} 
        ${item.applicationNo} 
        ${item.name} 
        ${item.accountNo} 
        ${item.village}
      `.toLowerCase();

      // Create a phonetic skeleton of the data for fuzzy matching
      // e.g., "Patel" -> "ptl", "પટેલ" -> "ptl"
      const itemSkeleton = normalizeToSkeleton(itemData);

      // Check if EVERY search term is present in the beneficiary's data
      return searchTerms.every(term => {
        const termSkeleton = normalizeToSkeleton(term);
        // Match against raw data (for numbers/exact string) OR phonetic skeleton (for names)
        return itemData.includes(term) || itemSkeleton.includes(termSkeleton);
      });
    });
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