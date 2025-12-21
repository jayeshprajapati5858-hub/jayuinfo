import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import { BeneficiaryList } from './components/BeneficiaryList';
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
import BloodDonors from './components/BloodDonors';
import NewsSection from './components/NewsSection';
import VillageMarket from './components/VillageMarket';
import { PrivacyPolicy, TermsConditions } from './components/LegalPages';
import { beneficiaryData } from './data/beneficiaries';
import { Beneficiary } from './types';

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

const NoticeTicker = ({ notices }: { notices: any[] }) => {
  const defaultNotices = [
    { title: 'કૃષિ સહાય પેકેજની યાદી જાહેર. ખેડૂતોએ તાત્કાલિક બેંક DBT ચાલુ કરાવવું.' },
    { title: 'ગ્રામ પંચાયતની વેરા વસૂલાત ઝુંબેશ ચાલુ છે.' }
  ];
  const displayData = notices && notices.length > 0 ? notices : defaultNotices;
  return (
    <div className="bg-orange-600 overflow-hidden py-2 relative shadow-md">
       <div className="whitespace-nowrap animate-marquee flex gap-12">
          {displayData.map((n, i) => (
             <span key={i} className="text-white text-sm font-bold inline-flex items-center gap-2">
               <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded animate-pulse">LIVE</span>
               {n.title}
             </span>
          ))}
       </div>
    </div>
  );
};

