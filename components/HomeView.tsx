
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import WeatherWidget from './WeatherWidget';
import AdSenseSlot from './AdSenseSlot';
import { pool } from '../utils/db';

interface HomeViewProps {
  featuredNotice: any;
}

const HomeView: React.FC<HomeViewProps> = ({ featuredNotice }) => {
  const [latestNews, setLatestNews] = useState<any>(null);

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        const res = await pool.query('SELECT * FROM news ORDER BY id DESC LIMIT 1');
        if (res.rows.length > 0) setLatestNews(res.rows[0]);
      } catch (e) { console.warn("News not yet initialized"); }
    };
    fetchLatestNews();
  }, []);
  
  const servicesList = [
      { id: 'marketplace', label: 'ગ્રામ્ય હાટ', color: 'bg-amber-600', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg> },
      { id: 'news', label: 'સમાચાર', color: 'bg-blue-600', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg> },
      { id: 'notice', label: 'નોટિસ', color: 'bg-orange-600', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg> },
      { id: 'rojgar', label: 'રોજગાર', color: 'bg-emerald-600', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg> },
      { id: 'health', label: 'આરોગ્ય', color: 'bg-teal-600', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg> },
      { id: 'schemes', label: 'યોજના', color: 'bg-purple-600', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> },
  ];

  return (
    <div className="animate-fade-in space-y-8 pb-20">
      {/* Header Cards */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch">
          <div className="flex-1 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden min-h-[140px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <div className="relative z-10">
                  <h2 className="text-xl font-black text-gray-800 tracking-tight">કેમ છો, ભરાડાવાસીઓ! 👋</h2>
                  <p className="text-xs text-gray-500 mt-1.5 font-medium leading-relaxed">તમારી પંચાયતનું ડિજિટલ પોર્ટલ. ગામની તમામ માહિતી હવે એક જ જગ્યાએ.</p>
              </div>
              <Link to="/panchayat" className="w-fit bg-gray-900 text-white px-4 py-2 rounded-xl text-[10px] font-bold mt-4 hover:bg-black transition-colors flex items-center gap-2">
                  પંચાયત પ્રોફાઇલ <span className="text-sm">→</span>
              </Link>
          </div>
          <div className="sm:w-1/3"><WeatherWidget /></div>
      </div>

      {/* Breaking News Highlight */}
      {latestNews && (
        <Link to="/service/news" className="block bg-blue-50 border border-blue-100 rounded-[2.5rem] p-6 relative overflow-hidden group">
           <div className="flex items-center gap-4">
              <div className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg animate-bounce">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
              </div>
              <div className="flex-1">
                 <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">તાજા સમાચાર</span>
                    <span className="text-[9px] text-gray-400 font-bold">{latestNews.date_str}</span>
                 </div>
                 <h4 className="text-sm font-black text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-1">{latestNews.title}</h4>
              </div>
           </div>
        </Link>
      )}

      {/* Main Action Banner - PDF Search Highlight */}
      <Link to="/search" className="block bg-emerald-600 rounded-[2.5rem] p-8 shadow-2xl shadow-emerald-200/50 cursor-pointer transform active:scale-[0.98] transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-24 -mt-24 group-hover:scale-110 transition-transform duration-700"></div>
          <div className="flex items-center gap-6 relative z-10">
              <div className="bg-white text-emerald-600 p-5 rounded-3xl shadow-2xl border border-white/20">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              </div>
              <div className="flex-1">
                  <h3 className="text-white font-black text-xl leading-tight">કૃષિ સહાય PDF ડેટા ૨૦૨૪</h3>
                  <p className="text-emerald-100 text-sm mt-1 font-bold opacity-90">તમારું નામ અથવા અરજી નંબર અહીં શોધો</p>
                  <div className="mt-4 inline-flex items-center gap-2 bg-white/20 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/30 backdrop-blur-md">
                     Search Now →
                  </div>
              </div>
          </div>
      </Link>

      <AdSenseSlot slot="1234567890" format="rectangle" />

      {/* Services Grid */}
      <div>
          <div className="flex items-center justify-between px-1 mb-5">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="w-1 h-3 bg-emerald-500 rounded-full"></span>
                  ગામની સેવાઓ
              </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {servicesList.map((service) => (
                  <Link key={service.id} to={`/service/${service.id}`} className={`group p-5 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center gap-4 active:scale-95 transition-all relative ${service.id === 'marketplace' ? 'bg-amber-600 text-white shadow-xl shadow-amber-100' : 'bg-white hover:border-gray-300 hover:shadow-lg'}`}>
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${service.id === 'marketplace' ? 'bg-white/20 text-white' : `${service.color} text-white shadow-lg shadow-gray-100`}`}>
                          {service.icon}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-wider ${service.id === 'marketplace' ? 'text-white' : 'text-gray-700'}`}>{service.label}</span>
                  </Link>
              ))}
          </div>
      </div>

      <AdSenseSlot slot="0987654321" format="fluid" />

      {/* Notices Section Only */}
      <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">મહત્વની નોટિસ</h3>
              <Link to="/service/notice" className="text-orange-600 text-[10px] font-black uppercase tracking-widest">બધી જુઓ →</Link>
          </div>
          {featuredNotice ? (
              <Link to="/service/notice" className="block bg-orange-50 border border-orange-100 rounded-[2.5rem] p-7 relative cursor-pointer hover:bg-orange-100 transition-colors group">
                  <div className="flex justify-between items-center mb-4">
                    <span className="bg-orange-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg shadow-orange-200">જાહેરાત / નોટિસ</span>
                    <span className="text-[10px] text-orange-400 font-bold">{featuredNotice.date_str}</span>
                  </div>
                  <h4 className="text-sm font-black text-gray-900 leading-tight mb-2 group-hover:text-orange-700 transition-colors">{featuredNotice.title}</h4>
                  <p className="text-[11px] text-gray-600 line-clamp-3 font-medium leading-relaxed">{featuredNotice.description}</p>
                  <div className="mt-4 pt-4 border-t border-orange-200/30 text-orange-600 text-[10px] font-black uppercase tracking-widest">વધુ વાંચો →</div>
              </Link>
          ) : (
              <div className="bg-white border border-dashed border-gray-200 rounded-[2.5rem] p-6 text-center h-[160px] flex flex-col items-center justify-center gap-3">
                  <div className="p-3 bg-gray-50 rounded-full text-gray-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeWidth="2"/></svg>
                  </div>
                  <p className="text-xs text-gray-400 font-bold italic">હાલ કોઈ નવી નોટિસ નથી.</p>
              </div>
          )}
      </div>

      <AdSenseSlot slot="1122334455" format="rectangle" />

      {/* Professional Footer */}
      <div className="pt-10 border-t border-gray-100 pb-10">
          <div className="grid grid-cols-2 gap-4 mb-8">
            <Link to="/about" className="text-left p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"><span className="block text-[8px] font-black text-gray-400 uppercase mb-1">Explore</span><span className="text-xs font-bold">About Us</span></Link>
            <Link to="/contact" className="text-left p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"><span className="block text-[8px] font-black text-gray-400 uppercase mb-1">Support</span><span className="text-xs font-bold">Contact</span></Link>
            <Link to="/privacy" className="text-left p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"><span className="block text-[8px] font-black text-gray-400 uppercase mb-1">Legal</span><span className="text-xs font-bold">Privacy Policy</span></Link>
            <Link to="/terms" className="text-left p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"><span className="block text-[8px] font-black text-gray-400 uppercase mb-1">Usage</span><span className="text-xs font-bold">Terms & Conditions</span></Link>
          </div>
          
          <div className="text-center opacity-40">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em]">BHARADA DIGITAL PORTAL • © 2024</p>
          </div>
      </div>
    </div>
  );
};

export default HomeView;
