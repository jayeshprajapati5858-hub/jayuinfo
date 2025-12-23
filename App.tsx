
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import { BeneficiaryList } from './components/BeneficiaryList';
import PanchayatInfo from './components/PanchayatInfo';
import HomeView from './components/HomeView';
import ServiceView from './components/ServiceView';
import { PrivacyPolicy, TermsConditions, AboutUs, ContactUs } from './components/LegalPages';
import { beneficiaryData } from './data/beneficiaries';
import { Beneficiary } from './types';
import { pool } from './utils/db';

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

const fallbackImages = [
    "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1589883661923-6476cf0ce7f1?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=800&q=80"
];

const seedNewsData = [
    {
      id: 101,
      title: "રેશન કાર્ડમાં નવું નામ કેવી રીતે ઉમેરવું? જાણો સંપૂર્ણ પ્રક્રિયા",
      category: "યોજના",
      summary: "તમારા પરિવારના નવા સભ્ય અથવા પત્નીનું નામ રેશન કાર્ડમાં ઉમેરવા માટે કયા કયા પુરાવા જોઈએ તેની યાદી.",
      content: "રેશન કાર્ડ એ માત્ર અનાજ મેળવવાનું સાધન નથી...",
      image: "https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?auto=format&fit=crop&q=80&w=1000",
      date: "20 May 2024"
    },
    {
      id: 102,
      title: "સુકન્યા સમૃદ્ધિ યોજના ૨૦૨૪: દીકરીના લગ્ન અને ભણતર માટે સૌથી વધુ વ્યાજ",
      category: "યોજના",
      summary: "દીકરીનું ભવિષ્ય સુરક્ષિત કરવા માટે કેન્દ્ર સરકારની આ યોજનામાં ૮.૨% વ્યાજ મળી રહ્યું છે.",
      content: "કેન્દ્ર સરકાર દ્વારા બેટી બચાવો બેટી પઢાવો અંતર્ગત...",
      image: "https://images.unsplash.com/photo-1623050040776-37b0c841c6f3?auto=format&fit=crop&q=80&w=1000",
      date: "21 May 2024"
    },
    {
      id: 103,
      title: "કપાસના ભાવમાં તેજી: APMC માં મણનો ભાવ ૧૭૦૦ ને પાર",
      category: "ખેતીવાડી",
      summary: "સૌરાષ્ટ્રના માર્કેટ યાર્ડમાં કપાસની આવક ઘટતા ભાવમાં ઉછાળો જોવા મળ્યો.",
      content: "ચાલુ વર્ષે કપાસનું ઉત્પાદન ઓછું હોવાને કારણે...",
      image: "https://images.unsplash.com/photo-1599581843324-7e77747e0996?auto=format&fit=crop&q=80&w=1000",
      date: "22 May 2024"
    }
];

const NoticeTicker = ({ notices }: { notices: any[] }) => {
  const defaultNotices = [
    { title: 'પીએમ કિસાન યોજના (PM Kisan) 19મા હપ્તાની અપડેટ. e-KYC કરાવી લેવું.' },
    { title: 'ગ્રામ પંચાયતની વેરા વસૂલાત ઝુંબેશ ચાલુ છે.' }
  ];
  const displayData = notices && notices.length > 0 ? notices : defaultNotices;
  return (
    <div className="bg-emerald-900 overflow-hidden py-2 relative border-b border-emerald-800 shadow-lg">
       <div className="whitespace-nowrap animate-marquee flex gap-12">
          {displayData.map((n, i) => (
             <span key={i} className="text-emerald-50 text-[11px] font-bold inline-flex items-center gap-2">
               <span className="bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-full font-black animate-pulse shadow-lg shadow-red-500/20 uppercase tracking-tighter">New</span>
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
        <button onClick={() => navigate('/')} className="p-2.5 -ml-2 rounded-2xl text-gray-500 bg-white shadow-sm border border-gray-100 hover:bg-gray-100 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">યાદીમાં નામ શોધો</h2>
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
  const [hasNewNotices, setHasNewNotices] = useState(false);
  const [tickerNotices, setTickerNotices] = useState<any[]>([]);
  const [homeNews, setHomeNews] = useState<any[]>(seedNewsData); // Default to seed data
  const [featuredNotice, setFeaturedNotice] = useState<any>(null);
  
  const location = useLocation();

  const loadInitialData = useCallback(async () => {
    try {
      // Step 1: Initialize News Table
      await pool.query(`
          CREATE TABLE IF NOT EXISTS news (
              id SERIAL PRIMARY KEY, title TEXT, category TEXT, summary TEXT, content TEXT, image TEXT, date TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
      `);
      
      // Step 2: Initialize Notices Table
      await pool.query(`
          CREATE TABLE IF NOT EXISTS notices (
              id SERIAL PRIMARY KEY, type TEXT, title TEXT, description TEXT, date_str TEXT, contact_person TEXT, mobile TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
      `);

      // Step 3: Fetch Data
      const newsRes = await pool.query('SELECT * FROM news ORDER BY id DESC LIMIT 5');
      
      if (newsRes.rows.length > 0) {
          setHomeNews(newsRes.rows);
      } else {
          // If DB exists but is empty, try to seed it once
          for (const article of seedNewsData) {
              await pool.query(
                  `INSERT INTO news (title, category, summary, content, image, date) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING`,
                  [article.title, article.category, article.summary, article.content, article.image, article.date]
              );
          }
      }

      const noticeRes = await pool.query('SELECT * FROM notices ORDER BY id DESC LIMIT 5');
      setTickerNotices(noticeRes.rows);
      setHasNewNotices(noticeRes.rows.length > 0);
      if (noticeRes.rows.length > 0) {
         setFeaturedNotice(noticeRes.rows[0]);
      }
    } catch (e) {
      console.warn("DB Load Quota Exceeded or Error - Using local fallback data.", e);
      // Data remains as seedNewsData (already initialized in useState)
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
      <main className="max-w-2xl mx-auto px-4 py-8 pb-24">
        <Routes>
          <Route path="/" element={<HomeView homeNews={homeNews} featuredNotice={featuredNotice} hasNewNotices={hasNewNotices} fallbackImages={fallbackImages} />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/panchayat" element={<PanchayatInfo />} />
          <Route path="/service/:type" element={<ServiceView />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsConditions />} />
        </Routes>
      </main>
      
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 px-6 py-3 pb-8 z-50 md:hidden flex justify-between items-center shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
        <Link to="/" className={`flex flex-col items-center gap-1.5 ${location.pathname === '/' ? 'text-emerald-600' : 'text-gray-400'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          <span className="text-[10px] font-black uppercase tracking-tighter">હોમ</span>
        </Link>
        <Link to="/service/news" className={`flex flex-col items-center gap-1.5 ${location.pathname === '/service/news' ? 'text-emerald-600' : 'text-gray-400'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
          <span className="text-[10px] font-black uppercase tracking-tighter">સમાચાર</span>
        </Link>
        <Link to="/search" className="flex flex-col items-center gap-1.5 -mt-10">
           <div className="bg-emerald-600 p-4 rounded-3xl text-white shadow-xl shadow-emerald-200 active:scale-90 transition-transform ring-4 ring-white">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
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
