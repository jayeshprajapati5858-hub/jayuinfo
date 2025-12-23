
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import { BeneficiaryList } from './components/BeneficiaryList';
import PanchayatInfo from './components/PanchayatInfo';
import ImportantLinks from './components/ImportantLinks';
import WaterSupply from './components/WaterSupply';
import EmergencyContacts from './components/EmergencyContacts';
import PhotoGallery from './components/PhotoGallery';
import WeatherWidget from './components/WeatherWidget';
import HealthCenter from './components/HealthCenter';
import SchoolInfo from './components/SchoolInfo';
import NoticeBoard from './components/NoticeBoard';
import SchemeInfo from './components/SchemeInfo';
import RojgarBoard from './components/RojgarBoard';
import BusinessDirectory from './components/BusinessDirectory';
import VillageProfile from './components/VillageProfile';
import AgriRental from './components/AgriRental';
import GeneralComplaints from './components/GeneralComplaints';
import StudentCorner from './components/StudentCorner';
import BloodDonors from './components/BloodDonors';
import NewsSection from './components/NewsSection';
import VillageMarket from './components/VillageMarket';
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
    { title: 'કૃષિ સહાય પેકેજની યાદી જાહેર. ખેડૂતોએ તાત્કાલિક બેંક DBT ચાલુ કરાવવું.' },
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

