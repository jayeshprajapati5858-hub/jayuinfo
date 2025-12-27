import React from 'react';
import { Link } from 'react-router-dom';
import ServiceView from './ServiceView';

const HomeView: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      
      {/* 1. Hero Section - Search Focus */}
      <div className="bg-emerald-700 text-white relative overflow-hidden rounded-b-[2.5rem] shadow-xl">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
         <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/30 rounded-full -ml-10 -mb-10 blur-2xl"></div>
         
         <div className="max-w-7xl mx-auto px-6 py-12 relative z-10 text-center">
            <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
               તમારું નામ લિસ્ટમાં શોધો
            </h1>
            <p className="text-emerald-100 text-sm md:text-lg mb-8 max-w-2xl mx-auto">
               સરકારી યોજના, સહાય અને ગ્રામ પંચાયતના લિસ્ટમાં તમારું નામ ચેક કરવા માટે નીચે ક્લિક કરો.
            </p>
            
            <Link to="/service/khedut" className="inline-flex items-center gap-3 bg-white text-emerald-800 px-8 py-4 rounded-2xl font-black text-lg shadow-2xl hover:bg-emerald-50 transition-transform active:scale-95 group">
               <svg className="w-6 h-6 text-emerald-600 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
               નામ સર્ચ કરો
            </Link>
         </div>
      </div>

      {/* 2. Quick Access Grid */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <Link to="/service/khedut" className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:-translate-y-1 transition-all flex flex-col items-center text-center">
               <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
               </div>
               <h3 className="font-bold text-gray-800">લાભાર્થી યાદી</h3>
               <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Search List</p>
            </Link>

            <Link to="/service/news" className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:-translate-y-1 transition-all flex flex-col items-center text-center">
               <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
               </div>
               <h3 className="font-bold text-gray-800">સમાચાર</h3>
               <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Daily News</p>
            </Link>

            <Link to="/service/marketplace" className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:-translate-y-1 transition-all flex flex-col items-center text-center">
               <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
               </div>
               <h3 className="font-bold text-gray-800">ગ્રામ્ય માર્કેટ</h3>
               <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Buy & Sell</p>
            </Link>

            <Link to="/service/water" className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:-translate-y-1 transition-all flex flex-col items-center text-center">
               <div className="w-12 h-12 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
               </div>
               <h3 className="font-bold text-gray-800">પાણી/સેવા</h3>
               <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Services</p>
            </Link>

         </div>
      </div>

      {/* 3. About Section */}
      <div className="max-w-7xl mx-auto px-6 py-12 mt-4 text-center">
         <h2 className="text-2xl font-black text-gray-800 mb-4">JAYU INFO વિશે</h2>
         <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            આ પોર્ટલ ગ્રામજનોને પારદર્શક માહિતી પૂરી પાડવા માટે બનાવવામાં આવ્યું છે. અહીં તમે સરકારી યાદીમાં તમારું નામ, ગામના સમાચાર અને અન્ય સુવિધાઓનો લાભ લઈ શકો છો.
         </p>
         <div className="mt-8 flex justify-center gap-4">
             <Link to="/service/profile" className="text-sm font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full">ગામ વિશે</Link>
             <Link to="/service/complaint" className="text-sm font-bold text-red-600 bg-red-50 px-4 py-2 rounded-full">ફરિયાદ કરો</Link>
         </div>
      </div>

    </div>
  );
};

export default HomeView;