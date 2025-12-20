import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import BeneficiaryList from './components/BeneficiaryList';
import PanchayatInfo from './components/PanchayatInfo';
import ImportantLinks from './components/ImportantLinks';
import WaterSupply from './components/WaterSupply';
import EmergencyContacts from './components/EmergencyContacts';
import PhotoGallery from './components/PhotoGallery';
import MarketRates from './components/MarketRates';
import WeatherWidget from './components/WeatherWidget';
import HealthCenter from './components/HealthCenter';
import SchoolInfo from './components/SchoolInfo';
import NoticeBoard from './components/NoticeBoard';
import SchemeInfo from './components/SchemeInfo';
import RojgarBoard from './components/RojgarBoard';
import BusSchedule from './components/BusSchedule';
import BusinessDirectory from './components/BusinessDirectory';
import VillageProfile from './components/VillageProfile';
import AgriRental from './components/AgriRental';
import GeneralComplaints from './components/GeneralComplaints';
import StudentCorner from './components/StudentCorner';
import { beneficiaryData } from './data/beneficiaries';

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

// --- Scrolling Notice Ticker ---
const NoticeTicker = () => (
  <div className="bg-orange-500 overflow-hidden py-2 relative shadow-sm">
     <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-orange-500 to-transparent z-10"></div>
     <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-orange-500 to-transparent z-10"></div>
     <div className="whitespace-nowrap animate-marquee flex gap-8">
        {[1, 2, 3].map(i => (
           <span key={i} className="text-white text-xs font-bold inline-flex items-center gap-2">
             <span className="bg-white text-orange-600 text-[10px] px-1.5 rounded">NEW</span>
             કૃષિ સહાય પેકેજની યાદી જાહેર. ખેડૂતોએ તાત્કાલિક બેંક DBT ચાલુ કરાવવું.
           </span>
        ))}
     </div>
  </div>
);

