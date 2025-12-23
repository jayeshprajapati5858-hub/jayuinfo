
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import { BeneficiaryList } from './components/BeneficiaryList';
import PanchayatInfo from './components/PanchayatInfo';
import ImportantLinks from './components/ImportantLinks';
import EmergencyContacts from './components/EmergencyContacts';
import PhotoGallery from './components/PhotoGallery';
import HomeView from './components/HomeView';
import ServiceView from './components/ServiceView';
import { PrivacyPolicy, TermsConditions, AboutUs, ContactUs } from './components/LegalPages';
import { beneficiaryData } from './data/beneficiaries';
import { Beneficiary } from './types';
import { pool } from './utils/db';
import { GoogleGenAI, Type } from "@google/genai";

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

// More Page Component
const MorePage = () => {
  const navigate = useNavigate();
  return (
    <div className="animate-fade-in space-y-8">
       <div className="flex items-center gap-2 mb-1">
         <button onClick={() => navigate('/')} className="p-2 -ml-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors">
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
         </button>
         <h2 className="text-xl font-bold text-gray-800">અન્ય માહિતી</h2>
       </div>
       <EmergencyContacts />
       <ImportantLinks />
       <PhotoGallery />
    </div>
  );
};

const App: React.FC = () => {
  const [isSyncingNews, setIsSyncingNews] = useState(false);
  const [hasNewNotices, setHasNewNotices] = useState(false);
  const [hasNewJobs, setHasNewJobs] = useState(false);
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

  // Helper to prevent frequent DB calls, but allow force override
  const shouldFetch = (key: string, minutes: number) => {
      const last = localStorage.getItem(key);
      if (!last) return true;
      const diff = Date.now() - parseInt(last);
      return diff > minutes * 60 * 1000;
  };

  const triggerBackgroundSync = useCallback(async () => {
      const todayStr = new Date().toLocaleDateString('gu-IN');
      
      // Check for global sync lock (1 hour cooldown after quota error)
      const lastQuotaError = localStorage.getItem('lastQuotaError');
      if (lastQuotaError && Date.now() - parseInt(lastQuotaError) < 60 * 60 * 1000) {
          return;
      }

      // Check if we already have news for TODAY in the state/cache
      const hasTodayNews = homeNews.some(n => n.date === todayStr);
      
      if (isSyncingNews) return;
      if (hasTodayNews && !shouldFetch('lastNewsSync', 360)) return;
      
      try {
          // Check DB first
          let res;
          try {
             res = await pool.query('SELECT id, image FROM news WHERE date = $1', [todayStr]);
          } catch (e) {
             throw e;
          }
          
          const needsGeneration = res.rows.length === 0;
          const needsImages = res.rows.some((row: any) => !row.image);

          if (needsGeneration || needsImages) {
              setIsSyncingNews(true);
              const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
              
              let newsData = [];

              if (needsGeneration) {
                  // 1. Generate News Content if missing using GOOGLE SEARCH for real-time data
                  const prompt = `
                  Perform a Google Search to get the absolute latest news for: ${new Date().toLocaleDateString('en-GB')}.
                  Topics: PM Kisan 19th installment, Gujarat Agriculture Market Rates, Latest Gujarat Govt Circulars.
                  
                  Generate 4 news articles in GUJARATI.
                  Return strictly JSON array: [{ "title": "...", "summary": "...", "content": "...", "category": "..." }]`;
                  
                  const aiRes = await ai.models.generateContent({
                      model: "gemini-3-flash-preview",
                      contents: prompt,
                      config: { 
                        tools: [{ googleSearch: {} }], // Use Search Grounding
                        responseMimeType: "application/json",
                        responseSchema: {
                          type: Type.ARRAY,
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              title: { type: Type.STRING },
                              summary: { type: Type.STRING },
                              content: { type: Type.STRING },
                              category: { type: Type.STRING }
                            },
                            required: ["title", "summary", "content", "category"]
                          }
                        }
                      }
                  });
                  newsData = JSON.parse(aiRes.text || "[]");
              } else {
                  const existingRes = await pool.query('SELECT id, title FROM news WHERE date = $1 AND (image IS NULL OR image = \'\')', [todayStr]);
                  newsData = existingRes.rows;
              }
              
              let index = 0;
              for (const item of newsData) {
                  if (!item.title) continue;

                  let imageUrl = null;
                  try {
                    // Check image quota cooldown
                    const lastImgError = localStorage.getItem('lastImgError');
                    if (!lastImgError || Date.now() - parseInt(lastImgError) > 30 * 60 * 1000) {
                        const imgRes = await ai.models.generateContent({
                            model: 'gemini-2.5-flash-image',
                            contents: { 
                                parts: [{ 
                                    text: `News photo for: ${item.title}. Rural Gujarat context. 16:9 ratio.` 
                                }] 
                            },
                            config: { imageConfig: { aspectRatio: "16:9" } }
                        });
                        
                        const parts = imgRes.candidates?.[0]?.content?.parts || [];
                        for (const p of parts) {
                            if (p.inlineData) { 
                              imageUrl = `data:image/png;base64,${p.inlineData.data}`; 
                              break; 
                            }
                        }
                    }
                  } catch(e: any) { 
                      console.warn("Img Gen Fail", e); 
                      if (e?.message?.includes('429') || e?.message?.includes('quota')) {
                          localStorage.setItem('lastImgError', Date.now().toString());
                      }
                  }

                  // Use fallback if generation failed
                  if (!imageUrl) {
                      imageUrl = fallbackImages[index % fallbackImages.length];
                  }

                  if (imageUrl) {
                      if (needsGeneration) {
                          const exists = await pool.query('SELECT id FROM news WHERE title = $1', [item.title]);
                          if (exists.rows.length === 0) {
                            await pool.query(
                                `INSERT INTO news (title, summary, content, category, date, image) VALUES ($1, $2, $3, $4, $5, $6)`,
                                [item.title, item.summary || '', item.content, item.category || 'સમાચાર', todayStr, imageUrl]
                            );
                          }
                      } else if (item.id) {
                          await pool.query('UPDATE news SET image = $1 WHERE id = $2', [imageUrl, item.id]);
                      }
                  }
                  index++;
              }
              localStorage.setItem('lastNewsSync', Date.now().toString());
              
              const newsRes = await pool.query('SELECT * FROM news ORDER BY id DESC LIMIT 3');
              setHomeNews(newsRes.rows);
          }
      } catch (err: any) {
          if (err?.message?.includes('quota') || err?.message?.includes('limit')) {
             console.warn("BG Sync: DB Quota Exceeded");
             localStorage.setItem('lastQuotaError', Date.now().toString());
          } else {
             console.error("BG Sync Failed:", err?.message || err);
          }
      } finally {
          setIsSyncingNews(false);
      }
  }, [isSyncingNews, homeNews]);

  const checkUpdates = useCallback(async () => {
      // Check quota cooldown
      const lastQuotaError = localStorage.getItem('lastQuotaError');
      const todayStr = new Date().toLocaleDateString('gu-IN');
      
      if (lastQuotaError && Date.now() - parseInt(lastQuotaError) < 60 * 60 * 1000) {
          console.log("Using static data due to recent quota error");
          setTickerNotices([{ title: 'સિસ્ટમ અપડેટ: સર્વર મેન્ટેનન્સ ચાલુ છે.' }]);
          setHomeNews([
            { id: 101, title: "પીએમ કિસાન ૧૯મો હપ્તો: ખેડૂતો માટે મહત્વના સમાચાર", category: "ખેતીવાડી", image: fallbackImages[0], date: todayStr },
            { id: 102, title: "જીરું અને વરિયાળીના ભાવમાં આજનો ઉછાળો", category: "બજાર ભાવ", image: fallbackImages[1], date: todayStr },
            { id: 103, title: "સુકન્યા સમૃદ્ધિ યોજનામાં વ્યાજદરમાં વધારો", category: "યોજના", image: fallbackImages[2], date: todayStr }
          ]);
          return;
      }

      const oneDayMs = 24 * 60 * 60 * 1000;
      const now = Date.now();
      
      try {
          // Initialize schema
          await pool.query(`CREATE TABLE IF NOT EXISTS notices (id SERIAL PRIMARY KEY, type TEXT, title TEXT, description TEXT, date_str TEXT, contact_person TEXT, mobile TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
          await pool.query(`CREATE TABLE IF NOT EXISTS news (id SERIAL PRIMARY KEY, title TEXT, summary TEXT, content TEXT, category TEXT, date TEXT, image TEXT)`);
          await pool.query(`CREATE TABLE IF NOT EXISTS jobs (id SERIAL PRIMARY KEY, category TEXT, title TEXT, details TEXT, wages TEXT, contact_name TEXT, mobile TEXT, date_str TEXT)`);

          const noticeRes = await pool.query('SELECT * FROM notices ORDER BY id DESC LIMIT 5');
          const notices = noticeRes.rows;
          const activeNotices = notices.filter((n: any) => (now - new Date(n.created_at || Date.now()).getTime()) < oneDayMs);
          setHasNewNotices(activeNotices.length > 0);
          setTickerNotices(notices.length > 0 ? notices : []);
          setFeaturedNotice(notices[0] || null);

          const newsRes = await pool.query('SELECT * FROM news ORDER BY id DESC LIMIT 3');
          setHomeNews(newsRes.rows);
          
          const jobRes = await pool.query('SELECT * FROM jobs ORDER BY id DESC LIMIT 1');
          const recentJob = jobRes.rows.some((j: any) => (now - new Date(j.created_at || Date.now()).getTime()) < oneDayMs);
          setHasNewJobs(recentJob);

          triggerBackgroundSync();
      } catch (err: any) {
          if (err?.message?.includes('quota') || err?.message?.includes('limit')) {
             console.warn("App: DB Quota Exceeded.");
             localStorage.setItem('lastQuotaError', Date.now().toString());
             setTickerNotices([{ title: 'સિસ્ટમ અપડેટ: સર્વર મેન્ટેનન્સ ચાલુ છે.' }]);
             // Dynamic Date Fallback even in error
             setHomeNews([
                { id: 101, title: "પીએમ કિસાન ૧૯મો હપ્તો: ખેડૂતો માટે મહત્વના સમાચાર", category: "ખેતીવાડી", image: fallbackImages[0], date: todayStr },
                { id: 102, title: "જીરું અને વરિયાળીના ભાવમાં આજનો ઉછાળો", category: "બજાર ભાવ", image: fallbackImages[1], date: todayStr },
                { id: 103, title: "સુકન્યા સમૃદ્ધિ યોજનામાં વ્યાજદરમાં વધારો", category: "યોજના", image: fallbackImages[2], date: todayStr }
             ]);
          } else {
             console.error("Fetch error:", err);
             setTickerNotices([{ title: 'સિસ્ટમ અપડેટ: ડેટા લોડ થઈ શક્યો નથી.' }]);
          }
      }
  }, [triggerBackgroundSync]);

  useEffect(() => {
    checkUpdates();
  }, [checkUpdates]);

  const navItems = [
    { id: 'home', path: '/', label: 'હોમ', icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { id: 'search', path: '/search', label: 'શોધો', icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
    { id: 'services', path: '/service/news', label: 'સેવાઓ', icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" },
    { id: 'panchayat', path: '/panchayat', label: 'પંચાયત', icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
    { id: 'more', path: '/more', label: 'અન્ય', icon: "M4 6h16M4 12h16M4 12h16M4 12h16M4 18h16" },
  ];

  const currentPath = location.pathname;
  const isServicesActive = currentPath.startsWith('/service/');

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] font-sans text-gray-900 relative">
      <Header />
      <div className="h-[60px]"></div>
      <NoticeTicker notices={tickerNotices} />
      
      <main className="flex-grow w-full max-w-2xl mx-auto px-4 py-6 pb-28">
        <Routes>
          <Route path="/" element={<HomeView homeNews={homeNews} featuredNotice={featuredNotice} hasNewNotices={hasNewNotices} fallbackImages={fallbackImages} />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/service/:type" element={<ServiceView />} />
          <Route path="/panchayat" element={<PanchayatInfo />} />
          <Route path="/more" element={<MorePage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsConditions />} />
        </Routes>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 z-50 shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
        <div className="max-w-2xl mx-auto flex justify-around items-center pt-2 pb-safe">
          {navItems.map((item) => {
            const isActive = item.id === 'services' ? isServicesActive : currentPath === item.path;
            
            return (
              <Link key={item.id} to={item.path} className="flex-1 py-3 relative flex flex-col items-center group">
                {item.id === 'services' && (hasNewNotices || hasNewJobs) && <span className="absolute top-2 right-[30%] w-2 h-2 bg-red-500 rounded-full border-2 border-white shadow-sm"></span>}
                <div className={`transition-all duration-300 rounded-2xl p-2 ${isActive ? 'text-emerald-600 bg-emerald-50 scale-110' : 'text-gray-400 group-active:scale-90'}`}>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 2.5 : 2} d={item.icon} /></svg>
                </div>
                <span className={`text-[10px] font-black mt-1 transition-colors ${isActive ? 'text-emerald-700' : 'text-gray-400'}`}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default App;
