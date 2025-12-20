import React, { useState, useEffect } from 'react';

interface Bus {
  id: number;
  route: string;
  time: string;
  type: string;
  platform: string;
}

const initialBuses: Bus[] = [
  { id: 1, route: "ધ્રાંગધ્રા - અમદાવાદ (ગીતામંદિર)", time: "06:00 AM", type: "Express", platform: "2" },
  { id: 2, route: "ધ્રાંગધ્રા - હળવદ", time: "06:30 AM", type: "Local", platform: "4" },
  { id: 3, route: "ધ્રાંગધ્રા - સુરેન્દ્રનગર", time: "07:15 AM", type: "Express", platform: "1" },
  { id: 4, route: "ધ્રાંગધ્રા - ભરાડા (વાયા કોંડ)", time: "08:00 AM", type: "Local", platform: "5" },
  { id: 5, route: "ભરાડા - ધ્રાંગધ્રા", time: "09:30 AM", type: "Local", platform: "ગામ સ્ટેન્ડ" },
];

const BusSchedule: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for Buses
  const [buses, setBuses] = useState<Bus[]>(() => {
    const saved = localStorage.getItem('busSchedule');
    return saved ? JSON.parse(saved) : initialBuses;
  });

  // Admin State
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pin, setPin] = useState('');

  // Form State for new bus
  const [newRoute, setNewRoute] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newType, setNewType] = useState('Local');
  const [newPlatform, setNewPlatform] = useState('');

  useEffect(() => {
    localStorage.setItem('busSchedule', JSON.stringify(buses));
  }, [buses]);

  const handleLogin = () => {
    if (pin === '1234') {
      setIsAdmin(true);
      setShowLogin(false);
      setPin('');
    } else {
      alert('ખોટો પિન!');
    }
  };

  const handleDelete = (id: number) => {
    if(window.confirm('આ બસ ડિલીટ કરવી છે?')) {
        setBuses(buses.filter(b => b.id !== id));
    }
  };

  const handleAddBus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoute || !newTime) { alert('વિગતો ભરો'); return; }
    
    const newBus: Bus = {
      id: Date.now(),
      route: newRoute,
      time: newTime,
      type: newType,
      platform: newPlatform || '-'
    };
    
    setBuses([...buses, newBus]);
    setNewRoute('');
    setNewTime('');
    setNewPlatform('');
    alert('બસ ઉમેરાઈ ગઈ!');
  };

  const filteredBuses = buses.filter(bus => 
    bus.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-8 animate-fade-in pb-20">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-red-600 p-4 text-white flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
             <div className="bg-white/20 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
             </div>
             <div>
                <h2 className="text-xl font-bold">બસોનું સમય પત્રક</h2>
                <p className="text-red-100 text-xs">ધ્રાંગધ્રા ડેપો અને ગ્રામ્ય રૂટ</p>
             </div>
          </div>
          
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="બસ શોધો..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-10 pr-4 rounded-lg text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 shadow-inner"
            />
          </div>
        </div>

        {/* Bus Table */}
        <div className="overflow-x-auto">
          {filteredBuses.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">રૂટ (Route)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">સમય</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">પ્રકાર</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">પ્લેટફોર્મ</th>
                  {isAdmin && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBuses.map((bus) => (
                  <tr key={bus.id} className="hover:bg-red-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{bus.route}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-red-600 bg-red-50 px-2 py-1 rounded w-fit">{bus.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        bus.type === 'Express' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {bus.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {bus.platform}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleDelete(bus.id)} className="text-red-500 hover:text-red-700 bg-red-50 px-2 py-1 rounded">
                          ડિલીટ
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-gray-500">
              કોઈ બસ મળી નથી.
            </div>
          )}
        </div>
      </div>

      {/* Admin Panel */}
      <div className="mt-8 pt-4 border-t border-gray-200">
         {!isAdmin ? (
             <div className="flex justify-center">
                 {!showLogin ? (
                     <button onClick={() => setShowLogin(true)} className="text-xs text-gray-400 hover:text-gray-600">
                        Admin Login
                     </button>
                 ) : (
                     <div className="flex gap-2 bg-gray-100 p-2 rounded-lg">
                         <input type="password" value={pin} onChange={e => setPin(e.target.value)} placeholder="PIN (1234)" className="w-20 p-1 text-xs border rounded" />
                         <button onClick={handleLogin} className="bg-red-600 text-white text-xs px-2 rounded">OK</button>
                         <button onClick={() => setShowLogin(false)} className="text-gray-500 text-xs px-1">X</button>
                     </div>
                 )}
             </div>
         ) : (
             <div className="bg-gray-100 rounded-xl p-4 border border-gray-200">
                 <div className="flex justify-between items-center mb-4">
                     <h3 className="font-bold text-gray-700">નવી બસ ઉમેરો</h3>
                     <button onClick={() => setIsAdmin(false)} className="text-xs text-red-500">Logout</button>
                 </div>
                 <form onSubmit={handleAddBus} className="grid grid-cols-1 md:grid-cols-5 gap-3">
                     <input type="text" placeholder="રૂટ" value={newRoute} onChange={e => setNewRoute(e.target.value)} className="p-2 text-sm border rounded" required />
                     <input type="text" placeholder="સમય (e.g. 08:00 AM)" value={newTime} onChange={e => setNewTime(e.target.value)} className="p-2 text-sm border rounded" required />
                     <select value={newType} onChange={e => setNewType(e.target.value)} className="p-2 text-sm border rounded">
                         <option value="Local">Local</option>
                         <option value="Express">Express</option>
                     </select>
                     <input type="text" placeholder="પ્લેટફોર્મ" value={newPlatform} onChange={e => setNewPlatform(e.target.value)} className="p-2 text-sm border rounded" />
                     <button type="submit" className="bg-red-600 text-white p-2 rounded text-sm font-bold">ઉમેરો</button>
                 </form>
             </div>
         )}
      </div>
    </div>
  );
};

export default BusSchedule;