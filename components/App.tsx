
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import SearchBar from './SearchBar';
import { BeneficiaryList } from './BeneficiaryList';
import PanchayatInfo from './PanchayatInfo';
import HomeView from './HomeView';
import ServiceView from './ServiceView';
import { PrivacyPolicy, TermsConditions, AboutUs, ContactUs } from './LegalPages';
import { beneficiaryData } from '../data/beneficiaries';
import { Beneficiary } from '../types';
import { pool } from '../utils/db';

const normalizeToSkeleton = (text: string) => {
  let normalized = text.toLowerCase();
  const gujMap: { [key: string]: string } = {
    'ક': 'k', 'ખ': 'k', 'ગ': 'g', 'ઘ': 'g', 'ચ': 'c', 'છ': 'c', 'જ': 'j', 'ઝ': 'j',
    'ટ': 't', 'ઠ': 't', 'ડ': 'd', 'ઢ': 'd', 'ણ': 'n', 'ત': 't', 'થ': 't', 'દ': 'd',
    'ધ': 'd', 'ન': 'n', 'પ': 'p', 'ફ': 'p', 'બ': 'b', 'મ': 'm', 'ય': 'y',
    'ર': 'r', 'લ': 'l', 'વ': 'v', 'શ': 's', 'ષ': 's', 'સ': 's', 'હ': 'h', 'ળ': 'l',
    'ક્ષ': 'x', 'જ્ઞ': 'gn'
  };
  normalized = normalized.replace(/[^\u0000-\u007F]/g, (char) => gujMap[char] || '');
  normalized = normalized
    .replace(/h/g, '').replace(/z/g, 'j').replace(/w/g, 'v').replace(/f/g, 'p')
    .replace(/[aeiou]/g, '').replace(/[^a-z0-9]/g, '');
  return normalized;
};

const NoticeTicker = ({ notices }: { notices: any[] }) => {
  const defaultNotices = [{ title: 'ખેતી સહાય પેકેજ ૨૦૨૪ ની યાદી જોવા માટે સર્ચ કરો.' }];
  const displayData = notices && notices.length > 0 ? notices : defaultNotices;
  return (
    <div className="bg-emerald-900 overflow-hidden py-2 relative border-b border-emerald-800 shadow-lg">
       <div className="whitespace-nowrap animate-marquee flex gap-12">
          {displayData.map((n, i) => (
             <span key={i} className="text-emerald-50 text-[11px] font-black inline-flex items-center gap-3">
               <span className="bg-red-500 text-white text-[9px] px-2.5 py-0.5 rounded-full font-black animate-pulse shadow-lg shadow-red-500/20 uppercase tracking-tighter ring-2 ring-red-400/20">નવું</span>
               {n.title}
             </span>
          ))}
       </div>
    </div>
  );
};

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

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
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center gap-3 px-1 mb-2">
        <button onClick={() => navigate('/')} className="p-3 -ml-2 rounded-2xl text-gray-500 bg-white shadow-sm border border-gray-100 hover:bg-gray-100 transition-all active:scale-90">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-none">યાદીમાં નામ શોધો</h2>
      </div>
      <div className="sticky top-[70px] z-30 bg-gray-50/80 backdrop-blur-md pb-4 pt-1">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 px-6 py-6 min-h-[500px]">
        <BeneficiaryList data={filteredData} />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [tickerNotices, setTickerNotices] = useState<any[]>([]);
  const [featuredNotice, setFeaturedNotice] = useState<any>(null);
  
  const location = useLocation();

  const loadInitialData = useCallback(async () => {
    // DB errors are handled inside pool.query, returning empty arrays on failure.
    const noticeRes = await pool.query('SELECT * FROM notices ORDER BY id DESC LIMIT 5');
    if (noticeRes && noticeRes.rows) {
       setTickerNotices(noticeRes.rows);
       if (noticeRes.rows.length > 0) {
          setFeaturedNotice(noticeRes.rows[0]);
       }
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  return (
    <>
      <Header />
      <div className="h-[60px]"></div>
      <NoticeTicker notices={tickerNotices} />
      <main className="max-w-2xl mx-auto px-4 py-8 pb-32">
        <Routes>
          <Route path="/" element={<HomeView featuredNotice={featuredNotice} />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/panchayat" element={<PanchayatInfo />} />
          <Route path="/service/:type" element={<ServiceView />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsConditions />} />
        </Routes>
      </main>
      
      {/* Bottom Nav for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 px-6 py-4 pb-10 z-50 md:hidden flex justify-between items-center shadow-[0_-10px_30px_rgb(0,0,0,0.06)]">
        <Link to="/" className={`flex flex-col items-center gap-1.5 ${location.pathname === '/' ? 'text-emerald-600' : 'text-gray-400'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          <span className="text-[10px] font-black uppercase tracking-tighter">હોમ</span>
        </Link>
        <Link to="/service/notice" className={`flex flex-col items-center gap-1.5 ${location.pathname === '/service/notice' ? 'text-emerald-600' : 'text-gray-400'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>
          <span className="text-[10px] font-black uppercase tracking-tighter">નોટિસ</span>
        </Link>
        <Link to="/search" className="flex flex-col items-center gap-1.5 -mt-12">
           <div className="bg-emerald-600 p-5 rounded-3xl text-white shadow-2xl shadow-emerald-200 active:scale-90 transition-all ring-8 ring-white">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
           </div>
           <span className="text-[10px] font-black text-emerald-700 uppercase tracking-tighter">શોધો</span>
        </Link>
        <Link to="/service/marketplace" className={`flex flex-col items-center gap-1.5 ${location.pathname === '/service/marketplace' ? 'text-emerald-600' : 'text-gray-400'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          <span className="text-[10px] font-black uppercase tracking-tighter">હાટ</span>
        </Link>
        <Link to="/panchayat" className={`flex flex-col items-center gap-1.5 ${location.pathname === '/panchayat' ? 'text-emerald-600' : 'text-gray-400'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
          <span className="text-[10px] font-black uppercase tracking-tighter">પ્રોફાઇલ</span>
        </Link>
      </nav>
    </>
  );
};

export default App;
