import React, { useState, useEffect } from 'react';
import { pool } from '../utils/db';

interface Article {
  id: number;
  title: string;
  date: string;
  summary: string;
  content: string;
  category: string;
}

const NewsSection: React.FC = () => {
  const [newsList, setNewsList] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pin, setPin] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('યોજના');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');

  const initDb = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS news (
              id SERIAL PRIMARY KEY,
              title TEXT NOT NULL,
              category TEXT NOT NULL,
              summary TEXT NOT NULL,
              content TEXT NOT NULL,
              date TEXT NOT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
    } catch (e) { console.error(e); }
  };

  const fetchNews = async () => {
    setLoading(true);
    try {
        await initDb();
        const result = await pool.query('SELECT * FROM news ORDER BY id DESC');
        setNewsList(result.rows);
    } catch (err) {
        setError("ડેટાબેઝ એરર!");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchNews(); }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234') { setIsAdmin(true); setShowLogin(false); setPin(''); } 
    else { alert('ખોટો પિન!'); }
  };

  const handleDelete = async (id: number) => {
    if(window.confirm('આ સમાચાર કાયમ માટે ડિલીટ કરવા છે?')) {
        try {
            await pool.query('DELETE FROM news WHERE id = $1', [id]);
            setNewsList(newsList.filter(a => a.id !== id));
            alert('સમાચાર ડિલીટ થઈ ગયા.');
        } catch (e) {
            console.error(e);
            alert('ડિલીટ કરવામાં નિષ્ફળતા.');
        }
    }
  };

  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault();
    const dateStr = new Date().toLocaleDateString('gu-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    try {
        const query = `INSERT INTO news (title, category, summary, content, date) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const res = await pool.query(query, [title, category, summary, content, dateStr]);
        setNewsList([res.rows[0], ...newsList]);
        setShowForm(false); resetForm();
        alert('સમાચાર સફળતાપૂર્વક પબ્લિશ થયા!');
    } catch (e) { alert('સેવ કરવામાં ભૂલ પડી!'); }
  };

  const resetForm = () => { setTitle(''); setSummary(''); setContent(''); };
  const toggleArticle = (id: number) => setSelectedId(selectedId === id ? null : id);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 animate-fade-in pb-20">
      <div className="flex justify-between items-center mb-8">
         <h2 className="text-2xl font-black text-gray-900 border-l-4 border-indigo-600 pl-3">યોજના સમાચાર</h2>
         <div className="flex gap-2">
           {!isAdmin ? <button onClick={() => setShowLogin(true)} className="text-[10px] text-gray-300">Admin</button> : 
           <button onClick={() => setShowForm(true)} className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-lg shadow-indigo-200">નવો લેખ +</button>}
         </div>
      </div>

      <div className="space-y-6">
        {loading ? <div className="text-center py-20 animate-pulse">લોડ થઈ રહ્યું છે...</div> : 
        newsList.map((article) => (
          <div key={article.id} className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 relative p-6">
             {isAdmin && <button onClick={() => handleDelete(article.id)} className="absolute top-4 right-4 z-20 bg-red-50 text-red-500 p-2 rounded-full hover:bg-red-100 transition-colors">✕</button>}
             <div className="flex justify-between items-center mb-3">
                <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">{article.category}</span>
                <span className="text-[10px] text-gray-400 font-medium">{article.date}</span>
             </div>
             <h3 className="text-xl font-bold text-gray-900 leading-tight mb-2 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => toggleArticle(article.id)}>{article.title}</h3>
             <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{article.summary}</p>
             {selectedId === article.id && (
               <div className="mt-4 pt-4 border-t border-gray-50 animate-fade-in text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {article.content}
               </div>
             )}
             <button onClick={() => toggleArticle(article.id)} className="mt-5 text-indigo-600 font-bold text-xs uppercase tracking-widest flex items-center gap-1 group">
                {selectedId === article.id ? 'ઓછું વાંચો' : 'વધુ વાંચો'}
                <span className="group-hover:translate-x-1 transition-transform">→</span>
             </button>
          </div>
        ))}
      </div>

      {showLogin && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <form onSubmit={handleLogin} className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-xs text-center animate-fade-in">
             <h3 className="font-black text-xl mb-6">એડમિન લૉગિન</h3>
             <input type="password" value={pin} onChange={e => setPin(e.target.value)} placeholder="PIN (1234)" className="w-full border-2 border-gray-100 p-4 rounded-2xl mb-4 text-center focus:border-indigo-500 outline-none" autoFocus />
             <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100">Login</button>
             <button type="button" onClick={() => setShowLogin(false)} className="mt-4 text-xs text-gray-400">કેન્સલ</button>
          </form>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
           <div className="bg-white rounded-[2rem] w-full max-w-xl p-8 my-auto shadow-2xl animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-2xl font-black text-gray-900">નવો સમાચાર ઉમેરો</h3>
                 <button onClick={() => setShowForm(false)} className="bg-gray-100 p-2 rounded-full">✕</button>
              </div>
              <form onSubmit={handleAddNews} className="space-y-5">
                 <div className="grid grid-cols-1 gap-4">
                    <input type="text" required value={title} onChange={e => setTitle(e.target.value)} placeholder="સમાચારનું શીર્ષક" className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none" />
                    <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none font-bold">
                       <option>યોજના</option><option>ખેતી</option><option>પંચાયત</option><option>અન્ય</option>
                    </select>
                 </div>
                 <textarea required value={summary} onChange={e => setSummary(e.target.value)} placeholder="ટૂંકી વિગત (૨-૩ લીટીમાં)" className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none" rows={2} />
                 <textarea required value={content} onChange={e => setContent(e.target.value)} placeholder="સંપૂર્ણ સમાચારની વિગતવાર માહિતી અહીં લખો..." className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none" rows={6} />
                 <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-100 hover:scale-[1.01] active:scale-95 transition-all">પબ્લિશ કરો</button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};
export default NewsSection;