import React, { useState, useEffect } from 'react';

interface Business {
  id: number;
  name: string;
  category: 'kirana' | 'agro' | 'service' | 'food' | 'transport' | 'other';
  owner: string;
  mobile: string;
  details: string;
}

const initialBusinesses: Business[] = [
  { id: 1, name: "શ્રી રામ પ્રોવિઝન સ્ટોર", category: "kirana", owner: "પટેલ રમેશભાઈ", mobile: "9876543210", details: "કરિયાણું, દૂધ, છાસ અને ડેરી પ્રોડક્ટ્સ મળશે." },
  { id: 2, name: "કિસાન એગ્રો સેન્ટર", category: "agro", owner: "ચૌધરી ભીખાભાઈ", mobile: "9988776655", details: "ખાતર, બિયારણ અને ખેતીની દવાઓ." },
  { id: 3, name: "જય ભવાની હેર સલૂન", category: "service", owner: "વાલંદ સુરેશભાઈ", mobile: "9123456780", details: "પુરુષો માટે હેર કટિંગ અને શેવિંગ." },
  { id: 4, name: "મા ચામુંડા ઓટો ગેરેજ", category: "service", owner: "મિશ્રા સુનિલ", mobile: "8899001122", details: "બાઈક રિપેરિંગ અને પંચર." },
  { id: 5, name: "શિવ શક્તિ લોટ દળવાની ઘંટી", category: "service", owner: "ઠાકોર રાજુભા", mobile: "7766554433", details: "ઘઉં, બાજરી દળવા માટે." },
  { id: 6, name: "મેલડી કૃપા છકડો રીક્ષા", category: "transport", owner: "ભરવાડ લાલાભાઈ", mobile: "9900990099", details: "ભાડે ફરવા માટે રીક્ષા મળશે." }
];