type ServiceType = 'market' | 'water' | 'health' | 'school' | 'notice' | 'schemes' | 'rojgar' | 'bus' | 'business' | 'profile' | 'agri' | 'complaint' | 'student';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<'home' | 'search' | 'services' | 'panchayat' | 'more'>('home');
  const [activeService, setActiveService] = useState<ServiceType | null>(null);

  // Notification State
  const [hasNewNotices, setHasNewNotices] = useState(false);
  const [hasNewJobs, setHasNewJobs] = useState(false);

  // Check for updates on mount
  useEffect(() => {
    const checkUpdates = () => {
        const oneDayMs = 24 * 60 * 60 * 1000;
        const now = Date.now();

        // Check Notices
        const notices = JSON.parse(localStorage.getItem('villageNotices') || '[]');
        const recentNotice = notices.some((n: any) => (now - (n.timestamp || 0)) < oneDayMs);
        setHasNewNotices(recentNotice);

        // Check Jobs
        const jobs = JSON.parse(localStorage.getItem('rojgarListings') || '[]');
        const recentJob = jobs.some((j: any) => (now - (j.timestamp || 0)) < oneDayMs);
        setHasNewJobs(recentJob);
    };
    
    checkUpdates();
    // Re-check every time view changes (simulating real-time feel)
  }, [currentView]);

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return beneficiaryData;
    const searchTerms = searchQuery.toLowerCase().trim().split(/\s+/);
    return beneficiaryData.filter((item) => {
      const itemData = `${item.id} ${item.applicationNo} ${item.name} ${item.accountNo} ${item.village}`.toLowerCase();
      const itemSkeleton = normalizeToSkeleton(itemData);
      return searchTerms.every(term => {
        const termSkeleton = normalizeToSkeleton(term);
        return itemData.includes(term) || itemSkeleton.includes(termSkeleton);
      });
    });
  }, [searchQuery]);

  const navItems = [
    { id: 'home', label: 'હોમ', icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { id: 'search', label: 'શોધો', icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
    { id: 'services', label: 'સેવાઓ', icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" },
    { id: 'panchayat', label: 'પંચાયત', icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
    { id: 'more', label: 'અન્ય', icon: "M4 6h16M4 12h16M4 12h16M4 12h16M4 18h16" },
  ];

  const handleServiceClick = (service: ServiceType) => {
    setActiveService(service);
    setCurrentView('services');
  };

  const servicesList = [
      { id: 'notice', label: 'નોટિસ', color: 'bg-gray-100 text-gray-700', hasNotification: hasNewNotices, icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg> },
      { id: 'rojgar', label: 'રોજગાર', color: 'bg-emerald-50 text-emerald-600', hasNotification: hasNewJobs, icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg> },
      { id: 'bus', label: 'બસ ટાઈમ', color: 'bg-red-50 text-red-600', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg> },
      { id: 'agri', label: 'ખેતી ભાડે', color: 'bg-green-100 text-green-700', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"/></svg> },
      { id: 'complaint', label: 'ફરિયાદ', color: 'bg-yellow-100 text-yellow-700', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg> },
      { id: 'business', label: 'દુકાનો', color: 'bg-orange-50 text-orange-600', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> },
      { id: 'schemes', label: 'દાખલા માહિતી', color: 'bg-purple-50 text-purple-600', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> },
      { id: 'market', label: 'બજાર ભાવ', color: 'bg-indigo-50 text-indigo-600', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg> },
      { id: 'water', label: 'પાણી', color: 'bg-cyan-50 text-cyan-600', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2.34"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2v20"></path></svg> },
      { id: 'health', label: 'આરોગ્ય', color: 'bg-teal-50 text-teal-600', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg> },
      { id: 'student', label: 'સ્ટુડન્ટ કોર્નર', color: 'bg-pink-50 text-pink-600', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg> },
      { id: 'profile', label: 'ગામ પરિચય', color: 'bg-rose-50 text-rose-600', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-sans text-gray-900">
      
      <Header />
      
      {/* Top Spacer for Fixed Header */}
      <div className="h-[60px]"></div>

      <NoticeTicker />
      
      <main className="flex-grow w-full max-w-2xl mx-auto px-4 py-6 pb-28">
        
        {/* --- VIEW: HOME (Production Ready Dashboard) --- */}
        {currentView === 'home' && (
          <div className="animate-fade-in space-y-6">
            
            {/* 1. Hero / Welcome Grid - Responsive Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
               {/* Welcome Card */}
               <div className="col-span-1 sm:col-span-3 bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden min-h-[160px]">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100 rounded-full blur-2xl -mr-8 -mt-8"></div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">સ્વાગત છે 👋</h2>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      ગામની તમામ માહિતી અને સુવિધાઓ હવે તમારી આંગળીના ટેરવે.
                    </p>
                  </div>
                  <button 
                    onClick={() => setCurrentView('panchayat')}
                    className="text-emerald-600 text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all mt-2"
                  >
                    પંચાયત સંપર્ક <span className="text-lg">→</span>
                  </button>
               </div>

               {/* Weather Widget */}
               <div className="col-span-1 sm:col-span-2 min-h-[160px]">
                 <WeatherWidget />
               </div>
            </div>

            {/* 2. Primary Action: Search Trigger (Looks like Input) */}
            <div 
              onClick={() => setCurrentView('search')}
              className="bg-white rounded-2xl p-4 shadow-lg shadow-emerald-100/50 border border-emerald-100 cursor-pointer transform active:scale-[0.98] transition-all group"
            >
               <div className="flex items-center gap-4">
                  <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl group-hover:bg-emerald-100 transition-colors">
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  </div>
                  <div className="flex-1">
                     <h3 className="text-gray-900 font-bold text-base">DBT લિસ્ટમાં તમારું નામ તપાસો</h3>
                     <p className="text-gray-400 text-xs mt-0.5">યાદીમાં તમારું નામ છે કે નહિ તે જાણવા ક્લિક કરો...</p>
                  </div>
                  <div className="bg-gray-50 p-1.5 rounded-lg border border-gray-100">
                     <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  </div>
               </div>
            </div>

            {/* 3. Services Grid (Daily Utilities) */}
            <div>
              <div className="flex items-center justify-between px-1 mb-3">
                 <h3 className="text-sm font-bold text-gray-800">ઝડપી સુવિધાઓ</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                 {servicesList.slice(0, 6).map((service) => (
                     <button 
                        key={service.id}
                        onClick={() => handleServiceClick(service.id as ServiceType)}
                        className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center gap-3 hover:shadow-md transition-all active:scale-95 relative"
                     >
                        {service.hasNotification && (
                          <span className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse shadow-sm"></span>
                        )}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${service.color}`}>
                           {service.icon}
                        </div>
                        <span className="text-xs font-bold text-gray-700">{service.label}</span>
                     </button>
                 ))}
              </div>
            </div>

            <div className="text-center pb-4 pt-4">
              <p className="text-[10px] text-gray-400">© 2024 Bharada Gram Panchayat</p>
            </div>
          </div>
        )}

        {/* --- VIEW: SEARCH --- */}
        {currentView === 'search' && (
           <div className="animate-fade-in space-y-4">
              <div className="flex items-center gap-2 px-1 mb-2">
                 <button onClick={() => setCurrentView('home')} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                 </button>
                 <h2 className="text-xl font-bold text-gray-800">DBT યાદીમાં નામ શોધો</h2>
              </div>
              
              <div className="sticky top-[70px] z-30 bg-[#F8FAFC] pb-2">
                 <div className="bg-white rounded-2xl shadow-lg shadow-emerald-100/50 border border-emerald-100 p-2">
                    <SearchBar value={searchQuery} onChange={setSearchQuery} />
                 </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-4 pb-4 min-h-[500px]">
                 <BeneficiaryList data={filteredData} />
              </div>
           </div>
        )}

        {/* --- VIEW: SERVICES --- */}
        {currentView === 'services' && (
          <div className="animate-fade-in">
             <div className="flex items-center gap-2 px-1 mb-4">
                 <button onClick={() => setCurrentView('home')} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                 </button>
                 <h2 className="text-xl font-bold text-gray-800">ગ્રામ્ય સેવાઓ</h2>
              </div>

            {/* Service Selection Grid */}
            <div className={`grid grid-cols-3 gap-2 mb-6 ${activeService ? 'bg-white p-2 rounded-xl border border-gray-200 shadow-sm' : ''}`}>
               {servicesList.map((service) => (
                   <button
                     key={service.id}
                     onClick={() => setActiveService(service.id as ServiceType)}
                     className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all relative ${
                         activeService === service.id 
                         ? 'bg-gray-900 text-white shadow-lg scale-105' 
                         : 'bg-white text-gray-500 hover:bg-gray-50 border border-transparent hover:border-gray-200'
                     } ${!activeService ? 'bg-white border-gray-100 shadow-sm py-4' : ''}`}
                   >
                       {/* Red Dot Badge */}
                       {service.hasNotification && (
                          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
                       )}
                       <div className={`${activeService === service.id ? 'text-white' : 'text-current'} scale-75`}>
                           {service.icon}
                       </div>
                       <span className="text-[10px] font-bold mt-1">{service.label}</span>
                   </button>
               ))}
            </div>
            
            {!activeService && (
                <div className="text-center py-10 opacity-50">
                    <p>કોઈ એક સેવા પસંદ કરો.</p>
                </div>
            )}

            {activeService === 'market' && <MarketRates />}
            {activeService === 'water' && <WaterSupply />}
            {activeService === 'health' && <HealthCenter />}
            {activeService === 'school' && <SchoolInfo />}
            {activeService === 'notice' && <NoticeBoard />}
            {activeService === 'schemes' && <SchemeInfo />}
            {activeService === 'rojgar' && <RojgarBoard />}
            {activeService === 'bus' && <BusSchedule />}
            {activeService === 'business' && <BusinessDirectory />}
            {activeService === 'profile' && <VillageProfile />}
            {activeService === 'agri' && <AgriRental />}
            {activeService === 'complaint' && <GeneralComplaints />}
            {activeService === 'student' && <StudentCorner />}

          </div>
        )}

        {/* --- VIEW: PANCHAYAT --- */}
        {currentView === 'panchayat' && (
          <div className="animate-fade-in">
             <div className="flex items-center gap-2 px-1 mb-4">
                 <button onClick={() => setCurrentView('home')} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                 </button>
                 <h2 className="text-xl font-bold text-gray-800">પંચાયત સંપર્ક</h2>
              </div>
            <PanchayatInfo />
          </div>
        )}

        {/* --- VIEW: MORE --- */}
        {currentView === 'more' && (
          <div className="animate-fade-in space-y-8">
             <div className="flex items-center gap-2 px-1">
                 <button onClick={() => setCurrentView('home')} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                 </button>
                 <h2 className="text-xl font-bold text-gray-800">અન્ય માહિતી</h2>
              </div>
             <EmergencyContacts />
             <ImportantLinks />
             <PhotoGallery />
             <div className="text-center pt-8 border-t border-gray-200">
                <p className="text-xs text-gray-400">App Version 2.3.0 (Beta)</p>
             </div>
          </div>
        )}

      </main>

      {/* 3. Bottom Navigation Bar (Glassmorphism) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
        <div className="max-w-2xl mx-auto flex justify-around items-center pb-safe pt-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                  setCurrentView(item.id as any);
                  if (item.id === 'services' && !activeService) setActiveService('notice');
              }}
              className="flex-1 py-2.5 group relative flex flex-col items-center justify-center focus:outline-none"
            >
              {/* Notification Badge on Nav (Only for Services) */}
              {item.id === 'services' && (hasNewNotices || hasNewJobs) && (
                <span className="absolute top-2 right-8 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              )}
              
              <div className={`transition-all duration-300 rounded-full p-1 ${currentView === item.id ? '-translate-y-1 text-emerald-600 bg-emerald-50' : 'text-gray-400 group-hover:text-gray-600'}`}>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={currentView === item.id ? 2.5 : 2} d={item.icon} />
                </svg>
              </div>
              <span className={`text-[10px] font-bold mt-0.5 ${currentView === item.id ? 'text-emerald-700' : 'text-gray-400 group-hover:text-gray-600'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;