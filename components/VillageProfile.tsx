import React, { useState } from 'react';

const VillageProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'history' | 'temples' | 'stats'>('history');

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-8 animate-fade-in pb-20">
      
      {/* Title Section with Background */}
      <div className="relative rounded-3xl overflow-hidden bg-gray-900 text-white shadow-xl mb-6 min-h-[180px] flex items-end">
         <img 
            src="https://images.unsplash.com/photo-1518182170546-0766ce6fec56?auto=format&fit=crop&q=80&w=800&h=400" 
            alt="Village Panorama" 
            className="absolute inset-0 w-full h-full object-cover opacity-40"
         />
         <div className="relative z-10 p-6 w-full bg-gradient-to-t from-black/90 to-transparent">
            <h1 className="text-3xl font-bold mb-1">મારું ગામ: ભરાડા</h1>
            <p className="text-gray-300 text-sm">તા. ધ્રાંગધ્રા | જિ. સુરેન્દ્રનગર | સ્થાપના: સંવત ૧૯૨૦</p>
         </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-4">
        {[
            { id: 'history', label: 'ઇતિહાસ', icon: '📜' },
            { id: 'temples', label: 'ધાર્મિક સ્થળો', icon: '🛕' },
            { id: 'stats', label: 'વસ્તી વિષયક', icon: '📊' }
        ].map(tab => (
            <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    activeTab === tab.id 
                    ? 'bg-emerald-800 text-white shadow-lg' 
                    : 'bg-white text-gray-600 border border-gray-200'
                }`}
            >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
            </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[300px]">
        
        {activeTab === 'history' && (
            <div className="animate-fade-in">
                <h3 className="text-xl font-bold text-gray-800 mb-4">ગામનો ઈતિહાસ</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                    ભરાડા ગામનો ઈતિહાસ ખૂબ જ જૂનો અને ભવ્ય છે. લોકવાયકા મુજબ આ ગામની સ્થાપના વિક્રમ સંવત ૧૯૨૦ ની આસપાસ થઈ હતી. 
                    શરૂઆતમાં અહીં માત્ર થોડા ખોરડા હતા, પરંતુ ધીરે ધીરે વસ્તી વધતા એક સમૃદ્ધ ગામ બન્યું.
                </p>
                <p className="text-gray-600 leading-relaxed">
                    ગામનું નામ 'ભરાડા' પડવા પાછળ એક દંતકથા છે કે અહીંના પાદરમાં પક્ષીઓના કલરવને કારણે આ નામ પડ્યું હોઈ શકે. 
                    ગામના લોકો મુખ્યત્વે ખેતી અને પશુપાલન સાથે સંકળાયેલા છે.
                </p>
            </div>
        )}

        {activeTab === 'temples' && (
            <div className="animate-fade-in space-y-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4">ધાર્મિક સ્થળો</h3>
                {[
                    { name: 'શ્રી રામજી મંદિર', desc: 'ગામના ચોકમાં આવેલું ભવ્ય મંદિર.' },
                    { name: 'શ્રી મહાદેવ મંદિર', desc: 'પાદરમાં આવેલું શાંતિપૂર્ણ શિવાલય.' },
                    { name: 'મેલડી માતાજીનું મંદિર', desc: 'ગામની સુરક્ષા કરતા માતાજીનું સ્થાનક.' }
                ].map((t, i) => (
                    <div key={i} className="flex gap-4 p-4 bg-orange-50 rounded-xl border border-orange-100">
                        <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center text-2xl">🛕</div>
                        <div>
                            <h4 className="font-bold text-gray-800">{t.name}</h4>
                            <p className="text-sm text-gray-600">{t.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {activeTab === 'stats' && (
            <div className="animate-fade-in">
                <h3 className="text-xl font-bold text-gray-800 mb-6">વસ્તી અને આંકડા</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="p-4 bg-blue-50 rounded-xl">
                        <p className="text-2xl font-bold text-blue-700">૩,૨૫૦</p>
                        <p className="text-xs text-gray-500 uppercase">કુલ વસ્તી</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-xl">
                        <p className="text-2xl font-bold text-green-700">૬૮૦</p>
                        <p className="text-xs text-gray-500 uppercase">ઘર સંખ્યા</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-xl">
                        <p className="text-2xl font-bold text-purple-700">૮૫%</p>
                        <p className="text-xs text-gray-500 uppercase">સાક્ષરતા</p>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-xl">
                        <p className="text-2xl font-bold text-yellow-700">૧,૫૦૦+</p>
                        <p className="text-xs text-gray-500 uppercase">પશુધન</p>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default VillageProfile;