const BusinessDirectory: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>(() => {
    const saved = localStorage.getItem('villageBusinesses');
    return saved ? JSON.parse(saved) : initialBusinesses;
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);

  // Admin State
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pin, setPin] = useState('');

  // Form State
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<'kirana' | 'agro' | 'service' | 'food' | 'transport' | 'other'>('kirana');
  const [newOwner, setNewOwner] = useState('');
  const [newMobile, setNewMobile] = useState('');
  const [newDetails, setNewDetails] = useState('');

  useEffect(() => {
    localStorage.setItem('villageBusinesses', JSON.stringify(businesses));
  }, [businesses]);

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
    if (window.confirm('આ માહિતી ડિલીટ કરવી છે?')) {
      setBusinesses(businesses.filter(b => b.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBusiness: Business = {
      id: Date.now(),
      name: newName,
      category: newCategory,
      owner: newOwner,
      mobile: newMobile,
      details: newDetails
    };

    setBusinesses([newBusiness, ...businesses]);
    setShowForm(false);
    
    // Reset
    setNewName('');
    setNewOwner('');
    setNewMobile('');
    setNewDetails('');
    
    alert('દુકાન ઉમેરાઈ ગઈ છે!');
  };

  const categories = [
      { id: 'all', label: 'બધું', icon: '🔍' },
      { id: 'kirana', label: 'કરિયાણું', icon: '🛒' },
      { id: 'agro', label: 'ખેતીવાડી', icon: '🌱' },
      { id: 'service', label: 'સર્વિસ', icon: '🛠️' },
      { id: 'transport', label: 'વાહન', icon: '🛺' },
      { id: 'food', label: 'નાસ્તો', icon: '🍲' },
  ];

  const filteredBusinesses = businesses.filter(b => {
      const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            b.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            b.details.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || b.category === selectedCategory;
      return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-8 animate-fade-in pb-20">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
           <h2 className="text-xl font-bold text-gray-800">ગામનો વેપાર (Business)</h2>
           <p className="text-xs text-gray-500">દુકાનો અને કારીગરોની યાદી</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md hover:bg-indigo-700 transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          ઉમેરો
        </button>
      </div>

      {/* Search & Filter */}
      <div className="mb-6 space-y-4">
          <div className="relative">
              <input 
                 type="text" 
                 placeholder="દુકાન કે નામ શોધો..." 
                 value={searchTerm}
                 onChange={e => setSearchTerm(e.target.value)}
                 className="w-full p-3 pl-10 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                        selectedCategory === cat.id 
                        ? 'bg-gray-800 text-white shadow-lg' 
                        : 'bg-white text-gray-600 border border-gray-200'
                    }`}
                  >
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                  </button>
              ))}
          </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {filteredBusinesses.length === 0 ? (
             <div className="col-span-full text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                 <p className="text-gray-400">કોઈ માહિતી મળી નથી.</p>
             </div>
         ) : (
             filteredBusinesses.map(item => (
                 <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 relative overflow-hidden group hover:shadow-md transition-shadow">
                     {/* Category Color Strip */}
                     <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                         item.category === 'kirana' ? 'bg-orange-500' :
                         item.category === 'agro' ? 'bg-green-500' :
                         item.category === 'service' ? 'bg-blue-500' :
                         'bg-gray-500'
                     }`}></div>

                     {/* Icon */}
                     <div className={`w-12 h-12 rounded-full flex shrink-0 items-center justify-center text-xl ${
                         item.category === 'kirana' ? 'bg-orange-50 text-orange-600' :
                         item.category === 'agro' ? 'bg-green-50 text-green-600' :
                         item.category === 'service' ? 'bg-blue-50 text-blue-600' :
                         'bg-gray-50 text-gray-600'
                     }`}>
                         {item.category === 'kirana' && '🛒'}
                         {item.category === 'agro' && '🌱'}
                         {item.category === 'service' && '🛠️'}
                         {item.category === 'transport' && '🛺'}
                         {item.category === 'food' && '🍲'}
                         {item.category === 'other' && '📦'}
                     </div>

                     <div className="flex-1">
                         <div className="flex justify-between items-start">
                             <h3 className="font-bold text-gray-800 leading-tight">{item.name}</h3>
                             {isAdmin && (
                                 <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-600 bg-red-50 p-1 rounded">
                                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                 </button>
                             )}
                         </div>
                         <p className="text-xs text-gray-500 font-bold mb-1">{item.owner}</p>
                         <p className="text-sm text-gray-600 mb-3 leading-snug">{item.details}</p>
                         
                         <a href={`tel:${item.mobile}`} className="inline-flex items-center gap-2 bg-gray-50 text-gray-800 px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 hover:bg-gray-100">
                             <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                             {item.mobile}
                         </a>
                     </div>
                 </div>
             ))
         )}
      </div>

      {/* Admin Panel Toggle */}
      <div className="mt-8 pt-4 border-t border-gray-200 text-center">
          {!isAdmin ? (
             <div className="flex justify-center">
                 {!showLogin ? (
                     <button onClick={() => setShowLogin(true)} className="text-xs text-gray-400 hover:text-gray-600">
                        Admin Login
                     </button>
                 ) : (
                     <div className="flex gap-2 bg-gray-100 p-2 rounded-lg">
                         <input type="password" value={pin} onChange={e => setPin(e.target.value)} placeholder="PIN" className="w-20 p-1 text-xs border rounded" />
                         <button onClick={handleLogin} className="bg-indigo-600 text-white text-xs px-2 rounded">OK</button>
                         <button onClick={() => setShowLogin(false)} className="text-gray-500 text-xs px-1">X</button>
                     </div>
                 )}
             </div>
          ) : (
             <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-left">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-700">એડમિન કંટ્રોલ: નવી દુકાન ઉમેરો</h3>
                    <button onClick={() => setIsAdmin(false)} className="text-xs text-red-500">Logout</button>
                 </div>
                 {/* This section would just open the modal normally, but here we can keep it simple or remove since the top button works */}
                 <p className="text-xs text-gray-500">દુકાન ઉમેરવા માટે ઉપરનું "ઉમેરો" બટન વાપરો. ડિલીટ કરવા માટે દુકાનના કાર્ડમાં લાલ બટન દબાવો.</p>
             </div>
          )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-800">નવી દુકાન ઉમેરો</h3>
                    <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="દુકાનનું નામ" value={newName} onChange={e => setNewName(e.target.value)} className="w-full p-2 border rounded" required />
                    <select value={newCategory} onChange={e => setNewCategory(e.target.value as any)} className="w-full p-2 border rounded">
                        <option value="kirana">કરિયાણું (Kirana)</option>
                        <option value="agro">ખેતીવાડી (Agro)</option>
                        <option value="service">સર્વિસ / રિપેરિંગ</option>
                        <option value="transport">વાહન / રીક્ષા</option>
                        <option value="food">નાસ્તો / હોટેલ</option>
                    </select>
                    <input type="text" placeholder="માલિકનું નામ" value={newOwner} onChange={e => setNewOwner(e.target.value)} className="w-full p-2 border rounded" required />
                    <input type="tel" placeholder="મોબાઈલ નંબર" value={newMobile} onChange={e => setNewMobile(e.target.value)} className="w-full p-2 border rounded" required />
                    <textarea placeholder="વિગત (શું મળશે?)" value={newDetails} onChange={e => setNewDetails(e.target.value)} className="w-full p-2 border rounded" required />
                    
                    <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded font-bold">સબમિટ</button>
                </form>
            </div>
        </div>
      )}

    </div>
  );
};

export default BusinessDirectory;