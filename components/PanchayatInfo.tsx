import React from 'react';

const PanchayatInfo: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-8 relative z-20">
      <div className="bg-white rounded-xl shadow-lg border-t-4 border-emerald-600 overflow-hidden">
        
        {/* Header of the Card */}
        <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-emerald-900 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              ગ્રામ પંચાયત કાર્યાલય: ભરાડા
            </h2>
            <p className="text-emerald-600 text-xs font-semibold uppercase tracking-wider ml-8">
              Gram Panchayat Office: Bharada
            </p>
          </div>
          {/* Active Indicator */}
          <div className="hidden sm:flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-emerald-200 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-bold text-emerald-800">Office Open</span>
          </div>
        </div>

        {/* Officials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          
          {/* Sarpanch Info */}
          <div className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase">સરપંચશ્રી (Sarpanch)</p>
                <h3 className="font-bold text-gray-800">શ્રી દિનેશભાઈ ભુવા</h3>
              </div>
            </div>
            <a href="tel:+919106162151" className="text-xs text-gray-500 flex items-center gap-1 hover:text-emerald-600 ml-10">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              +91 91061 62151
            </a>
          </div>

          {/* Talati Info */}
          <div className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase">તલાટી કમ મંત્રી (Talati)</p>
                <h3 className="font-bold text-gray-800">શ્રીમતી તેજલબેન</h3>
              </div>
            </div>
            <a href="tel:+919978424252" className="text-xs text-gray-500 flex items-center gap-1 hover:text-emerald-600 ml-10">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              +91 99784 24252
            </a>
          </div>

          {/* VCE Info */}
          <div className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase">V.C.E. (Computer Op.)</p>
                <h3 className="font-bold text-gray-800">શ્રી જયેશભાઈ પ્રજાપતિ</h3>
              </div>
            </div>
            <a href="tel:+917990980744" className="text-xs text-emerald-700 font-bold flex items-center gap-1 hover:underline ml-10">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              +91 79909 80744
            </a>
          </div>

        </div>

        {/* Notice Board Section */}
        <div className="bg-yellow-50 px-6 py-3 border-t border-yellow-100">
          <div className="flex items-start gap-3">
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded animate-pulse mt-0.5">
              NOTICE
            </span>
            <div className="flex-1">
              <p className="text-sm text-yellow-900 font-medium">
                <span className="font-bold">સૂચના:</span> કૃષિ સહાય પેકેજની યાદી નીચે મુજબ છે. જે ખેડૂતોનું નામ યાદીમાં છે તેમણે તાત્કાલિક બેંક DBT ચાલુ કરાવા વિનંતી.
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                (Note: Farmers listed below are requested to enable Bank DBT immediately.)
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PanchayatInfo;