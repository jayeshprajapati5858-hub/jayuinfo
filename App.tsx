import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import BeneficiaryList from './components/BeneficiaryList';
import GoogleAd from './components/GoogleAd';
import PanchayatInfo from './components/PanchayatInfo';
import ImportantLinks from './components/ImportantLinks';
import WaterSupply from './components/WaterSupply';
import EmergencyContacts from './components/EmergencyContacts';
import PhotoGallery from './components/PhotoGallery';
import BusSchedule from './components/BusSchedule';
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
  const [currentView, setCurrentView] = useState<'home' | 'links' | 'water' | 'bus'>('home');

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

  const navItems = [
    { id: 'home', label: 'મુખ્ય પૃષ્ઠ', icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { id: 'water', label: 'પાણી પુરવઠો', icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" },
    { id: 'bus', label: 'બસ ટાઈમ', icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" },
    { id: 'links', label: 'અન્ય', icon: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative">
      <Header totalCount={beneficiaryData.length} />
      
      {/* Navigation Tabs */}
      <div className="bg-emerald-700 shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto no-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as any)}
              className={`flex-1 sm:flex-none sm:min-w-[100px] py-3 text-center font-medium text-xs sm:text-base transition-all duration-200 border-b-4 shrink-0 px-3 ${
                currentView === item.id
                  ? 'border-white text-white'
                  : 'border-transparent text-emerald-100 hover:text-white hover:bg-emerald-600'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                <span>{item.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <main className="flex-grow">
        {currentView === 'home' && (
          <div className="animate-fade-in">
            {/* Home View */}
            <PanchayatInfo />
            
            <div className="mt-8">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
              <BeneficiaryList data={filteredData} />
            </div>
            {/* Ad Placement for Home View (Bottom) */}
            <div className="max-w-4xl mx-auto px-4 mb-8 overflow-x-auto">
              <div className="text-center text-xs text-gray-400 mb-2 uppercase tracking-widest">જાહેરાત</div>
              <GoogleAd />
            </div>
          </div>
        )}

        {currentView === 'water' && <WaterSupply />}
        {currentView === 'bus' && <BusSchedule />}

        {currentView === 'links' && (
          <div className="animate-fade-in">
            {/* Links View - Now includes Emergency & Gallery */}
            <ImportantLinks />
            <EmergencyContacts />
            <PhotoGallery />
            
            <div className="max-w-4xl mx-auto px-4 mt-8">
              <div className="text-center text-xs text-gray-400 mb-2 uppercase tracking-widest">જાહેરાત</div>
              <GoogleAd />
            </div>
          </div>
        )}
      </main>

      {/* Footer Section */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          
          {/* Copyright Text */}
          <div className="text-center mb-8">
            <p className="text-gray-400 text-xs">
              &copy; {new Date().getFullYear()} કૃષિ સહાય પોર્ટલ. માહિતી માત્ર જાણકારી માટે છે.
            </p>
          </div>

          {/* Branding Badge - Prajapati Mobile (Responsive) */}
          <div className="flex justify-center w-full">
            <div className="flex flex-col sm:flex-row items-center w-full max-w-xs sm:max-w-none sm:w-auto bg-gradient-to-br from-emerald-50 to-slate-50 border border-emerald-100 rounded-2xl px-6 py-4 shadow-sm hover:shadow-md transition-shadow duration-300">
              
              {/* Brand Name */}
              <div className="flex flex-col items-center sm:items-start sm:mr-6">
                <span className="text-[10px] uppercase tracking-widest text-emerald-600 font-semibold mb-1">
                  નિર્માતા
                </span>
                <span className="text-gray-900 font-bold text-lg tracking-tight leading-none text-center sm:text-left">
                  પ્રજાપતિ મોબાઈલ
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
                  <span className="text-[10px] text-gray-500 font-medium">સંપર્ક</span>
                  <span className="text-emerald-700 font-bold font-mono text-base">
                    +91 79909 80744
                  </span>
                </div>
              </a>

            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;