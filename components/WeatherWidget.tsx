import React from 'react';

const WeatherWidget: React.FC = () => {
  const date = new Date().toLocaleDateString('gu-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const day = new Date().toLocaleDateString('gu-IN', { weekday: 'long' });

  return (
    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-5 text-white shadow-xl shadow-blue-200 relative overflow-hidden h-full flex flex-col justify-between">
      {/* Background Decor */}
      <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-blue-400/20 rounded-full blur-2xl"></div>
      
      {/* Top: Location & Date */}
      <div className="relative z-10 flex justify-between items-start">
         <div>
            <div className="flex items-center gap-1 opacity-90">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                <p className="text-xs font-medium tracking-wide">ભરાડા, સુરેન્દ્રનગર</p>
            </div>
            <p className="text-[10px] text-blue-100 mt-1 font-medium">{date}</p>
         </div>
         <div className="bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg">
             <p className="text-xs font-bold">{day}</p>
         </div>
      </div>

      {/* Bottom: Temp & Icon */}
      <div className="relative z-10 flex items-end justify-between mt-4">
          <div>
             <h2 className="text-4xl font-bold tracking-tight">32°</h2>
             <p className="text-xs text-blue-100 font-medium">ચોખ્ખું આકાશ</p>
          </div>
          <svg className="w-12 h-12 text-yellow-300 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
      </div>
    </div>
  );
};

export default WeatherWidget;