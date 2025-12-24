
import React, { useState, useEffect } from 'react';
import { pool } from '../utils/db';
import { NewsItem } from '../types';

const NewsSection: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'village' | 'agri' | 'gujarat'>('all');
  
  // Admin State
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pin, setPin] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'village' | 'agri' | 'gujarat'>('village');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const initDb = async () => {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS news (
          id SERIAL PRIMARY KEY,
          category TEXT NOT NULL,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          image_url TEXT,
          date_str TEXT NOT NULL,
          author TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
    } catch (e) { console.error(e); }
  };

  const fetchNews = async () => {
    setLoading(true);
    try {
      await initDb();
      const res = await pool.query('SELECT * FROM news ORDER BY id DESC');
      setNews(res.rows);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchNews(); }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234') { setIsAdmin(true); setShowLogin(false); setPin(''); }
    else { alert('ખોટો પિન!'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await pool.query(
        `INSERT INTO news (category, title, content, image_url, date_str, author) VALUES ($1, $2, $3, $4, $5, $6)`,
        [category, title, content, imageUrl, new Date().toLocaleDateString('gu-IN'), 'એડમિન']
      );
      fetchNews();
      setShowForm(false);
      setTitle(''); setContent(''); setImageUrl('');
      alert('સમાચાર પબ્લિશ થઈ ગયા!');
    } catch (e) { alert('ભૂલ પડી!'); }
  };

  const handleDelete = async (id: number) => {
    if(confirm('આ સમાચાર કાઢી નાખવા છે?')) {
      await pool.query('DELETE FROM news WHERE id = $1', [id]);
      setNews(news.filter(n => n.id !== id));
    }
  };

  const filteredNews = news.filter(n => activeTab === 'all' || n.category === activeTab);

  const getCategoryLabel = (cat: string) => {
    switch(cat) {
      case 'village': return 'ગામના સમાચાર';
      case 'agri': return 'ખેતીવાડી';
      case 'gujarat': return 'ગુજરાત';
      default: return 'જનરલ';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 animate-fade-in pb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-900 leading-none">તાજા સમાચાર</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Daily Village Updates</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-lg">
            નવા સમાચાર +
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-6 no-scrollbar">
        {['all', 'village', 'agri', 'gujarat'].map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab as any)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
              activeTab === tab ? 'bg-gray-900 text-white border-gray-900 shadow-lg' : 'bg-white text-gray-500 border-gray-100'
            }`}
          >
            {tab === 'all' ? 'બધા' : getCategoryLabel(tab)}
          </button>
        ))}
      </div>

      {/* News Feed */}
      <div className="space-y-6">
        {loading ? <div className="text-center py-20 opacity-30">લોડિંગ...</div> : 
         filteredNews.length === 0 ? <div className="text-center py-20 text-gray-400 font-bold">અત્યારે કોઈ સમાચાર નથી.</div> :
         filteredNews.map(item => (
          <div key={item.id} className="bg-white rounded-[2.5rem] border border-gray-50 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-500">
            {item.image_url && (
              <div className="h-48 overflow-hidden">
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
            )}
            <div className="p-7">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-tighter">
                  {getCategoryLabel(item.category)}
                </span>
                <span className="text-[10px] text-gray-300 font-bold">{item.date_str}</span>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3 leading-tight">{item.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-6 whitespace-pre-wrap">{item.content}</p>
              
              <div className="flex justify-between items-center pt-5 border-t border-gray-50">
                <button 
                  onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent('*📢 ' + item.title + '*\n\n' + item.content + '\n\n👉 વધુ માટે એપ જુઓ: https://www.jayuinfo.in')}`, '_blank')}
                  className="flex items-center gap-2 text-green-600 font-black text-[10px] uppercase tracking-widest bg-green-50 px-4 py-2 rounded-full hover:bg-green-100 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.18-.573c.978.539 2.027.823 3.151.824h.001c3.181 0 5.767-2.586 5.768-5.766.001-3.18-2.585-5.766-5.77-5.766zm3.364 8.162c-.149.418-.752.766-1.04.811-.273.045-.615.084-1.017-.046-.248-.08-.57-.183-.93-.339-1.536-.653-2.531-2.204-2.607-2.305-.075-.1-.615-.818-.615-1.56s.385-1.104.52-1.254c.135-.15.295-.187.393-.187.098 0 .196.001.282.005.089.004.21-.034.328.254.122.296.417 1.015.453 1.09.036.075.059.163.009.263-.05.1-.075.163-.149.251-.075.088-.158.196-.225.263-.075.075-.153.157-.066.307.086.15.383.633.821 1.023.565.503 1.041.659 1.191.734.15.075.238.063.326-.038.088-.1.376-.438.476-.588.1-.15.2-.125.338-.075.138.05.875.413 1.025.488s.25.113.288.175c.037.062.037.359-.112.777z"/></svg>
                  વોટ્સએપ શેર
                </button>
                {isAdmin && (
                  <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-600 text-xs font-bold">Delete</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Admin Controls */}
      <div className="mt-20 text-center">
        {!isAdmin ? (
          !showLogin ? <button onClick={() => setShowLogin(true)} className="text-[10px] text-gray-200">Admin Login</button> :
          <form onSubmit={handleLogin} className="flex justify-center gap-2">
            <input type="password" value={pin} onChange={e => setPin(e.target.value)} className="border p-2 rounded-xl text-xs w-24" placeholder="PIN" />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold">OK</button>
            <button type="button" onClick={() => setShowLogin(false)} className="text-xs text-gray-400">X</button>
          </form>
        ) : <button onClick={() => setIsAdmin(false)} className="text-xs text-red-400 font-bold bg-red-50 px-4 py-2 rounded-full">Logout News Admin</button>}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-gray-900">નવા સમાચાર લખો</h3>
              <button onClick={() => setShowForm(false)} className="bg-gray-100 p-2 rounded-full">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select value={category} onChange={e => setCategory(e.target.value as any)} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none font-bold">
                <option value="village">ગામના સમાચાર</option>
                <option value="agri">ખેતીવાડી</option>
                <option value="gujarat">ગુજરાત / રાજ્ય</option>
              </select>
              <input type="text" placeholder="સમાચારનું શીર્ષક" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl outline-none" required />
              <textarea placeholder="સમાચારની વિગત..." value={content} onChange={e => setContent(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl outline-none" rows={5} required />
              <input type="text" placeholder="ફોટો લિંક (વૈકલ્પિક)" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl outline-none" />
              <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-100">પબ્લિશ કરો</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsSection;
