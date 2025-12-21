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

  const initDb = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS notices (
                id SERIAL PRIMARY KEY,
                type TEXT, title TEXT, description TEXT, date_str TEXT, contact_person TEXT, mobile TEXT,
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

  const handleLogin = () => {
    if (pin === '1234') {
      setIsAdmin(true);
      setShowLogin(false);
      setPin('');
    } else {
      alert('ખોટો પિન!');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
        await pool.query(
            `INSERT INTO notices (type, title, description, date_str, contact_person, mobile) VALUES ($1, $2, $3, $4, $5, $6)`,
            [newType, newTitle, newDesc, new Date().toLocaleDateString('gu-IN'), newContact, newMobile]
        );
        fetchNotices();
        setShowForm(false);
        setNewTitle(''); setNewDesc(''); setNewContact(''); setNewMobile('');
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

  // Helper for Tab Labels
  const getTabLabel = (tab: string) => {
    switch(tab) {
        case 'all': return 'બધી નોટિસ';
        case 'death': return 'શ્રદ્ધાંજલિ/બેસણું';
        case 'event': return 'કાર્યક્રમ/ઉત્સવ';
        case 'general': return 'સામાન્ય જાહેરાત';
        default: return tab;
    }
  };

  // Helper for Badge Labels
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
        <button onClick={() => setShowForm(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-indigo-700">
          + જાહેરાત આપો
        </button>
      </div>

      {/* Tabs in Gujarati */}
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
        {['all', 'death', 'event', 'general'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${activeTab === tab ? 'bg-gray-800 text-white' : 'bg-white border text-gray-600'}`}>
                {getTabLabel(tab)}
            </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredNotices.length === 0 ? <p className="text-center text-gray-400">કોઈ નોટિસ નથી.</p> : filteredNotices.map(notice => (
            <div key={notice.id} className={`bg-white rounded-xl p-5 border-l-4 shadow-sm relative ${notice.type === 'death' ? 'border-gray-500' : 'border-blue-500'}`}>
                <div className="flex justify-between">
                    <span className="text-[10px] bg-gray-100 px-2 py-1 rounded font-bold uppercase">{getBadgeLabel(notice.type)}</span>
                    <div className="flex gap-2 items-center">
                        <span className="text-[10px] text-gray-400">{notice.date_str}</span>
                        {/* Only Admin can see Delete button */}
                        {isAdmin && (
                            <button onClick={() => handleDelete(notice.id)} className="text-red-400 text-xs font-bold hover:bg-red-50 px-1 rounded">
                                Delete
                            </button>
                        )}
                    </div>
                </div>
                <h3 className="text-lg font-bold mt-2">{notice.title}</h3>
                <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{notice.description}</p>
                <div className="mt-3 pt-3 border-t flex justify-between items-center">
                    <p className="text-xs text-gray-500">By: {notice.contact_person}</p>
                    <button onClick={() => shareOnWhatsApp(notice)} className="text-green-600 text-xs font-bold flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.506-.669-.514-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.084 1.758-.717 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                        Share
                    </button>
                </div>
            </div>
        ))}
      </div>

      {/* Admin Login Panel for Deletion */}
      <div className="mt-8 pt-4 border-t border-gray-200 text-center">
          {!isAdmin ? (
             <div className="flex justify-center">
                 {!showLogin ? (
                     <button onClick={() => setShowLogin(true)} className="text-xs text-gray-300 hover:text-gray-500">
                        Admin Login (For Deletion)
                     </button>
                 ) : (
                     <div className="flex gap-2 bg-gray-100 p-2 rounded-lg">
                         <input type="password" value={pin} onChange={e => setPin(e.target.value)} placeholder="PIN (1234)" className="w-20 p-1 text-xs border rounded" />
                         <button onClick={handleLogin} className="bg-indigo-600 text-white text-xs px-2 rounded">OK</button>
                         <button onClick={() => setShowLogin(false)} className="text-gray-500 text-xs px-1">X</button>
                     </div>
                 )}
             </div>
          ) : (
             <div className="flex flex-col items-center gap-2">
                 <span className="text-xs text-green-600 font-bold">Admin Logged In (Delete Enabled)</span>
                 <button onClick={() => setIsAdmin(false)} className="text-xs text-red-500 bg-red-50 px-3 py-1 rounded-full">
                    Logout
                 </button>
             </div>
          )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6">
                <h3 className="font-bold mb-4">નવી જાહેરાત (Create Notice)</h3>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <label className="text-xs font-bold text-gray-500">પ્રકાર પસંદ કરો</label>
                    <select value={newType} onChange={e => setNewType(e.target.value as any)} className="w-full p-2 border rounded">
                        <option value="general">સામાન્ય જાહેરાત</option>
                        <option value="death">શ્રદ્ધાંજલિ / બેસણું</option>
                        <option value="event">કાર્યક્રમ / ઉત્સવ</option>
                    </select>
                    
                    <input type="text" placeholder="શીર્ષક (Title)" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full p-2 border rounded" required />
                    <textarea placeholder="વિગતવાર વર્ણન (Details)" value={newDesc} onChange={e => setNewDesc(e.target.value)} className="w-full p-2 border rounded" required />
                    <input type="text" placeholder="તમારું નામ" value={newContact} onChange={e => setNewContact(e.target.value)} className="w-full p-2 border rounded" required />
                    <input type="tel" placeholder="મોબાઈલ નંબર" value={newMobile} onChange={e => setNewMobile(e.target.value)} className="w-full p-2 border rounded" required />
                    
                    <div className="flex gap-2 mt-4">
                        <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 rounded font-bold">પબ્લિશ</button>
                        <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-200 py-2 rounded font-bold">બંધ</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};
export default NoticeBoard;