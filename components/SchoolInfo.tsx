import React from 'react';

const SchoolInfo: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-8 animate-fade-in pb-20">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl overflow-hidden text-white relative mb-8">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
        <div className="p-6 relative z-10">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold mb-1">શ્રી ભરાડા પ્રાથમિક શાળા</h1>
                    <p className="text-blue-100 text-sm">સ્થાપના: ૧૯૬૫ | જિ.પં. શિક્ષણ સમિતિ સંચાલિત</p>
                </div>
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                    <svg className="w-8 h-8 text-yellow-300" fill="currentColor" viewBox="0 0 20 20"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" /></svg>
                </div>
            </div>
            
            <div className="mt-6 grid grid-cols-3 gap-4 border-t border-white/20 pt-4">
                <div className="text-center">
                    <span className="block text-2xl font-bold">૩૫૦+</span>
                    <span className="text-[10px] text-blue-200 uppercase tracking-wider">વિદ્યાર્થીઓ</span>
                </div>
                <div className="text-center border-l border-white/20">
                    <span className="block text-2xl font-bold">૧૨</span>
                    <span className="text-[10px] text-blue-200 uppercase tracking-wider">શિક્ષકો</span>
                </div>
                <div className="text-center border-l border-white/20">
                    <span className="block text-2xl font-bold">૧ થી ૮</span>
                    <span className="text-[10px] text-blue-200 uppercase tracking-wider">ધોરણ</span>
                </div>
            </div>
        </div>
      </div>

      {/* Principal Contact */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4 mb-6">
         <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl">👨‍🏫</div>
         <div className="flex-1">
             <p className="text-xs text-indigo-600 font-bold uppercase">આચાર્ય શ્રી</p>
             <h3 className="text-lg font-bold text-gray-800">મહેશભાઈ પટેલ</h3>
             <a href="tel:+919988776655" className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                 +91 99887 76655
             </a>
         </div>
      </div>

      {/* Useful Links Grid */}
      <h3 className="text-lg font-bold text-gray-800 mb-4">ઉપયોગી લિંક્સ</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="#" className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
              <div className="bg-green-100 p-3 rounded-lg text-green-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <div>
                  <h4 className="font-bold text-gray-800">પરિણામ જુઓ</h4>
                  <p className="text-xs text-gray-500">વાર્ષિક પરીક્ષાનું રિઝલ્ટ</p>
              </div>
          </a>
          
          <a href="https://rte.orpgujarat.com/" target="_blank" className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
              <div className="bg-purple-100 p-3 rounded-lg text-purple-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
              </div>
              <div>
                  <h4 className="font-bold text-gray-800">RTE પ્રવેશ</h4>
                  <p className="text-xs text-gray-500">મફત શિક્ષણ યોજના</p>
              </div>
          </a>
          
          <a href="#" className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
              <div className="bg-orange-100 p-3 rounded-lg text-orange-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </div>
              <div>
                  <h4 className="font-bold text-gray-800">રજા લિસ્ટ</h4>
                  <p className="text-xs text-gray-500">જાહેર રજાઓની યાદી</p>
              </div>
          </a>
      </div>

      <div className="mt-6 bg-yellow-50 p-4 rounded-xl border border-yellow-200 text-sm text-yellow-800 flex gap-3">
          <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
          <p><strong>સૂચના:</strong> ધોરણ ૧ માં પ્રવેશ માટે જન્મનો દાખલો અને આધાર કાર્ડ લાવવું ફરજિયાત છે.</p>
      </div>

    </div>
  );
};

export default SchoolInfo;