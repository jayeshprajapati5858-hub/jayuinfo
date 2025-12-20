import React, { useState, useEffect } from 'react';

interface Rate {
  id: number;
  crop: string;
  min: number;
  max: number;
  trend: 'up' | 'down' | 'neutral';
}

const initialRates: Rate[] = [
  { id: 1, crop: "કપાસ (Cotton)", min: 1450, max: 1780, trend: 'up' },
  { id: 2, crop: "જીરું (Cumin)", min: 5800, max: 6450, trend: 'down' },
  { id: 3, crop: "વરિયાળી (Fennel)", min: 1800, max: 2200, trend: 'neutral' },
  { id: 4, crop: "એરંડા (Castor)", min: 1180, max: 1240, trend: 'up' },
  { id: 5, crop: "ઘઉં (Wheat)", min: 480, max: 560, trend: 'neutral' },
  { id: 6, crop: "બાજરી (Millet)", min: 420, max: 490, trend: 'up' },
  { id: 7, crop: "તલ (Sesame)", min: 2300, max: 2750, trend: 'up' },
  { id: 8, crop: "ચણા (Gram)", min: 950, max: 1100, trend: 'down' },
  { id: 9, crop: "મગફળી (Groundnut)", min: 1150, max: 1400, trend: 'neutral' },
];

