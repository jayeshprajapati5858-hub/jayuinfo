import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import BeneficiaryList from './components/BeneficiaryList';
import GoogleAd from './components/GoogleAd';
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
  
  // Ad Modal State
  const [showAdModal, setShowAdModal] = useState(false);
  const [hasAdBeenShown, setHasAdBeenShown] = useState(false);

  // Handle first-time interaction with the search bar
  const handleSearchInteraction = () => {
    if (!hasAdBeenShown) {
      setShowAdModal(true);
      setHasAdBeenShown(true);
      // Blur input to force user to interact with the modal first
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }
  };

  // Filter logic: checks name, application number, account number, village, or ID
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
    <div className="min-h-screen flex flex-col bg-slate-50 relative">
      <Header totalCount={beneficiaryData.length} />
      
      <main className="flex-grow">
        <SearchBar 
          value={searchQuery} 
          onChange={setSearchQuery} 
          onClick={handleSearchInteraction}
        />
        
        {/* Inline ad removed as per request to use modal instead */}

        <BeneficiaryList data={filteredData} />
      </main>

      {/* Footer Section */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          
          {/* Copyright Text */}
          <div className="text-center mb-8">
            <p className="text-gray-400 text-xs">
              &copy; {new Date().getFullYear()} Krushi Sahay Portal. Data provided for informational purposes only.
            </p>
          </div>

          {/* Branding Badge - Prajapati Mobile (Responsive) */}
          <div className="flex justify-center w-full">
            <div className="flex flex-col sm:flex-row items-center w-full max-w-xs sm:max-w-none sm:w-auto bg-gradient-to-br from-emerald-50 to-slate-50 border border-emerald-100 rounded-2xl px-6 py-4 shadow-sm hover:shadow-md transition-shadow duration-300">
              
              {/* Brand Name */}
              <div className="flex flex-col items-center sm:items-start sm:mr-6">
                <span className="text-[10px] uppercase tracking-widest text-emerald-600 font-semibold mb-1">
                  Created By
                </span>
                <span className="text-gray-900 font-bold text-lg tracking-tight leading-none text-center sm:text-left">
                  Prajapati Mobile
                </span>
              </div>

              {/* Dividers: Horizontal for Mobile, Vertical for Desktop */}
              <div className="w-16 h-px bg-emerald-200 my-4 sm:hidden"></div>
              <div className="hidden sm:block w-px h-10 bg-gray-300 mr-6"></div>

              {/* Contact Link */}
              <a href="tel:+917990980744" className="flex items-center group w-full sm:w-auto justify-center sm:justify-start">
                <div className="bg-emerald-100 text-emerald-600 p-2.5 rounded-full mr-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[10px] text-gray-500 font-medium">Contact</span>
                  <span className="text-emerald-700 font-bold font-mono text-base">
                    +91 79909 80744
                  </span>
                </div>
              </a>

            </div>
          </div>
        </div>
      </footer>

      {/* Ad Modal Overlay */}
      {showAdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative transform transition-all animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Sponsored</span>
              <button 
                onClick={() => setShowAdModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4">
              <GoogleAd />
            </div>

            {/* Modal Footer / Action */}
            <div className="p-4 pt-0">
              <button 
                onClick={() => setShowAdModal(false)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-xl transition-colors shadow-sm text-sm"
              >
                Continue to Search
              </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default App;