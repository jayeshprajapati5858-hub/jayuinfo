import React from 'react';

const WeatherWidget: React.FC = () => {
  // મૉક ડેટા (વાસ્તવિક API વગર)
  const date = new Date().toLocaleDateString('gu-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="bg-gradient-to-r from-sky-400 to-blue-600 rounded-xl p-5 text-white shadow-lg relative overflow-hidden border border-blue-300">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 -ml-4 -mb-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
      
      <div className="flex flex-col sm:flex-row justify-between items-center relative z-10 gap-4">
        
        {/* Left Side: Temp & Location */}
        <div className="flex items-center gap-4">
           {/* Weather Icon */}
           <div className="bg-white/20 backdrop-blur-md p-3 rounded-full shadow-inner">
              <svg className="w-10 h-10 text-yellow-300 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
           </div>
           
           <div>
             <div className="flex items-baseline gap-2">
                <h2 className="text-4xl font-bold drop-shadow-md">32°C</h2>
                <span className="text-lg font-medium opacity-90">ભરાડા</span>
             </div>
             <p className="text-blue-100 text-sm font-medium">{date}</p>
             <p className="text-xs text-blue-50 mt-1 bg-blue-800/30 px-2 py-0.5 rounded-full w-fit">આકાશ ચોખ્ખું છે</p>
           </div>
        </div>
        
        {/* Right Side: Details Grid */}
        <div className="grid grid-cols-3 gap-4 sm:gap-8 w-full sm:w-auto text-center border-t sm:border-t-0 sm:border-l border-white/20 pt-3 sm:pt-0 sm:pl-8">
           <div className="flex flex-col">
             <span className="text-[10px] uppercase tracking-wider text-blue-100">ભેજ</span>
             <span className="font-bold text-lg">45%</span>
           </div>
           <div className="flex flex-col">
             <span className="text-[10px] uppercase tracking-wider text-blue-100">પવન</span>
             <span className="font-bold text-lg">12 <span className="text-xs font-normal">km/h</span></span>
           </div>
           <div className="flex flex-col">
             <span className="text-[10px] uppercase tracking-wider text-blue-100">પીનકોડ</span>
             <span className="font-bold text-lg">363310</span>
           </div>
        </div>

      </div>
    </div>
  );
};

export default WeatherWidget;