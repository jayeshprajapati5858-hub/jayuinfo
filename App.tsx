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

// Robust Fallback images
const fallbackImages = [
    "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1589883661923-6476cf0ce7f1?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=800&q=80"
];

const NoticeTicker = ({ notices }: { notices: any[] }) => {
  const defaultNotices = [
    { title: 'પીએમ કિસાન યોજના (PM Kisan) 19મા હપ્તાની અપડેટ. e-KYC કરાવી લેવું.' },
    { title: 'ગ્રામ પંચાયતની વેરા વસૂલાત ઝુંબેશ ચાલુ છે.' }
  ];
  const displayData = notices && notices.length > 0 ? notices : defaultNotices;
  return (
    <div className="bg-emerald-900 overflow-hidden py-1.5 relative border-b border-emerald-800">
       <div className="whitespace-nowrap animate-marquee flex gap-12">
          {displayData.map((n, i) => (
             <span key={i} className="text-emerald-50 text-[11px] font-bold inline-flex items-center gap-2">
               <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-sm font-black animate-pulse">નવું</span>
               {n.title}
             </span>
          ))}
       </div>
    </div>
  );
};

// Search Page Component
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
    <div className="animate-fade-in space-y-4">
      <div className="flex items-center gap-2 px-1 mb-2">
        <button onClick={() => navigate('/')} className="p-2 -ml-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <h2 className="text-xl font-bold text-gray-800">યાદીમાં નામ શોધો</h2>
      </div>
      <div className="sticky top-[70px] z-30 bg-[#F9FAFB] pb-2">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 px-4 pb-4 min-h-[500px]">
        <BeneficiaryList data={filteredData} />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isSyncingNews, setIsSyncingNews] = useState(false);
  const [hasNewNotices, setHasNewNotices] = useState(false);
  const [tickerNotices, setTickerNotices] = useState<any[]>([]);
  const [homeNews, setHomeNews] = useState<any[]>([]);
  const [featuredNotice, setFeaturedNotice] = useState<any>(null);
  
  const location = useLocation();

  // Update Page Title for AdSense/SEO
  useEffect(() => {
    const path = location.pathname;
    let title = "Krushi Sahay & Digital Gram Panchayat Portal";
    if (path.includes('/service/news')) title = "News - " + title;
    else if (path.includes('/service/')) title = "Services - " + title;
    else if (path === '/search') title = "Search Beneficiary - " + title;
    else if (path === '/panchayat') title = "Panchayat Profile - " + title;
    
    document.title = title;
  }, [location]);

  // Initial Load from DB
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const newsRes = await pool.query('SELECT * FROM news ORDER BY id DESC LIMIT 5');
        setHomeNews(newsRes.rows);

        const noticeRes = await pool.query('SELECT * FROM notices ORDER BY id DESC LIMIT 5');
        setTickerNotices(noticeRes.rows);
        setHasNewNotices(noticeRes.rows.length > 0);
        if (noticeRes.rows.length > 0) {
           setFeaturedNotice(noticeRes.rows[0]);
        }
      } catch (e) {
        console.error("DB Load Error", e);
      }
    };
    loadInitialData();
  }, []);

  // Helper to prevent frequent API calls
  const shouldFetch = (key: string, minutes: number) => {
      const last = localStorage.getItem(key);
      if (!last) return true;
      const diff = Date.now() - parseInt(last);
      return diff > minutes * 60 * 1000;
  };

  const triggerBackgroundSync = useCallback(async () => {
      // 1. Check if sync is needed (every 4 hours to save API credits, but keep fresh)
      if (!shouldFetch('lastNewsSync', 240)) return; 
      if (isSyncingNews) return;
      
      setIsSyncingNews(true);
      const GNEWS_API_KEY = '017423a12b65fd9043317be57784cc28';

      try {
          // 2. Fetch Real-time News using GNews API
          // Targeting Gujarat Agriculture specifically for village audience
          const query = 'Gujarat Agriculture OR Khedut OR Gujarat Government Schemes';
          const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=gu&country=in&max=5&apikey=${GNEWS_API_KEY}`;
          
          let fetchedArticles = [];
          
          try {
             const res = await fetch(url);
             if (res.status === 403) {
               console.warn("GNews API Limit Reached");
               return; // Exit if quota exceeded
             }
             const data = await res.json();
             
             if (data.articles) {
                 fetchedArticles = data.articles;
             }
          } catch (apiErr) {
             console.warn("GNews API fetch failed, utilizing DB cache", apiErr);
          }

          // 3. Store in DB (Avoid Duplicates)
          for (const article of fetchedArticles) {
              const exists = await pool.query('SELECT id FROM news WHERE title = $1', [article.title]);
              
              if (exists.rows.length === 0) {
                 // Determine category based on content
                 let category = 'સમાચાર';
                 const text = (article.title + article.description).toLowerCase();
                 if (text.includes('kisan') || text.includes('agriculture') || text.includes('ખેડૂત')) category = 'ખેતીવાડી';
                 else if (text.includes('yojana') || text.includes('scheme') || text.includes('સહાય')) category = 'યોજના';
                 else if (text.includes('weather') || text.includes('rain') || text.includes('વરસાદ')) category = 'હવામાન';

                 await pool.query(
                    `INSERT INTO news (title, summary, content, category, date, image) VALUES ($1, $2, $3, $4, $5, $6)`,
                    [
                      article.title,
                      article.description || article.title,
                      article.content || article.description,
                      category,
                      new Date(article.publishedAt).toLocaleDateString('gu-IN'),
                      article.image || fallbackImages[Math.floor(Math.random() * fallbackImages.length)]
                    ]
                 );
              }
          }

          localStorage.setItem('lastNewsSync', Date.now().toString());
          
          // 4. Refresh State
          const newsRes = await pool.query('SELECT * FROM news ORDER BY id DESC LIMIT 5');
          setHomeNews(newsRes.rows);

      } catch (e) {
          console.error("Sync Error", e);
      } finally {
          setIsSyncingNews(false);
      }
  }, [isSyncingNews]);

  // Trigger sync on mount
  useEffect(() => {
    triggerBackgroundSync();
  }, [triggerBackgroundSync]);

  return (
    <>
      <Header />
      <div className="h-[60px]"></div>
      <NoticeTicker notices={tickerNotices} />
      <main className="max-w-2xl mx-auto px-4 py-6 pb-24">
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
      
      {/* Bottom Nav for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2 pb-5 z-50 md:hidden flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <Link to="/" className="flex flex-col items-center gap-1 text-emerald-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          <span className="text-[10px] font-bold">હોમ</span>
        </Link>
        <Link to="/service/news" className="flex flex-col items-center gap-1 text-gray-400 hover:text-emerald-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
          <span className="text-[10px] font-bold">સમાચાર</span>
        </Link>
        <Link to="/search" className="flex flex-col items-center gap-1 -mt-8">
           <div className="bg-emerald-600 p-4 rounded-full text-white shadow-lg shadow-emerald-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
           </div>
           <span className="text-[10px] font-bold text-emerald-700">શોધો</span>
        </Link>
        <Link to="/service/marketplace" className="flex flex-col items-center gap-1 text-gray-400 hover:text-emerald-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          <span className="text-[10px] font-bold">હાટ</span>
        </Link>
        <Link to="/panchayat" className="flex flex-col items-center gap-1 text-gray-400 hover:text-emerald-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
          <span className="text-[10px] font-bold">પંચાયત</span>
        </Link>
      </nav>
    </>
  );
};

export default App;
