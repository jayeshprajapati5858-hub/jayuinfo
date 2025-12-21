import React, { useState, useEffect } from 'react';
import { pool } from '../utils/db';

interface Notice {
  id: number;
  type: 'death' | 'event' | 'general';
  title: string;
  description: string;
  date_str: string;
  contact_person: string;
  mobile: string;
}

const NoticeBoard: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'death' | 'event' | 'general'>('all');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pin, setPin] = useState('');

  const [newType, setNewType] = useState<'death' | 'event' | 'general'>('general');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newMobile, setNewMobile] = useState('');

  const fetchNotices = async () => {
      setLoading(true);
      try {
          await pool.query(`CREATE TABLE IF NOT EXISTS notices (id SERIAL PRIMARY KEY, type TEXT, title TEXT, description TEXT, date_str TEXT, contact_person TEXT, mobile TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
          const res = await pool.query('SELECT * FROM notices ORDER BY id DESC');
          setNotices(res.rows);
      } catch(e) { console.error(e); }
      finally { setLoading(false); }
  };

  useEffect(() => { fetchNotices(); }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234') { setIsAdmin(true); setShowLogin(false); setPin(''); } 
    else { alert('ખોટો પિન!'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await pool.query(`INSERT INTO notices (type, title, description, date_str, contact_person, mobile) VALUES ($1, $2, $3, $4, $5, $6)`,
            [newType, newTitle, newDesc, new Date().toLocaleDateString('gu-IN'), newContact, newMobile]);
        fetchNotices(); setShowForm(false);
        setNewTitle(''); setNewDesc(''); setNewContact(''); setNewMobile('');
        alert('નોટિસ અપલોડ થઈ ગઈ!');
    } catch(err) { alert('ભૂલ પડી!'); }
  };

  const handleDelete = async (id: number) => {
      if(confirm('આ નોટિસ ડિલીટ કરવી છે?')) {
          try {
            await pool.query('DELETE FROM notices WHERE id = $1', [id]);
            setNotices(notices.filter(n => n.id !== id));
          } catch(e) { console.error(e); }
      }
  };

  const filteredNotices = notices.filter(n => activeTab === 'all' || n.type === activeTab);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 animate-fade-in pb-20">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-gray-900">નોટિસ બોર્ડ</h2>
        <button onClick={() => setShowForm(true)} className="bg-orange-600 text-white px-6 py-2.5 rounded-2xl text-xs font-bold shadow-xl shadow-orange-100 hover:bg-orange-700 transition-colors">જાહેરાત આપો +</button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-6 no-scrollbar">
        {['all', 'death', 'event', 'general'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${activeTab === tab ? 'bg-gray-900 text-white shadow-lg' : 'bg-white border text-gray-500 hover:border-gray-300'}`}>
                {tab === 'all' ? 'બધી' : tab === 'death' ? 'શ્રદ્ધાંજલિ' : tab === 'event' ? 'કાર્યક્રમ' : 'સામાન્ય'}
            </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? <div className="col-span-full text-center py-20 text-gray-400 font-bold">લોડિંગ...</div> : 
        filteredNotices.map(notice => (
            <div key={notice.id} className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 p-7 relative">
                <div className="flex justify-between items-center mb-4">
                    <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest ${notice.type === 'death' ? 'bg-gray-100 text-gray-600' : 'bg-orange-50 text-orange-600'}`}>
                        {notice.type === 'death' ? 'શ્રદ્ધાંજલિ' : notice.type === 'event' ? 'કાર્યક્રમ' : 'સામાન્ય'}
                    </span>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-400 font-bold">{notice.date_str}</span>
                        {isAdmin && (
                            <button onClick={() => handleDelete(notice.id)} className="text-red-400 hover:text-red-600 p-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        )}
                    </div>
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-3 leading-tight">{notice.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-6 whitespace-pre-wrap">{notice.description}</p>
                <div className="pt-5 border-t border-gray-50 flex justify-between items-center mt-auto">
                    <div className="flex flex-col">
                        <span className="text-[9px] text-gray-400 font-bold uppercase mb-1">સંપર્ક (Contact)</span>
                        <span className="text-xs font-black text-gray-800">{notice.contact_person}</span>
                    </div>
                    <div className="flex gap-2">
                        <a href={`tel:${notice.mobile}`} className="p-3 bg-gray-50 text-gray-900 rounded-2xl hover:bg-gray-100 transition-colors">
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeWidth="2.5"/></svg>
                        </a>
                        <a href={`https://wa.me/?text=${encodeURIComponent('📢 *'+notice.title+'*\n'+notice.description+'\n\nસંપર્ક: '+notice.contact_person+' ('+notice.mobile+')')}`} target="_blank" className="p-3 bg-green-50 text-green-600 rounded-2xl hover:bg-green-100 transition-colors">
                           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.18-.573c.978.539 2.027.823 3.151.824h.001c3.181 0 5.767-2.586 5.768-5.766.001-3.18-2.585-5.766-5.77-5.766zm3.364 8.162c-.149.418-.752.766-1.04.811-.273.045-.615.084-1.017-.046-.248-.08-.57-.183-.93-.339-1.536-.653-2.531-2.204-2.607-2.305-.075-.1-.615-.818-.615-1.56s.385-1.104.52-1.254c.135-.15.295-.187.393-.187.098 0 .196.001.282.005.089.004.21-.034.328.254.122.296.417 1.015.453 1.09.036.075.059.163.009.263-.05.1-.075.163-.149.251-.075.088-.158.196-.225.263-.075.075-.153.157-.066.307.086.15.383.633.821 1.023.565.503 1.041.659 1.191.734.15.075.238.063.326-.038.088-.1.376-.438.476-.588.1-.15.2-.125.338-.075.138.05.875.413 1.025.488s.25.113.288.175c.037.062.037.359-.112.777z"/></svg>
                        </a>
                    </div>
                </div>
            </div>
        ))}
      </div>

      {showLogin && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <form onSubmit={handleLogin} className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-xs text-center animate-fade-in">
             <h3 className="font-black text-xl mb-6">એડમિન લૉગિન</h3>
             <input type="password" value={pin} onChange={e => setPin(e.target.value)} placeholder="PIN" className="w-full border-2 border-gray-100 p-4 rounded-2xl mb-4 text-center outline-none focus:border-orange-500" autoFocus />
             <button type="submit" className="w-full bg-orange-600 text-white py-4 rounded-2xl font-bold">Login</button>
             <button type="button" onClick={() => setShowLogin(false)} className="mt-4 text-xs text-gray-400">કેન્સલ</button>
          </form>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-[2rem] w-full max-w-md p-8 my-auto shadow-2xl animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-black text-gray-900">નોટિસ પબ્લિશ કરો</h3>
                    <button onClick={() => setShowForm(false)} className="bg-gray-100 p-2 rounded-full">✕</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">નોટિસનો પ્રકાર</label>
                        <select value={newType} onChange={e => setNewType(e.target.value as any)} className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none border-none">
                            <option value="general">સામાન્ય સૂચના</option>
                            <option value="death">શ્રદ્ધાંજલિ</option>
                            <option value="event">કાર્યક્રમ / ઉત્સવ</option>
                        </select>
                    </div>
                    <input type="text" placeholder="નોટિસનું શીર્ષક (Title)" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-orange-100 border-none" required />
                    <textarea placeholder="સંપૂર્ણ વિગત અહીં લખો..." value={newDesc} onChange={e => setNewDesc(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl outline-none border-none" required rows={4} />
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="તમારું નામ" value={newContact} onChange={e => setNewContact(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl outline-none border-none" required />
                        <input type="tel" placeholder="મોબાઈલ નંબર" value={newMobile} onChange={e => setNewMobile(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl outline-none border-none" required />
                    </div>
                    <button type="submit" className="w-full bg-orange-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-orange-100 active:scale-95 transition-all">પબ્લિશ કરો</button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};
export default NoticeBoard;