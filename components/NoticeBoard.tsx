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
  image?: string;
}

const NoticeBoard: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'death' | 'event' | 'general'>('all');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Admin State
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pin, setPin] = useState('');

  // Form
  const [newType, setNewType] = useState<'death' | 'event' | 'general'>('general');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newMobile, setNewMobile] = useState('');
  const [newImage, setNewImage] = useState('');

  const initDb = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS notices (
                id SERIAL PRIMARY KEY,
                type TEXT, title TEXT, description TEXT, date_str TEXT, contact_person TEXT, mobile TEXT, image TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
    } catch(e) { console.error(e); }
  };

  const fetchNotices = async () => {
      setLoading(true);
      try {
          await initDb();
          const res = await pool.query('SELECT * FROM notices ORDER BY id DESC');
          setNotices(res.rows);
      } catch(e) { console.error(e); }
      finally { setLoading(false); }
  };

  useEffect(() => { fetchNotices(); }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234') {
      setIsAdmin(true);
      setShowLogin(false);
      setPin('');
    } else {
      alert('ખોટો પિન!');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("૨ MB થી ઓછી સાઈઝનો ફોટો પસંદ કરો.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
        await pool.query(
            `INSERT INTO notices (type, title, description, date_str, contact_person, mobile, image) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [newType, newTitle, newDesc, new Date().toLocaleDateString('gu-IN'), newContact, newMobile, newImage]
        );
        fetchNotices();
        setShowForm(false);
        setNewTitle(''); setNewDesc(''); setNewContact(''); setNewMobile(''); setNewImage('');
        alert('જાહેરાત લાઈવ થઈ ગઈ!');
    } catch (err) {
        console.error(err);
        alert('Error saving notice');
    }
  };

  const handleDelete = async (id: number) => {
      if(confirm('આ નોટિસ ડિલીટ કરવી છે?')) {
          try {
            await pool.query('DELETE FROM notices WHERE id = $1', [id]);
            setNotices(notices.filter(n => n.id !== id));
          } catch(e) { console.error(e); }
      }
  };

  const shareOnWhatsApp = (notice: Notice) => {
      const text = `📢 *${notice.title}*\n\n${notice.description}\n\nસંપર્ક: ${notice.contact_person} (${notice.mobile})`;
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const filteredNotices = notices.filter(n => activeTab === 'all' || n.type === activeTab);

  const getTabLabel = (tab: string) => {
    switch(tab) {
        case 'all': return 'બધી નોટિસ';
        case 'death': return 'શ્રદ્ધાંજલિ';
        case 'event': return 'કાર્યક્રમ';
        case 'general': return 'સામાન્ય';
        default: return tab;
    }
  };

  const getBadgeLabel = (type: string) => {
    switch(type) {
        case 'death': return 'શ્રદ્ધાંજલિ';
        case 'event': return 'કાર્યક્રમ';
        case 'general': return 'સામાન્ય';
        default: return type;
    }
  };

  if(loading) return <div className="p-10 text-center">નોટિસ લોડ થઈ રહી છે...</div>;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 mt-6 mb-8 animate-fade-in pb-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">ડિજિટલ નોટિસ બોર્ડ (Live)</h2>
        <button onClick={() => setShowForm(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-indigo-700 transition-colors">
          + જાહેરાત આપો
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
        {['all', 'death', 'event', 'general'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeTab === tab ? 'bg-gray-800 text-white' : 'bg-white border text-gray-600 hover:border-gray-400'}`}>
                {getTabLabel(tab)}
            </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {filteredNotices.length === 0 ? <p className="col-span-full text-center text-gray-400 py-10">કોઈ નોટિસ નથી.</p> : filteredNotices.map(notice => (
            <div key={notice.id} className={`bg-white rounded-2xl overflow-hidden border shadow-sm relative transition-all hover:shadow-md ${notice.type === 'death' ? 'border-gray-200' : 'border-blue-100'}`}>
                {/* Image Section */}
                {notice.image && (
                    <div className="w-full h-48 bg-gray-100 overflow-hidden">
                        <img src={notice.image} alt={notice.title} className="w-full h-full object-cover" />
                    </div>
                )}

                <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                        <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${notice.type === 'death' ? 'bg-gray-100 text-gray-600' : 'bg-blue-50 text-blue-600'}`}>{getBadgeLabel(notice.type)}</span>
                        <div className="flex gap-2 items-center">
                            <span className="text-[10px] text-gray-400">{notice.date_str}</span>
                            {isAdmin && (
                                <button onClick={() => handleDelete(notice.id)} className="text-red-400 hover:text-red-600">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            )}
                        </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 leading-snug">{notice.title}</h3>
                    <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap leading-relaxed">{notice.description}</p>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">Contact</p>
                            <p className="text-xs font-bold text-gray-700">{notice.contact_person}</p>
                        </div>
                        <div className="flex gap-2">
                             <a href={`tel:${notice.mobile}`} className="p-2 bg-gray-50 text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                             </a>
                             <button onClick={() => shareOnWhatsApp(notice)} className="p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-colors">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.18-.573c.978.539 2.027.823 3.151.824h.001c3.181 0 5.767-2.586 5.768-5.766.001-3.18-2.585-5.766-5.77-5.766zm3.364 8.162c-.149.418-.752.766-1.04.811-.273.045-.615.084-1.017-.046-.248-.08-.57-.183-.93-.339-1.536-.653-2.531-2.204-2.607-2.305-.075-.1-.615-.818-.615-1.56s.385-1.104.52-1.254c.135-.15.295-.187.393-.187.098 0 .196.001.282.005.089.004.21-.034.328.254.122.296.417 1.015.453 1.09.036.075.059.163.009.263-.05.1-.075.163-.149.251-.075.088-.158.196-.225.263-.075.075-.153.157-.066.307.086.15.383.633.821 1.023.565.503 1.041.659 1.191.734.15.075.238.063.326-.038.088-.1.376-.438.476-.588.1-.15.2-.125.338-.075.138.05.875.413 1.025.488s.25.113.288.175c.037.062.037.359-.112.777z"/></svg>
                             </button>
                        </div>
                    </div>
                </div>
            </div>
        ))}
      </div>

      {/* Admin Panel */}
      <div className="mt-8 pt-4 border-t border-gray-200 text-center">
          {!isAdmin ? (
             <div className="flex justify-center">
                 {!showLogin ? (
                     <button onClick={() => setShowLogin(true)} className="text-xs text-gray-300 hover:text-gray-500">Admin Login</button>
                 ) : (
                     <form onSubmit={handleLogin} className="flex gap-2 bg-gray-100 p-2 rounded-lg">
                         <input type="password" value={pin} onChange={e => setPin(e.target.value)} placeholder="PIN" className="w-20 p-1 text-xs border rounded" />
                         <button type="submit" className="bg-indigo-600 text-white text-xs px-2 rounded">OK</button>
                         <button type="button" onClick={() => setShowLogin(false)} className="text-gray-500 text-xs px-1">X</button>
                     </form>
                 )}
             </div>
          ) : (
             <button onClick={() => setIsAdmin(false)} className="text-xs text-red-500 bg-red-50 px-3 py-1 rounded-full font-bold">Logout Admin</button>
          )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-3xl w-full max-w-md p-6 my-auto shadow-2xl">
                <div className="flex justify-between items-center mb-5">
                    <h3 className="font-bold text-gray-800">નવી નોટિસ પબ્લિશ કરો</h3>
                    <button onClick={() => setShowForm(false)} className="text-gray-400">✕</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-3">
                        <select value={newType} onChange={e => setNewType(e.target.value as any)} className="flex-1 p-3 border rounded-xl bg-gray-50 font-bold text-sm">
                            <option value="general">સામાન્ય</option>
                            <option value="death">શ્રદ્ધાંજલિ</option>
                            <option value="event">કાર્યક્રમ</option>
                        </select>
                        <div className="w-16 h-12 bg-gray-50 border-2 border-dashed rounded-xl flex items-center justify-center relative overflow-hidden">
                           {newImage ? (
                               <img src={newImage} className="w-full h-full object-cover" alt="Preview" />
                           ) : (
                               <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg>
                           )}
                           <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                    </div>
                    
                    <input type="text" placeholder="શીર્ષક (Title)" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-100" required />
                    <textarea placeholder="વિગત (Description)" value={newDesc} onChange={e => setNewDesc(e.target.value)} className="w-full p-3 border rounded-xl bg-gray-50" required rows={4} />
                    
                    <div className="grid grid-cols-2 gap-3">
                        <input type="text" placeholder="નામ" value={newContact} onChange={e => setNewContact(e.target.value)} className="w-full p-3 border rounded-xl bg-gray-50" required />
                        <input type="tel" placeholder="મોબાઈલ" value={newMobile} onChange={e => setNewMobile(e.target.value)} className="w-full p-3 border rounded-xl bg-gray-50" required />
                    </div>
                    
                    <button type="submit" className="w-full bg-indigo-600 text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all">
                        પબ્લિશ કરો
                    </button>
                    <button type="button" onClick={() => setShowForm(false)} className="w-full text-gray-400 text-xs font-bold">બંધ કરો</button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};
export default NoticeBoard;