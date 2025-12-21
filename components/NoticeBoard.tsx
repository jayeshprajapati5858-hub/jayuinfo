import React, { useState, useEffect } from 'react';
// @ts-ignore
import { Pool } from '@neondatabase/serverless';

const connectionString = 'postgresql://neondb_owner:npg_LZ5H2AChwUGB@ep-sparkling-block-a4stnq97-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require';
const pool = new Pool({ connectionString });

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
    } catch (e) {
        alert('Error saving notice');
    }
  };

  const handleDelete = async (id: number) => {
      if(confirm('Delete this notice?')) {
          await pool.query('DELETE FROM notices WHERE id = $1', [id]);
          setNotices(notices.filter(n => n.id !== id));
      }
  };

  const shareOnWhatsApp = (notice: Notice) => {
      const text = `📢 *${notice.title}*\n\n${notice.description}\n\nસંપર્ક: ${notice.contact_person} (${notice.mobile})`;
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const filteredNotices = notices.filter(n => activeTab === 'all' || n.type === activeTab);

  if(loading) return <div className="p-10 text-center">Loading Notices...</div>;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 mt-6 mb-8 animate-fade-in pb-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">ડિજિટલ નોટિસ બોર્ડ (Live)</h2>
        <button onClick={() => setShowForm(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-indigo-700">
          + જાહેરાત આપો
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
        {['all', 'death', 'event', 'general'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-4 py-2 rounded-full text-sm font-bold capitalize ${activeTab === tab ? 'bg-gray-800 text-white' : 'bg-white border'}`}>
                {tab}
            </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredNotices.length === 0 ? <p className="text-center text-gray-400">કોઈ નોટિસ નથી.</p> : filteredNotices.map(notice => (
            <div key={notice.id} className={`bg-white rounded-xl p-5 border-l-4 shadow-sm relative ${notice.type === 'death' ? 'border-gray-500' : 'border-blue-500'}`}>
                <div className="flex justify-between">
                    <span className="text-[10px] bg-gray-100 px-2 py-1 rounded font-bold uppercase">{notice.type}</span>
                    <div className="flex gap-2">
                        <span className="text-[10px] text-gray-400">{notice.date_str}</span>
                        <button onClick={() => handleDelete(notice.id)} className="text-red-400 text-xs">Del</button>
                    </div>
                </div>
                <h3 className="text-lg font-bold mt-2">{notice.title}</h3>
                <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{notice.description}</p>
                <div className="mt-3 pt-3 border-t flex justify-between items-center">
                    <p className="text-xs text-gray-500">By: {notice.contact_person}</p>
                    <button onClick={() => shareOnWhatsApp(notice)} className="text-green-600 text-xs font-bold">Share</button>
                </div>
            </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6">
                <h3 className="font-bold mb-4">નવી જાહેરાત</h3>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <select value={newType} onChange={e => setNewType(e.target.value as any)} className="w-full p-2 border rounded">
                        <option value="general">સામાન્ય</option>
                        <option value="death">શ્રદ્ધાંજલિ</option>
                        <option value="event">ઉત્સવ</option>
                    </select>
                    <input type="text" placeholder="શીર્ષક" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full p-2 border rounded" required />
                    <textarea placeholder="વિગત" value={newDesc} onChange={e => setNewDesc(e.target.value)} className="w-full p-2 border rounded" required />
                    <input type="text" placeholder="તમારું નામ" value={newContact} onChange={e => setNewContact(e.target.value)} className="w-full p-2 border rounded" required />
                    <input type="tel" placeholder="મોબાઈલ" value={newMobile} onChange={e => setNewMobile(e.target.value)} className="w-full p-2 border rounded" required />
                    <div className="flex gap-2">
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