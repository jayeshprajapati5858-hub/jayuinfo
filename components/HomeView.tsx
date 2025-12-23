
import React from 'react';
import { Link } from 'react-router-dom';
import WeatherWidget from './WeatherWidget';

interface HomeViewProps {
  homeNews: any[];
  featuredNotice: any;
  hasNewNotices: boolean;
  fallbackImages: string[];
}

const HomeView: React.FC<HomeViewProps> = ({ homeNews, featuredNotice, hasNewNotices, fallbackImages }) => {
  
  const servicesList = [
      { id: 'news', label: 'સમાચાર', color: 'bg-indigo-600', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg> },
      { id: 'marketplace', label: 'ગ્રામ્ય હાટ', color: 'bg-amber-600', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg> },
      { id: 'notice', label: 'નોટિસ', color: 'bg-orange-600', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg> },
      { id: 'rojgar', label: 'રોજગાર', color: 'bg-emerald-600', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg> },
      { id: 'health', label: 'આરોગ્ય', color: 'bg-teal-600', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg> },
      { id: 'water', label: 'પાણી', color: 'bg-blue-600', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5" /></svg> },
  ];

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex flex-col sm:flex-row gap-4 items-stretch">
          <div className="flex-1 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden min-h-[140px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <div className="relative z-10">
                  <h2 className="text-xl font-black text-gray-800 tracking-tight">કેમ છો, ભરાડાવાસીઓ! 👋</h2>
                  <p className="text-xs text-gray-500 mt-1.5 font-medium leading-relaxed">ડિજિટલ ભરાડા પોર્ટલ પર આપનું હાર્દિક સ્વાગત છે. તમારી પંચાયત હવે તમારા ખિસ્સામાં.</p>
              </div>
              <Link to="/panchayat" className="w-fit bg-gray-900 text-white px-4 py-2 rounded-xl text-[10px] font-bold mt-4 hover:bg-black transition-colors flex items-center gap-2">
                  પંચાયત પ્રોફાઇલ <span className="text-sm">→</span>
              </Link>
          </div>
          <div className="sm:w-1/3"><WeatherWidget /></div>
      </div>

      {/* AdSense Space Placeholder */}
      <div className="bg-gray-100 border-2 border-dashed border-gray-200 h-24 rounded-2xl flex items-center justify-center">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Advertisement Space</p>
      </div>

      <Link to="/search" className="block bg-emerald-600 rounded-[2rem] p-6 shadow-xl shadow-emerald-200/50 cursor-pointer transform active:scale-[0.98] transition-all group relative overflow-hidden">
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
      </Link>

      <div>
          <div className="flex items-center justify-between px-1 mb-5">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="w-1 h-3 bg-emerald-500 rounded-full"></span>
                  ગ્રામ્ય સેવાઓ
              </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {servicesList.map((service) => (
                  <Link key={service.id} to={`/service/${service.id}`} className={`group p-5 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center gap-4 active:scale-95 transition-all relative ${service.id === 'marketplace' ? 'bg-amber-600 text-white shadow-lg shadow-amber-200' : 'bg-white hover:border-gray-300'}`}>
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${service.id === 'marketplace' ? 'bg-white/20 text-white' : `${service.color} text-white shadow-lg shadow-gray-200`}`}>
                          {service.icon}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-wider ${service.id === 'marketplace' ? 'text-white' : 'text-gray-700'}`}>{service.label}</span>
                  </Link>
              ))}
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">તાજા સમાચાર</h3>
                  <Link to="/service/news" className="text-emerald-600 text-[10px] font-black uppercase tracking-widest">બધા જુઓ →</Link>
              </div>
              <div className="space-y-3">
                  {homeNews.length === 0 ? (
                      <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-6 text-center text-xs text-gray-400 font-bold">
                          {hasNewNotices ? "ડેટા અપડેટ થઇ રહ્યો છે..." : "કોઈ સમાચાર નથી અથવા ડેટાબેઝ લિમિટ."}
                      </div>
                  ) : homeNews.map((article: any, index) => (
                      <Link key={article.id} to="/service/news" className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden flex items-center gap-4 block">
                          {article.image ? (
                              <img src={article.image} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                          ) : (
                              <img src={fallbackImages[index % fallbackImages.length]} className="w-12 h-12 rounded-lg object-cover shrink-0 opacity-80" />
                          )}
                          <div>
                              <span className="text-[9px] font-black text-indigo-600 uppercase mb-0.5 block tracking-wider">{article.category}</span>
                              <h4 className="text-xs font-black text-gray-900 leading-tight line-clamp-2">{article.title}</h4>
                          </div>
                      </Link>
                  ))}
              </div>
          </div>

          <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">મહત્વની નોટિસ</h3>
              </div>
              {featuredNotice ? (
                  <Link to="/service/notice" className="block bg-orange-50 border border-orange-100 rounded-[2rem] p-6 relative cursor-pointer hover:bg-orange-100 transition-colors h-full">
                      <span className="bg-orange-600 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter mb-4 inline-block">વરન્ટ / નોટિસ</span>
                      <h4 className="text-sm font-black text-gray-900 leading-tight mb-2">{featuredNotice.title}</h4>
                      <p className="text-[11px] text-gray-500 line-clamp-3 font-medium">{featuredNotice.description}</p>
                  </Link>
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
            <Link to="/about" className="text-left p-4 bg-white rounded-2xl border border-gray-50 shadow-sm"><span className="block text-[8px] font-black text-gray-400 uppercase mb-1">More</span><span className="text-xs font-bold">About Us (અમારા વિશે)</span></Link>
            <Link to="/contact" className="text-left p-4 bg-white rounded-2xl border border-gray-50 shadow-sm"><span className="block text-[8px] font-black text-gray-400 uppercase mb-1">Help</span><span className="text-xs font-bold">Contact (સંપર્ક)</span></Link>
            <Link to="/privacy" className="text-left p-4 bg-white rounded-2xl border border-gray-50 shadow-sm"><span className="block text-[8px] font-black text-gray-400 uppercase mb-1">Legal</span><span className="text-xs font-bold">Privacy Policy</span></Link>
            <Link to="/terms" className="text-left p-4 bg-white rounded-2xl border border-gray-50 shadow-sm"><span className="block text-[8px] font-black text-gray-400 uppercase mb-1">Policy</span><span className="text-xs font-bold">Terms & Conditions</span></Link>
          </div>
      </div>
    </div>
  );
};

export default HomeView;