const MarketRates: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for Rates & Last Updated Date
  const [rates, setRates] = useState<Rate[]>(() => {
    const saved = localStorage.getItem('marketRates');
    return saved ? JSON.parse(saved) : initialRates;
  });
  
  const [lastUpdated, setLastUpdated] = useState<string>(() => {
    return localStorage.getItem('marketDate') || new Date().toLocaleDateString('gu-IN');
  });

  // Admin State
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pin, setPin] = useState('');

  // Save to LocalStorage whenever rates change
  useEffect(() => {
    localStorage.setItem('marketRates', JSON.stringify(rates));
  }, [rates]);

  useEffect(() => {
    localStorage.setItem('marketDate', lastUpdated);
  }, [lastUpdated]);

  const handleLogin = () => {
    if (pin === '1234') {
      setIsAdmin(true);
      setShowLogin(false);
      setPin('');
    } else {
      alert('ખોટો પિન!');
    }
  };

  const handleRateChange = (id: number, field: keyof Rate, value: any) => {
    const updatedRates = rates.map(rate => 
      rate.id === id ? { ...rate, [field]: value } : rate
    );
    setRates(updatedRates);
    // Auto update date when data changes
    setLastUpdated(new Date().toLocaleDateString('gu-IN'));
  };

  const filteredRates = rates.filter(item => 
    item.crop.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-8 animate-fade-in pb-20">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-4 text-white flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
             <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
             </div>
             <div>
                <h2 className="text-xl font-bold">APMC ધ્રાંગધ્રા</h2>
                <div className="flex items-center gap-2">
                    <p className="text-green-100 text-xs">છેલ્લું અપડેટ: {lastUpdated}</p>
                    {isAdmin && (
                        <button 
                            onClick={() => setLastUpdated(new Date().toLocaleDateString('gu-IN'))}
                            className="text-[10px] bg-green-800 px-2 rounded hover:bg-green-900"
                        >
                            તારીખ બદલો (આજની)
                        </button>
                    )}
                </div>
             </div>
          </div>
          
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="પાક શોધો..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-10 pr-4 rounded-lg text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 shadow-inner"
            />
            <svg className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Rates Grid */}
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRates.map((item) => (
              <div key={item.id} className={`border rounded-lg p-4 transition-shadow bg-gray-50 relative overflow-hidden group ${isAdmin ? 'border-blue-300 ring-2 ring-blue-100' : 'border-gray-100 hover:shadow-md'}`}>
                
                {/* Header Section */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{item.crop}</h3>
                    <p className="text-xs text-gray-500">પ્રતિ 20 કિલો (મણ)</p>
                  </div>
                  
                  {/* Trend Icon (Editable or View) */}
                  {isAdmin ? (
                      <select 
                        value={item.trend}
                        onChange={(e) => handleRateChange(item.id, 'trend', e.target.value)}
                        className="text-xs border rounded bg-white p-1"
                      >
                          <option value="up">તેજી (Up)</option>
                          <option value="down">મંદી (Down)</option>
                          <option value="neutral">સરખા (Same)</option>
                      </select>
                  ) : (
                      <div className={`p-1.5 rounded-full ${item.trend === 'up' ? 'bg-green-100 text-green-600' : item.trend === 'down' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                        {item.trend === 'up' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
                        {item.trend === 'down' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>}
                        {item.trend === 'neutral' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>}
                      </div>
                  )}
                </div>
                
                {/* Price Section */}
                <div className="flex items-end justify-between">
                   <div className="w-1/2 pr-2">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider">નીચો ભાવ</span>
                      {isAdmin ? (
                          <input 
                            type="number" 
                            value={item.min}
                            onChange={(e) => handleRateChange(item.id, 'min', parseInt(e.target.value))}
                            className="w-full text-lg font-semibold text-gray-600 border-b border-gray-300 focus:border-blue-500 outline-none bg-transparent"
                          />
                      ) : (
                          <p className="text-lg font-semibold text-gray-600">₹{item.min}</p>
                      )}
                   </div>
                   <div className="w-1/2 pl-2 text-right">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider">ઊંચો ભાવ</span>
                      {isAdmin ? (
                          <input 
                            type="number" 
                            value={item.max}
                            onChange={(e) => handleRateChange(item.id, 'max', parseInt(e.target.value))}
                            className="w-full text-xl font-bold text-gray-800 border-b border-gray-300 focus:border-blue-500 outline-none bg-transparent text-right"
                          />
                      ) : (
                          <p className={`text-xl font-bold ${item.trend === 'up' ? 'text-green-600' : 'text-gray-800'}`}>₹{item.max}</p>
                      )}
                   </div>
                </div>
              </div>
            ))}
        </div>

        <div className="bg-yellow-50 p-3 text-center text-xs text-yellow-800 border-t border-yellow-100 flex items-center justify-center gap-2">
           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
           નોંધ: આ ભાવ APMC ધ્રાંગધ્રા મુજબ રોજ સવારે અપડેટ કરવામાં આવે છે.
        </div>
      </div>

      {/* Admin Login Toggle - Bottom Right */}
      <div className="mt-8 flex justify-center">
         {!isAdmin ? (
             !showLogin ? (
                 <button onClick={() => setShowLogin(true)} className="text-xs text-gray-400 hover:text-gray-600 underline">
                    ભાવ અપડેટ કરવા માટે (Admin)
                 </button>
             ) : (
                 <div className="flex gap-2 items-center bg-gray-100 p-2 rounded-lg shadow-inner">
                     <span className="text-xs text-gray-500">PIN:</span>
                     <input 
                        type="password" 
                        value={pin}
                        onChange={e => setPin(e.target.value)}
                        className="w-16 p-1 text-sm border rounded focus:ring-1 focus:ring-green-500 outline-none"
                     />
                     <button onClick={handleLogin} className="bg-green-600 text-white text-xs px-3 py-1.5 rounded hover:bg-green-700">Login</button>
                     <button onClick={() => setShowLogin(false)} className="text-gray-400 px-2">X</button>
                 </div>
             )
         ) : (
             <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 border border-blue-200">
                 <span>એડમિન મોડ ચાલુ છે (ભાવ બદલી શકાય છે)</span>
                 <button onClick={() => setIsAdmin(false)} className="bg-blue-200 hover:bg-blue-300 px-2 py-0.5 rounded text-blue-800 ml-2">
                    Logout
                 </button>
             </div>
         )}
      </div>
    </div>
  );
};

export default MarketRates;