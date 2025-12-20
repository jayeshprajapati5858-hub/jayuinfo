import React from 'react';

const PanchayatInfo: React.FC = () => {
  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Header Image / Branding */}
        <div className="bg-emerald-600 h-24 relative overflow-hidden">
           <div className="absolute inset-0 bg-emerald-900/20"></div>
           <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
           <div className="absolute top-4 left-6 text-white z-10">
              <h3 className="text-xl font-bold">ભરાડા ગ્રામ પંચાયત</h3>
              <p className="text-emerald-100 text-xs uppercase tracking-widest opacity-80">Bharada Gram Panchayat</p>
           </div>
        </div>

        {/* Officials List */}
        <div className="divide-y divide-gray-100">
          
          {/* Sarpanch */}
          <div className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">S</div>
                <div>
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">સરપંચશ્રી</p>
                   <h4 className="text-base font-bold text-gray-900">શ્રી દિનેશભાઈ ભુવા</h4>
                </div>
             </div>
             <a href="tel:+919106162151" className="bg-emerald-50 text-emerald-600 p-2 rounded-full hover:bg-emerald-600 hover:text-white transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
             </a>
          </div>

          {/* Talati */}
          <div className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">T</div>
                <div>
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">તલાટી કમ મંત્રી</p>
                   <h4 className="text-base font-bold text-gray-900">શ્રીમતી તેજલબેન</h4>
                </div>
             </div>
             <a href="tel:+919978424252" className="bg-emerald-50 text-emerald-600 p-2 rounded-full hover:bg-emerald-600 hover:text-white transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
             </a>
          </div>

          {/* VCE */}
          <div className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">V</div>
                <div>
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">V.C.E. (કોમ્પ્યુટર)</p>
                   <h4 className="text-base font-bold text-gray-900">શ્રી જયેશભાઈ પ્રજાપતિ</h4>
                </div>
             </div>
             <a href="tel:+917990980744" className="bg-emerald-50 text-emerald-600 p-2 rounded-full hover:bg-emerald-600 hover:text-white transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
             </a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PanchayatInfo;