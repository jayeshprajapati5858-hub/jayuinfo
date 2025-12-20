import React from 'react';

const PanchayatInfo: React.FC = () => {
  const officials = [
    {
      role: "સરપંચશ્રી (Sarpanch)",
      name: "શ્રી દિનેશભાઈ ભુવા",
      phone: "+919106162151",
      image: "https://ui-avatars.com/api/?name=Dinesh+Bhuva&background=fff7ed&color=c2410c&size=200&bold=true",
      theme: "orange"
    },
    {
      role: "તલાટી કમ મંત્રી (Talati)",
      name: "શ્રીમતી તેજલબેન",
      phone: "+919978424252",
      image: "https://ui-avatars.com/api/?name=Tejal+Ben&background=eff6ff&color=1d4ed8&size=200&bold=true",
      theme: "blue"
    },
    {
      role: "V.C.E. (Computer Operator)",
      name: "શ્રી જયેશભાઈ પ્રજાપતિ",
      phone: "+917990980744",
      image: "https://ui-avatars.com/api/?name=Jayesh+Prajapati&background=f0fdf4&color=15803d&size=200&bold=true",
      theme: "emerald"
    }
  ];

  const stats = [
    { label: "કુલ વસ્તી", value: "3,250", icon: "👥" },
    { label: "કુલ પરિવારો", value: "680", icon: "🏠" },
    { label: "વોર્ડ સંખ્યા", value: "12", icon: "📍" },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto pb-24 space-y-12">
      
      {/* 1. Premium Hero Header with Layered Depth */}
      <div className="relative">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#022c22] text-white shadow-2xl shadow-emerald-900/20 isolate">
          {/* Abstract Background Effects */}
          <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-emerald-500 rounded-full blur-[100px] opacity-20 mix-blend-screen"></div>
          <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-80 h-80 bg-teal-400 rounded-full blur-[100px] opacity-10 mix-blend-screen"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>

          <div className="relative z-10 px-6 py-12 sm:px-12 sm:py-16 text-center">
             {/* Official Emblem Icon */}
             <div className="mx-auto w-20 h-20 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 flex items-center justify-center mb-6 shadow-inner ring-1 ring-white/5">
                <svg className="w-10 h-10 text-emerald-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/></svg>
             </div>

             <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-3 font-['Noto_Sans_Gujarati'] bg-clip-text text-transparent bg-gradient-to-b from-white to-emerald-100">
               ભરાડા ગ્રામ પંચાયત
             </h1>
             <p className="text-emerald-200/80 text-sm font-bold tracking-[0.3em] uppercase mb-8">
               Bharada Gram Panchayat • Est. 1972
             </p>

             {/* Status Badge */}
             <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-semibold text-emerald-100 tracking-wide">કાર્યાલય સમય: 10:30 AM - 05:00 PM</span>
             </div>
          </div>
        </div>

        {/* Floating Stats - Layered on top of Hero */}
        <div className="px-4 sm:px-12 -mt-10 relative z-20">
           <div className="grid grid-cols-3 gap-3 sm:gap-6">
              {stats.map((stat, idx) => (
                 <div key={idx} className="bg-white rounded-2xl p-4 sm:p-6 shadow-xl shadow-gray-200/50 border border-white/50 backdrop-blur flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-transform duration-300">
                     <span className="text-2xl sm:text-3xl mb-2">{stat.icon}</span>
                     <span className="text-gray-900 font-black text-xl sm:text-2xl tracking-tight leading-none">{stat.value}</span>
                     <span className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">{stat.label}</span>
                 </div>
              ))}
           </div>
        </div>
      </div>

      {/* 2. Officials - ID Card Style Layout */}
      <div className="px-4 sm:px-6">
         <div className="flex items-end justify-between mb-8 border-b border-gray-200 pb-4">
            <div>
               <h2 className="text-2xl font-bold text-gray-900">પદાધિકારી શ્રી</h2>
               <p className="text-sm text-gray-500 mt-1">Village Administration Officials</p>
            </div>
            <div className="hidden sm:block text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              2024 - 2029 Term
            </div>
         </div>

         <div className="grid gap-8 md:grid-cols-3">
            {officials.map((official, idx) => (
               <div key={idx} className="group bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col overflow-hidden relative">
                  
                  {/* Decorative Header Background */}
                  <div className={`h-24 w-full bg-gradient-to-r ${
                    official.theme === 'orange' ? 'from-orange-50 to-amber-50' : 
                    official.theme === 'blue' ? 'from-blue-50 to-indigo-50' : 
                    'from-emerald-50 to-teal-50'
                  }`}>
                    {/* Abstract Pattern */}
                    <svg className="absolute top-0 right-0 opacity-10 w-32 h-32" viewBox="0 0 100 100" fill="currentColor">
                       <circle cx="100" cy="0" r="50" />
                    </svg>
                  </div>

                  {/* Content Container */}
                  <div className="px-6 pb-6 flex-1 flex flex-col relative">
                     {/* Avatar overlapping header */}
                     <div className="-mt-12 mb-4">
                        <img 
                          src={official.image} 
                          alt={official.name} 
                          className="w-24 h-24 rounded-2xl border-[6px] border-white shadow-md object-cover bg-white"
                        />
                     </div>
                     
                     {/* Text Info */}
                     <div className="mb-6">
                        <span className={`inline-block px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-2 ${
                           official.theme === 'orange' ? 'bg-orange-100 text-orange-700' :
                           official.theme === 'blue' ? 'bg-blue-100 text-blue-700' :
                           'bg-emerald-100 text-emerald-700'
                        }`}>
                           {official.role}
                        </span>
                        <h3 className="text-xl font-bold text-gray-900 leading-tight">{official.name}</h3>
                     </div>

                     {/* Action Buttons */}
                     <div className="mt-auto grid grid-cols-4 gap-2">
                        <a href={`tel:${official.phone}`} className="col-span-3 flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200">
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                           સંપર્ક કરો
                        </a>
                        <button 
                           onClick={() => { navigator.clipboard.writeText(official.phone); alert('નંબર કોપી કર્યો!'); }}
                           className="col-span-1 flex items-center justify-center bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
                        >
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                        </button>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* 3. Address & Map - Modern Split Card */}
      <div className="px-4 sm:px-6">
         <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-[2rem] p-2 border border-gray-200">
            <div className="bg-white rounded-[1.5rem] p-6 sm:p-8 flex flex-col md:flex-row gap-8 shadow-sm">
               
               {/* Info Side */}
               <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                     </div>
                     <h3 className="text-xl font-bold text-gray-900">સંપર્ક અને સરનામું</h3>
                  </div>
                  
                  <div className="pl-13 space-y-4">
                     <div className="space-y-1">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Postal Address</p>
                        <p className="text-gray-800 text-lg font-medium leading-relaxed">
                           ગ્રામ પંચાયત ભવન, મેઈન બજાર,<br />
                           બસ સ્ટેન્ડ પાસે, મુ. ભરાડા,<br />
                           તા. ધ્રાંગધ્રા, જી. સુરેન્દ્રનગર - ૩૬૩૩૧૦
                        </p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Support</p>
                        <a href="mailto:bharadapanchayat@gmail.com" className="text-emerald-600 font-bold hover:underline decoration-2 underline-offset-4">
                           bharadapanchayat@gmail.com
                        </a>
                     </div>
                  </div>
               </div>

               {/* Map Action Side */}
               <div className="flex-1">
                  <div 
                     onClick={() => window.open('https://maps.google.com/?q=Bharada,Gujarat', '_blank')}
                     className="h-full min-h-[200px] bg-[#f1f5f9] rounded-2xl border-2 border-dashed border-gray-300 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all cursor-pointer flex flex-col items-center justify-center group text-center p-6"
                  >
                     <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                     </div>
                     <h4 className="font-bold text-gray-900">Google Map પર જુઓ</h4>
                     <p className="text-sm text-gray-500 mt-1 max-w-[200px]">ગામનું લોકેશન અને રસ્તો જાણવા માટે અહીં ક્લિક કરો.</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
      
    </div>
  );
};

export default PanchayatInfo;