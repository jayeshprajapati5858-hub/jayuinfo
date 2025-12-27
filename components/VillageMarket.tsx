import React, { useState, useEffect } from 'react';

interface MarketItem {
  id: number;
  category: 'livestock' | 'vehicle' | 'tools' | 'other';
  title: string;
  price: string;
  description: string;
  owner_name: string;
  mobile: string;
  date_str: string;
}

const initialMarketData: MarketItem[] = [
  {
    id: 1, category: 'livestock', title: 'ગીર ગાય વેચવાની છે', price: '35000', description: 'પહેલું વેતર, ૮ લીટર દૂધ.', owner_name: 'રણછોડભાઈ', mobile: '9988776655', date_str: '25/05/2024'
  },
  {
    id: 2, category: 'vehicle', title: 'જુનું ટ્રેક્ટર (Mahindra)', price: '250000', description: '2015 મોડલ, સારી કન્ડિશનમાં.', owner_name: 'કાનજીભાઈ', mobile: '9876543210', date_str: '24/05/2024'
  }
];

const VillageMarket: React.FC = () => {
  const [items, setItems] = useState<MarketItem[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'livestock' | 'vehicle' | 'tools' | 'other'>('all');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Admin Controls
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pin, setPin] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'livestock' | 'vehicle' | 'tools' | 'other'>('livestock');
  const [price, setPrice] = useState('');
  const [desc, setDesc] = useState('');
  const [owner, setOwner] = useState('');
  const [mobile, setMobile] = useState('');

  useEffect(() => {
    // Load Local Data
    const saved = localStorage.getItem('local_market');
    if (saved) {
        setItems(JSON.parse(saved));
    } else {
        setItems(initialMarketData);
        localStorage.setItem('local_market', JSON.stringify(initialMarketData));
    }
    setLoading(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234') { setIsAdmin(true); setShowLogin(false); setPin(''); } 
    else { alert('ખોટો પિન!'); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: MarketItem = {
      id: Date.now(),
      category, title, price, description: desc, owner_name: owner, mobile, date_str: new Date().toLocaleDateString('gu-IN')
    };
    
    const updated = [newItem, ...items];
    setItems(updated);
    localStorage.setItem('local_market', JSON.stringify(updated));
    
    setShowForm(false);
    resetForm();
    alert('તમારી જાહેરાત સફળતાપૂર્વક મુકાઈ ગઈ છે (Local Mode)!');
  };

  const resetForm = () => { setTitle(''); setPrice(''); setDesc(''); setOwner(''); setMobile(''); };

  const handleDelete = (id: number) => {
    if(confirm('આ જાહેરાત કાઢી નાખવી છે?')) {
      const updated = items.filter(i => i.id !== id);
      setItems(updated);
      localStorage.setItem('local_market', JSON.stringify(updated));
    }
  };

  const filteredItems = items.filter(i => activeTab === 'all' || i.category === activeTab);

  const getCategoryLabel = (cat: string) => {
    switch(cat) {
      case 'livestock': return 'પશુધન';
      case 'vehicle': return 'વાહન';
      case 'tools': return 'ઓજારો';
      default: return 'અન્ય';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 animate-fade-in pb-20">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-black text-gray-900 leading-none">ગ્રામ્ય હાટ (Market)</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Village Buy & Sell Portal</p>
        </div>
        <button onClick={() => setShowForm(true)} className="bg-amber-600 text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-xl shadow-amber-100 active:scale-95 transition-all">
          વસ્તુ વેચો +
        </button>
      </div>

      {/* Categories Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-6 no-scrollbar">
        {['all', 'livestock', 'vehicle', 'tools', 'other'].map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab as any)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
              activeTab === tab ? 'bg-gray-900 text-white border-gray-900 shadow-lg' : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'
            }`}
          >
            {tab === 'all' ? 'બધું' : getCategoryLabel(tab)}
          </button>
        ))}
      </div>

      {/* Market Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {loading ? <div className="col-span-full text-center py-20 opacity-30">લોડિંગ...</div> : 
         filteredItems.length === 0 ? <div className="col-span-full text-center py-20 text-gray-400">અત્યારે કોઈ જાહેરાત નથી.</div> :
         filteredItems.map(item => (
          <div key={item.id} className="bg-white rounded-[2rem] border border-gray-50 shadow-sm hover:shadow-xl transition-all duration-300 p-6 flex flex-col group relative">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-amber-50 text-amber-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                {getCategoryLabel(item.category)}
              </span>
              <span className="text-[10px] text-gray-300 font-bold">{item.date_str}</span>
            </div>
            
            <h3 className="text-lg font-black text-gray-900 mb-1 leading-tight">{item.title}</h3>
            <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">{item.description}</p>
            
            <div className="bg-gray-50 rounded-2xl p-4 mb-5 flex justify-between items-center">
              <div>
                <p className="text-[9px] text-gray-400 font-black uppercase">અંદાજિત કિંમત</p>
                <p className="text-xl font-black text-emerald-600">₹{item.price}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-gray-400 font-black uppercase">માલિક</p>
                <p className="text-xs font-bold text-gray-800">{item.owner_name}</p>
              </div>
            </div>

            <div className="mt-auto flex gap-2">
              <a href={`tel:${item.mobile}`} className="flex-1 bg-gray-900 text-white py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-gray-800 active:scale-95 transition-all shadow-lg shadow-gray-100">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeWidth="2.5"/></svg>
                ફોન કરો
              </a>
              <a href={`https://wa.me/91${item.mobile}?text=${encodeURIComponent('નમસ્કાર, મેં ભરાડા પંચાયત એપ પર તમારી *' + item.title + '* ની જાહેરાત જોઈ. મને તેના વિશે વધુ માહિતી આપશો?')}`} target="_blank" className="bg-green-50 text-green-600 p-3 rounded-2xl hover:bg-green-100 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.18-.573c.978.539 2.027.823 3.151.824h.001c3.181 0 5.767-2.586 5.768-5.766.001-3.18-2.585-5.766-5.77-5.766zm3.364 8.162c-.149.418-.752.766-1.04.811-.273.045-.615.084-1.017-.046-.248-.08-.57-.183-.93-.339-1.536-.653-2.531-2.204-2.607-2.305-.075-.1-.615-.818-.615-1.56s.385-1.104.52-1.254c.135-.15.295-.187.393-.187.098 0 .196.001.282.005.089.004.21-.034.328.254.122.296.417 1.015.453 1.09.036.075.059.163.009.263-.05.1-.075.163-.149.251-.075.088-.158.196-.225.263-.075.075-.153.157-.066.307.086.15.383.633.821 1.023.565.503 1.041.659 1.191.734.15.075.238.063.326-.038.088-.1.376-.438.476-.588.1-.15.2-.125.338-.075.138.05.875.413 1.025.488s.25.113.288.175c.037.062.037.359-.112.777z"/></svg>
              </a>
            </div>

            {isAdmin && (
              <button onClick={() => handleDelete(item.id)} className="absolute -top-2 -right-2 bg-red-500 text-white w-8 h-8 rounded-full shadow-lg flex items-center justify-center font-bold text-xs hover:scale-110 transition-transform">
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Admin Login Toggle (hidden at bottom) */}
      <div className="mt-20 text-center">
        {!isAdmin ? (
          !showLogin ? <button onClick={() => setShowLogin(true)} className="text-[10px] text-gray-200">Admin Login</button> :
          <div className="flex justify-center gap-2"><input type="password" value={pin} onChange={e => setPin(e.target.value)} className="border p-1 text-xs" /><button onClick={handleLogin} className="bg-amber-600 text-white px-2 text-xs">Login</button></div>
        ) : <button onClick={() => setIsAdmin(false)} className="text-[10px] text-red-300">Logout Admin</button>}
      </div>

      {/* Sell Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 my-auto shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-gray-900">વસ્તુ વેચવા માટે મૂકો</h3>
              <button onClick={() => setShowForm(false)} className="bg-gray-100 p-2 rounded-full">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">શ્રેણી પસંદ કરો</label>
                <select value={category} onChange={e => setCategory(e.target.value as any)} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none font-bold">
                  <option value="livestock">પશુધન (ગાય, ભેંસ...)</option>
                  <option value="vehicle">વાહન (ટ્રેક્ટર, ગાડી...)</option>
                  <option value="tools">ખેતીના ઓજારો</option>
                  <option value="other">અન્ય સામગ્રી</option>
                </select>
              </div>
              <input type="text" placeholder="વસ્તુનું નામ (દા.ત. ૨ વર્ષની પાડી)" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-amber-200" required />
              <input type="text" placeholder="કિંમત (₹)" value={price} onChange={e => setPrice(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-black text-emerald-600" required />
              <textarea placeholder="વધુ વિગત (દા.ત. ઓલાદ, ઉંમર, સ્થિતિ...)" value={desc} onChange={e => setDesc(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl outline-none" rows={3} />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="માલિકનું નામ" value={owner} onChange={e => setOwner(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl outline-none" required />
                <input type="tel" placeholder="મોબાઈલ નંબર" value={mobile} onChange={e => setMobile(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl outline-none" required />
              </div>
              <button type="submit" className="w-full bg-amber-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-amber-100 active:scale-95 transition-all">
                જાહેરાત પબ્લિશ કરો
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default VillageMarket;