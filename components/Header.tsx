import React, { useEffect, useState } from 'react';

interface HeaderProps {
  totalCount: number;
}

const Header: React.FC<HeaderProps> = ({ totalCount }) => {
  const [weather, setWeather] = useState<{ temp: number; code: number } | null>(null);
  const date = new Date().toLocaleDateString('gu-IN', { day: 'numeric', month: 'short' });

  useEffect(() => {
    // Coordinates for Pincode 363310 (Approx. Bharada/Dhrangadhra region: 22.99°N, 71.46°E)
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=22.99&longitude=71.46&current_weather=true'
        );
        const data = await response.json();
        if (data.current_weather) {
          setWeather({
            temp: data.current_weather.temperature,
            code: data.current_weather.weathercode,
          });
        }
      } catch (error) {
        console.error("Weather fetch failed:", error);
      }
    };

    fetchWeather();
  }, []);

  // Helper to map WMO codes to Gujarati description
  const getWeatherDescription = (code: number) => {
    if (code === 0) return 'ચોખ્ખું (Sunny)';
    if (code >= 1 && code <= 3) return 'વાદળછાયું (Cloudy)';
    if (code >= 45 && code <= 48) return 'ધૂમ્મસ (Fog)';
    if (code >= 51 && code <= 67) return 'વરસાદ (Rain)';
    if (code >= 80 && code <= 82) return 'ઝાપટાં (Showers)';
    if (code >= 95) return 'વાવાઝોડું (Storm)';
    return 'સામાન્ય';
  };

  return (
    <header className="bg-emerald-700 pt-3 pb-3 shadow-md relative z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Brand Section */}
          <div className="flex items-center gap-3">
             {/* Building Icon / Logo */}
            <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="text-left">
              <h1 className="text-lg sm:text-2xl font-bold text-white tracking-wide leading-tight">
                ભરાડા ગ્રામ પંચાયત
              </h1>
              <p className="text-emerald-100 text-[10px] font-medium uppercase tracking-widest opacity-80">
                ડિજિટલ પોર્ટલ
              </p>
            </div>
          </div>

          {/* Compact Live Weather Widget */}
          <div className="bg-emerald-800/60 rounded-lg px-3 py-1.5 border border-emerald-600/50 backdrop-blur-sm flex items-center gap-3 shadow-sm hover:bg-emerald-800/80 transition-colors cursor-pointer" title="આજનું લાઈવ હવામાન">
             <div className="text-yellow-300 bg-white/5 p-1 rounded-full">
                {/* Dynamic Icon based on simple logic, default to Sun */}
                {weather && weather.code > 3 ? (
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>
                ) : (
                   <svg className="w-6 h-6 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                )}
             </div>
             <div className="text-right">
                <div className="flex items-center justify-end gap-1 text-white">
                   <span className="font-bold text-lg leading-none">
                     {weather ? `${weather.temp}°C` : '--°C'}
                   </span>
                </div>
                <p className="text-[10px] text-emerald-100 font-medium whitespace-nowrap">
                   {date} • {weather ? getWeatherDescription(weather.code) : 'Loading...'}
                </p>
             </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;