type ServiceType = 'market' | 'water' | 'health' | 'school' | 'notice' | 'schemes' | 'rojgar' | 'bus' | 'business' | 'profile' | 'agri' | 'complaint' | 'student' | 'blood' | 'news' | 'marketplace';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<'home' | 'search' | 'services' | 'panchayat' | 'more' | 'privacy' | 'terms'>('home');
  const [activeService, setActiveService] = useState<ServiceType | null>(null);
  const [hasNewNotices, setHasNewNotices] = useState(false);
  const [hasNewJobs, setHasNewJobs] = useState(false);
  const [tickerNotices, setTickerNotices] = useState<any[]>([]);

  const checkUpdates = () => {
      const oneDayMs = 24 * 60 * 60 * 1000;
      const now = Date.now();
      const notices = JSON.parse(localStorage.getItem('villageNotices') || '[]');
      const activeNotices = notices.filter((n: any) => (now - (n.timestamp || 0)) < oneDayMs);
      setHasNewNotices(activeNotices.length > 0);
      setTickerNotices(activeNotices);
      const jobs = JSON.parse(localStorage.getItem('rojgarListings') || '[]');
      const recentJob = jobs.some((j: any) => (now - (j.timestamp || 0)) < oneDayMs);
      setHasNewJobs(recentJob);
  };

  useEffect(() => {
    checkUpdates();
    const interval = setInterval(checkUpdates, 5000);
    window.addEventListener('noticeUpdate', checkUpdates);
    return () => {
        clearInterval(interval);
        window.removeEventListener('noticeUpdate', checkUpdates);
    };
  }, []);

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

  const navItems = [
    { id: 'home', label: 'હોમ', icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { id: 'search', label: 'શોધો', icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
    { id: 'services', label: 'સેવાઓ', icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" },
    { id: 'panchayat', label: 'પંચાયત', icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
    { id: 'more', label: 'અન્ય', icon: "M4 6h16M4 12h16M4 12h16M4 12h16M4 18h16" },
  ];

  const handleServiceClick = (service: ServiceType) => {
    setActiveService(service);
    setCurrentView('services');
  };

  const servicesList = [
      { id: 'news', label: 'સમાચાર', color: 'bg-indigo-600 text-white', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg> },
      { id: 'marketplace', label: 'ગ્રામ્ય હાટ', color: 'bg-amber-100 text-amber-700', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg> },
      { id: 'notice', label: 'નોટિસ', color: 'bg-orange-100 text-orange-700', hasNotification: hasNewNotices, icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg> },
      { id: 'rojgar', label: 'રોજગાર', color: 'bg-emerald-50 text-emerald-600', hasNotification: hasNewJobs, icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg> },
      { id: 'bus', label: 'બસ ટાઈમ', color: 'bg-red-50 text-red-600', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg> },
      { id: 'market', label: 'બજાર ભાવ', color: 'bg-green-100 text-green-700', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-sans text-gray-900">
      <Header />
      <div className="h-[60px]"></div>
      <NoticeTicker notices={tickerNotices} />
      <main className="flex-grow w-full max-w-2xl mx-auto px-4 py-6 pb-28">
        {currentView === 'home' && (
          <div className="animate-fade-in space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
               <div className="col-span-1 sm:col-span-3 bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden min-h-[160px]">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100 rounded-full blur-2xl -mr-8 -mt-8"></div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">સ્વાગત છે 👋</h2>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">ગામની તમામ માહિતી અને સુવિધાઓ હવે તમારી આંગળીના ટેરવે.</p>
                  </div>
                  <button onClick={() => setCurrentView('panchayat')} className="text-emerald-600 text-xs font-bold flex items-center gap-1 mt-2">પંચાયત સંપર્ક <span className="text-lg">→</span></button>
               </div>
               <div className="col-span-1 sm:col-span-2 min-h-[160px]"><WeatherWidget /></div>
            </div>
            <div onClick={() => setCurrentView('search')} className="bg-white rounded-2xl p-4 shadow-lg border border-emerald-100 cursor-pointer transform active:scale-[0.98] transition-all group">
               <div className="flex items-center gap-4">
                  <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl group-hover:bg-emerald-100 transition-colors shadow-sm shadow-emerald-200"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div>
                  <div className="flex-1">
                     <h3 className="text-gray-900 font-bold text-base">DBT લિસ્ટમાં તમારું નામ તપાસો</h3>
                     <p className="text-gray-400 text-xs mt-0.5">યાદીમાં તમારું નામ છે કે નહિ તે જાણવા ક્લિક કરો...</p>
                  </div>
                  <div className="text-gray-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  </div>
               </div>
            </div>
            <div>
              <div className="flex items-center justify-between px-1 mb-3"><h3 className="text-sm font-bold text-gray-800">ઝડપી સુવિધાઓ</h3></div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                 {servicesList.map((service) => (
                     <button key={service.id} onClick={() => handleServiceClick(service.id as ServiceType)} className={`p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center gap-3 active:scale-95 transition-all relative ${service.id === 'marketplace' ? 'bg-amber-600 text-white shadow-lg shadow-amber-100' : 'bg-white hover:border-gray-300'}`}>
                        {service.hasNotification && <span className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse shadow-sm"></span>}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${service.id === 'marketplace' ? 'bg-white/20 text-white' : service.color}`}>{service.icon}</div>
                        <span className={`text-xs font-bold ${service.id === 'marketplace' ? 'text-white' : 'text-gray-700'}`}>{service.label}</span>
                     </button>
                 ))}
              </div>
            </div>
          </div>
        )}
        {currentView === 'search' && (
           <div className="animate-fade-in space-y-4">
              <div className="flex items-center gap-2 px-1 mb-2"><button onClick={() => setCurrentView('home')} className="p-2 -ml-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg></button><h2 className="text-xl font-bold text-gray-800">યાદીમાં નામ શોધો</h2></div>
              <div className="sticky top-[70px] z-30 bg-[#F8FAFC] pb-2"><div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-2"><SearchBar value={searchQuery} onChange={setSearchQuery} /></div></div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-4 pb-4 min-h-[500px]"><BeneficiaryList data={filteredData} /></div>
           </div>
        )}
        {currentView === 'services' && (
          <div className="animate-fade-in">
             <div className="flex items-center gap-2 px-1 mb-4"><button onClick={() => setCurrentView('home')} className="p-2 -ml-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg></button><h2 className="text-xl font-bold text-gray-800">ગ્રામ્ય સેવાઓ</h2></div>
            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-4">
                {servicesList.map(s => (
                   <button key={s.id} onClick={() => setActiveService(s.id as ServiceType)} className={`px-4 py-2 rounded-full whitespace-nowrap text-[10px] font-bold transition-all border ${activeService === s.id ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-gray-500 border-gray-100'}`}>
                       {s.label}
                   </button>
                ))}
            </div>
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
            {activeService === 'blood' && <BloodDonors />}
            {activeService === 'news' && <NewsSection />}
            {activeService === 'marketplace' && <VillageMarket />}
          </div>
        )}
        {currentView === 'panchayat' && (
          <div className="animate-fade-in">
             <div className="flex items-center gap-2 mb-4"><button onClick={() => setCurrentView('home')} className="p-2 -ml-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg></button><h2 className="text-xl font-bold text-gray-800">પંચાયત સંપર્ક</h2></div>
             <PanchayatInfo />
          </div>
        )}
        {currentView === 'more' && (
          <div className="animate-fade-in space-y-8">
             <div className="flex items-center gap-2 mb-1"><button onClick={() => setCurrentView('home')} className="p-2 -ml-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg></button><h2 className="text-xl font-bold text-gray-800">અન્ય માહિતી</h2></div>
             <EmergencyContacts /><ImportantLinks /><PhotoGallery />
             <div className="flex flex-col gap-2 p-4 bg-white rounded-2xl border shadow-sm">
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">કાનૂની</h3>
                <button onClick={() => setCurrentView('privacy')} className="text-left text-sm font-bold flex justify-between p-2 hover:bg-gray-50 rounded-lg"><span>Privacy Policy</span><span>→</span></button>
                <button onClick={() => setCurrentView('terms')} className="text-left text-sm font-bold flex justify-between p-2 hover:bg-gray-50 rounded-lg"><span>Terms & Conditions</span><span>→</span></button>
             </div>
          </div>
        )}
        {currentView === 'privacy' && <div className="animate-fade-in"><button onClick={() => setCurrentView('more')} className="mb-4 text-xs font-bold text-indigo-600">← પાછા જાઓ</button><PrivacyPolicy /></div>}
        {currentView === 'terms' && <div className="animate-fade-in"><button onClick={() => setCurrentView('more')} className="mb-4 text-xs font-bold text-indigo-600">← પાછા જાઓ</button><TermsConditions /></div>}
      </main>
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 z-50">
        <div className="max-w-2xl mx-auto flex justify-around items-center pt-1 pb-safe">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => { setCurrentView(item.id as any); if (item.id === 'services' && !activeService) setActiveService('news'); }} className="flex-1 py-3 relative flex flex-col items-center group">
              {item.id === 'services' && (hasNewNotices || hasNewJobs) && <span className="absolute top-2 right-8 w-2 h-2 bg-red-500 rounded-full border border-white"></span>}
              <div className={`transition-all rounded-full p-1.5 ${currentView === item.id ? 'text-emerald-600 bg-emerald-50' : 'text-gray-400 group-hover:text-gray-600'}`}><svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={currentView === item.id ? 2.5 : 2} d={item.icon} /></svg></div>
              <span className={`text-[10px] font-bold mt-0.5 ${currentView === item.id ? 'text-emerald-700' : 'text-gray-400 group-hover:text-gray-600'}`}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;