type ServiceType = 'water' | 'health' | 'school' | 'notice' | 'schemes' | 'rojgar' | 'business' | 'profile' | 'agri' | 'complaint' | 'student' | 'blood' | 'news' | 'marketplace';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<'home' | 'search' | 'services' | 'panchayat' | 'more' | 'privacy' | 'terms' | 'about' | 'contact'>('home');
  const [activeService, setActiveService] = useState<ServiceType | null>(null);
  const [isSyncingNews, setIsSyncingNews] = useState(false);
  const [hasNewNotices, setHasNewNotices] = useState(false);
  const [hasNewJobs, setHasNewJobs] = useState(false);
  const [tickerNotices, setTickerNotices] = useState<any[]>([]);
  const [homeNews, setHomeNews] = useState<any[]>([]);
  const [featuredNotice, setFeaturedNotice] = useState<any>(null);

  // Helper to prevent frequent DB calls
  const shouldFetch = (key: string, minutes: number) => {
      const last = localStorage.getItem(key);
      if (!last) return true;
      const diff = Date.now() - parseInt(last);
      return diff > minutes * 60 * 1000;
  };

  const triggerBackgroundSync = useCallback(async () => {
      // Check for global sync lock (1 hour cooldown after quota error)
      const lastQuotaError = localStorage.getItem('lastQuotaError');
      if (lastQuotaError && Date.now() - parseInt(lastQuotaError) < 60 * 60 * 1000) {
          return;
      }

      if (isSyncingNews || !shouldFetch('lastNewsSync', 360)) return;
      
      const todayStr = new Date().toLocaleDateString('gu-IN');
      try {
          // Check DB
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
                  // 1. Generate News Content if missing
                  const prompt = `You are a Gujarati News Editor. Today is ${todayStr}.
                  Generate 4 *FRESH* and *LATEST* news articles relevant to farmers in Gujarat.
                  Topics: Weather, APMC Prices, Government Schemes.
                  The content MUST be in Gujarati.
                  Return JSON Array with: title, summary, content, category.`;
                  
                  const aiRes = await ai.models.generateContent({
                      model: "gemini-3-flash-preview",
                      contents: prompt,
                      config: { 
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
  }, [isSyncingNews]);

  const checkUpdates = useCallback(async () => {
      // Check quota cooldown
      const lastQuotaError = localStorage.getItem('lastQuotaError');
      if (lastQuotaError && Date.now() - parseInt(lastQuotaError) < 60 * 60 * 1000) {
          console.log("Using static data due to recent quota error");
          setTickerNotices([{ title: 'સિસ્ટમ અપડેટ: સર્વર મેન્ટેનન્સ ચાલુ છે.' }]);
          setHomeNews([
            { id: 101, title: "ખેડૂતો માટે ખુશખબર: પાક વીમા યોજનામાં ફેરફાર", category: "ખેતીવાડી", image: fallbackImages[0] },
            { id: 102, title: "ધોરણ 10 અને 12 નું પરિણામ જાહેર", category: "શિક્ષણ", image: fallbackImages[1] },
            { id: 103, title: "સુકન્યા સમૃદ્ધિ યોજનામાં વ્યાજદરમાં વધારો", category: "યોજના", image: fallbackImages[2] }
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
             setHomeNews([
                { id: 101, title: "ખેડૂતો માટે ખુશખબર: પાક વીમા યોજનામાં ફેરફાર", category: "ખેતીવાડી", image: fallbackImages[0] },
                { id: 102, title: "ધોરણ 10 અને 12 નું પરિણામ જાહેર", category: "શિક્ષણ", image: fallbackImages[1] },
                { id: 103, title: "સુકન્યા સમૃદ્ધિ યોજનામાં વ્યાજદરમાં વધારો", category: "યોજના", image: fallbackImages[2] }
             ]);
          } else {
             console.error("Fetch error:", err);
             setTickerNotices([{ title: 'સિસ્ટમ અપડેટ: ડેટા લોડ થઈ શક્યો નથી.' }]);
          }
      }
  }, [triggerBackgroundSync]);

  useEffect(() => {
    // ONLY fetch on mount
    checkUpdates();
  }, [checkUpdates]);

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

  const handleServiceClick = (service: ServiceType) => {
    setActiveService(service);
    setCurrentView('services');
  };

  const servicesList = [
      { id: 'news', label: 'સમાચાર', color: 'bg-indigo-600', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg> },
      { id: 'marketplace', label: 'ગ્રામ્ય હાટ', color: 'bg-amber-600', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg> },
      { id: 'notice', label: 'નોટિસ', color: 'bg-orange-600', hasNotification: hasNewNotices, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg> },
      { id: 'rojgar', label: 'રોજગાર', color: 'bg-emerald-600', hasNotification: hasNewJobs, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg> },
      { id: 'health', label: 'આરોગ્ય', color: 'bg-teal-600', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg> },
      { id: 'water', label: 'પાણી', color: 'bg-blue-600', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5" /></svg> },
  ];

  const navItems = [
    { id: 'home', label: 'હોમ', icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { id: 'search', label: 'શોધો', icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
    { id: 'services', label: 'સેવાઓ', icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" },
    { id: 'panchayat', label: 'પંચાયત', icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
    { id: 'more', label: 'અન્ય', icon: "M4 6h16M4 12h16M4 12h16M4 12h16M4 18h16" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] font-sans text-gray-900 relative">
      <Header />
      <div className="h-[60px]"></div>
      <NoticeTicker notices={tickerNotices} />
      
      <main className="flex-grow w-full max-w-2xl mx-auto px-4 py-6 pb-28">
        {currentView === 'home' && (
          <div className="animate-fade-in space-y-8">
            <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                <div className="flex-1 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden min-h-[140px]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <div className="relative z-10">
                        <h2 className="text-xl font-black text-gray-800 tracking-tight">કેમ છો, ભરાડાવાસીઓ! 👋</h2>
                        <p className="text-xs text-gray-500 mt-1.5 font-medium leading-relaxed">ડિજિટલ ભરાડા પોર્ટલ પર આપનું હાર્દિક સ્વાગત છે. તમારી પંચાયત હવે તમારા ખિસ્સામાં.</p>
                    </div>
                    <button onClick={() => setCurrentView('panchayat')} className="w-fit bg-gray-900 text-white px-4 py-2 rounded-xl text-[10px] font-bold mt-4 hover:bg-black transition-colors flex items-center gap-2">
                        પંચાયત પ્રોફાઇલ <span className="text-sm">→</span>
                    </button>
                </div>
                <div className="sm:w-1/3"><WeatherWidget /></div>
            </div>

            {/* AdSense Space Placeholder */}
            <div className="bg-gray-100 border-2 border-dashed border-gray-200 h-24 rounded-2xl flex items-center justify-center">
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Advertisement Space</p>
            </div>

            <div onClick={() => setCurrentView('search')} className="bg-emerald-600 rounded-[2rem] p-6 shadow-xl shadow-emerald-200/50 cursor-pointer transform active:scale-[0.98] transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
                <div className="flex items-center gap-6 relative z-10">
                    <div className="bg-white/15 text-white p-4 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-white font-black text-lg">સરકારી સહાયની યાદી ૨૦૨૪</h3>
                        <p className="text-emerald-50 text-xs mt-1 font-bold opacity-80">કૃષિ સહાય પેકેજમાં તમારું નામ છે કે નહીં તે તપાસો...</p>
                    </div>
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between px-1 mb-5">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <span className="w-1 h-3 bg-emerald-500 rounded-full"></span>
                        ગ્રામ્ય સેવાઓ
                    </h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {servicesList.map((service) => (
                        <button key={service.id} onClick={() => handleServiceClick(service.id as ServiceType)} className={`group p-5 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center gap-4 active:scale-95 transition-all relative ${service.id === 'marketplace' ? 'bg-amber-600 text-white shadow-lg shadow-amber-200' : 'bg-white hover:border-gray-300'}`}>
                            {service.hasNotification && <span className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>}
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${service.id === 'marketplace' ? 'bg-white/20 text-white' : `${service.color} text-white shadow-lg shadow-gray-200`}`}>
                                {service.icon}
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-wider ${service.id === 'marketplace' ? 'text-white' : 'text-gray-700'}`}>{service.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">તાજા સમાચાર</h3>
                        <button onClick={() => handleServiceClick('news')} className="text-emerald-600 text-[10px] font-black uppercase tracking-widest">બધા જુઓ →</button>
                    </div>
                    <div className="space-y-3">
                        {homeNews.length === 0 ? (
                            <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-6 text-center text-xs text-gray-400 font-bold">
                                {hasNewNotices ? "ડેટા અપડેટ થઇ રહ્યો છે..." : "કોઈ સમાચાર નથી અથવા ડેટાબેઝ લિમિટ."}
                            </div>
                        ) : homeNews.map((article: any, index) => (
                            <div key={article.id} onClick={() => handleServiceClick('news')} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden flex items-center gap-4">
                                {article.image ? (
                                    <img src={article.image} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                                ) : (
                                    <img src={fallbackImages[index % fallbackImages.length]} className="w-12 h-12 rounded-lg object-cover shrink-0 opacity-80" />
                                )}
                                <div>
                                    <span className="text-[9px] font-black text-indigo-600 uppercase mb-0.5 block tracking-wider">{article.category}</span>
                                    <h4 className="text-xs font-black text-gray-900 leading-tight line-clamp-2">{article.title}</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">મહત્વની નોટિસ</h3>
                    </div>
                    {featuredNotice ? (
                        <div onClick={() => handleServiceClick('notice')} className="bg-orange-50 border border-orange-100 rounded-[2rem] p-6 relative cursor-pointer hover:bg-orange-100 transition-colors h-full">
                            <span className="bg-orange-600 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter mb-4 inline-block">વરન્ટ / નોટિસ</span>
                            <h4 className="text-sm font-black text-gray-900 leading-tight mb-2">{featuredNotice.title}</h4>
                            <p className="text-[11px] text-gray-500 line-clamp-3 font-medium">{featuredNotice.description}</p>
                        </div>
                    ) : (
                        <div className="bg-white border border-dashed border-gray-200 rounded-[2rem] p-6 text-center h-[140px] flex items-center justify-center">
                            <p className="text-xs text-gray-400 font-bold italic">હાલ કોઈ નવી નોટિસ નથી.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* AdSense Bottom Unit Placeholder */}
            <div className="bg-gray-100 border-2 border-dashed border-gray-200 h-40 rounded-3xl flex items-center justify-center">
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">In-Feed Native Ad Unit</p>
            </div>

            <div className="text-center pt-8 opacity-20 flex flex-col items-center">
              <div className="w-10 h-1 h-0.5 bg-gray-400 rounded-full mb-4"></div>
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em]">Bharada Digital Gram Panchayat Portal • 2024</p>
            </div>
            
            {/* Extended Footer Links for AdSense Approval */}
            <div className="pt-10 border-t border-gray-100">
               <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setCurrentView('about')} className="text-left p-4 bg-white rounded-2xl border border-gray-50 shadow-sm"><span className="block text-[8px] font-black text-gray-400 uppercase mb-1">More</span><span className="text-xs font-bold">About Us (અમારા વિશે)</span></button>
                  <button onClick={() => setCurrentView('contact')} className="text-left p-4 bg-white rounded-2xl border border-gray-50 shadow-sm"><span className="block text-[8px] font-black text-gray-400 uppercase mb-1">Help</span><span className="text-xs font-bold">Contact (સંપર્ક)</span></button>
                  <button onClick={() => setCurrentView('privacy')} className="text-left p-4 bg-white rounded-2xl border border-gray-50 shadow-sm"><span className="block text-[8px] font-black text-gray-400 uppercase mb-1">Legal</span><span className="text-xs font-bold">Privacy Policy</span></button>
                  <button onClick={() => setCurrentView('terms')} className="text-left p-4 bg-white rounded-2xl border border-gray-50 shadow-sm"><span className="block text-[8px] font-black text-gray-400 uppercase mb-1">Policy</span><span className="text-xs font-bold">Terms & Conditions</span></button>
               </div>
            </div>
          </div>
        )}

        {currentView === 'search' && (
           <div className="animate-fade-in space-y-4">
              <div className="flex items-center gap-2 px-1 mb-2"><button onClick={() => setCurrentView('home')} className="p-2 -ml-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg></button><h2 className="text-xl font-bold text-gray-800">યાદીમાં નામ શોધો</h2></div>
              <div className="sticky top-[70px] z-30 bg-[#F9FAFB] pb-2"><SearchBar value={searchQuery} onChange={setSearchQuery} /></div>
              <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 px-4 pb-4 min-h-[500px]"><BeneficiaryList data={filteredData} /></div>
           </div>
        )}

        {currentView === 'services' && (
          <div className="animate-fade-in">
             <div className="flex items-center gap-2 px-1 mb-4"><button onClick={() => setCurrentView('home')} className="p-2 -ml-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg></button><h2 className="text-xl font-bold text-gray-800">ગ્રામ્ય સેવાઓ</h2></div>
            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-4 border-b">
                {servicesList.map(s => (
                   <button key={s.id} onClick={() => setActiveService(s.id as ServiceType)} className={`px-5 py-2.5 rounded-full whitespace-nowrap text-[10px] font-black tracking-widest uppercase transition-all border ${activeService === s.id ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white text-gray-500 border-gray-100'}`}>
                       {s.label}
                   </button>
                ))}
            </div>
            {activeService === 'water' && <WaterSupply />}
            {activeService === 'health' && <HealthCenter />}
            {activeService === 'school' && <SchoolInfo />}
            {activeService === 'notice' && <NoticeBoard />}
            {activeService === 'schemes' && <SchemeInfo />}
            {activeService === 'rojgar' && <RojgarBoard />}
            {activeService === 'business' && <BusinessDirectory />}
            {activeService === 'profile' && <VillageProfile />}
            {activeService === 'agri' && <AgriRental />}
            {activeService === 'complaint' && <GeneralComplaints />}
            {activeService === 'student' && <StudentCorner />}
            {activeService === 'blood' && <BloodDonors />}
            {activeService === 'news' && <NewsSection />}
            {activeService === 'marketplace' && <VillageMarket />}
          </div>
        )}

        {currentView === 'panchayat' && <div className="animate-fade-in"><button onClick={() => setCurrentView('home')} className="mb-4 text-xs font-bold text-emerald-600">← હોમ</button><PanchayatInfo /></div>}
        {currentView === 'about' && <div className="animate-fade-in"><button onClick={() => setCurrentView('home')} className="mb-4 text-xs font-bold text-emerald-600">← હોમ</button><AboutUs /></div>}
        {currentView === 'contact' && <div className="animate-fade-in"><button onClick={() => setCurrentView('home')} className="mb-4 text-xs font-bold text-emerald-600">← હોમ</button><ContactUs /></div>}
        {currentView === 'privacy' && <div className="animate-fade-in"><button onClick={() => setCurrentView('home')} className="mb-4 text-xs font-bold text-emerald-600">← હોમ</button><PrivacyPolicy /></div>}
        {currentView === 'terms' && <div className="animate-fade-in"><button onClick={() => setCurrentView('home')} className="mb-4 text-xs font-bold text-emerald-600">← હોમ</button><TermsConditions /></div>}
        
        {currentView === 'more' && (
          <div className="animate-fade-in space-y-8">
             <div className="flex items-center gap-2 mb-1"><button onClick={() => setCurrentView('home')} className="p-2 -ml-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg></button><h2 className="text-xl font-bold text-gray-800">અન્ય માહિતી</h2></div>
             <EmergencyContacts /><ImportantLinks /><PhotoGallery />
          </div>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 z-50 shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
        <div className="max-w-2xl mx-auto flex justify-around items-center pt-2 pb-safe">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => { setCurrentView(item.id as any); if (item.id === 'services' && !activeService) setActiveService('news'); }} className="flex-1 py-3 relative flex flex-col items-center group">
              {item.id === 'services' && (hasNewNotices || hasNewJobs) && <span className="absolute top-2 right-[30%] w-2 h-2 bg-red-500 rounded-full border-2 border-white shadow-sm"></span>}
              <div className={`transition-all duration-300 rounded-2xl p-2 ${currentView === item.id ? 'text-emerald-600 bg-emerald-50 scale-110' : 'text-gray-400 group-active:scale-90'}`}>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={currentView === item.id ? 2.5 : 2} d={item.icon} /></svg>
              </div>
              <span className={`text-[10px] font-black mt-1 transition-colors ${currentView === item.id ? 'text-emerald-700' : 'text-gray-400'}`}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
