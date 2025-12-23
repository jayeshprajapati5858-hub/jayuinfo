
import React from 'react';

const WeatherWidget: React.FC = () => {
  const date = new Date().toLocaleDateString('gu-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const day = new Date().toLocaleDateString('gu-IN', { weekday: 'long' });

  return (
    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-5 text-white shadow-xl shadow-blue-200 relative overflow-hidden h-full flex flex-col justify-between group">
      {/* Background Decor */}
      <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
      <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-blue-400/20 rounded-full blur-2xl"></div>
      
      {/* Top: Location & Date */}
      <div className="relative z-10 flex justify-between items-start">
         <div>
            <div className="flex items-center gap-1 opacity-90">
                <svg className="w-3.5 h-3.5 text-blue-200" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                <p className="text-[10px] font-black uppercase tracking-widest">ભરાડા, ગુજરાત</p>
            </div>
            <p className="text-[10px] text-blue-100 mt-1 font-bold">{date}</p>
         </div>
         <div className="bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
             <p className="text-[10px] font-black uppercase tracking-tighter">{day}</p>
         </div>
      </div>

      {/* Bottom: Temp & Icon */}
      <div className="relative z-10 flex items-end justify-between mt-6">
          <div>
             <h2 className="text-4xl font-black tracking-tighter">34°</h2>
             <p className="text-[10px] text-blue-50 font-bold uppercase tracking-widest">ગરમ અને સૂકું</p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full"></div>
            <svg className="w-14 h-14 text-yellow-300 drop-shadow-2xl relative animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
