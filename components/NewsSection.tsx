import React, { useState, useEffect } from 'react';
import AdSenseSlot from './AdSenseSlot';
import { pool } from '../utils/db';

interface Article {
  id: number;
  title: string;
  date: string;
  summary: string;
  content: string;
  image: string;
  category: string;
}

const NewsSection: React.FC = () => {
  const [newsList, setNewsList] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Admin State
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pin, setPin] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('યોજના');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // 1. Initialize DB Table (One-time check)
  const initDb = async () => {
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS news (
              id SERIAL PRIMARY KEY,
              title TEXT NOT NULL,
              category TEXT NOT NULL,
              summary TEXT NOT NULL,
              content TEXT NOT NULL,
              image TEXT,
              date TEXT NOT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await pool.query(query);
    } catch (e) {
        console.error("DB Init Error", e);
    }
  };

  // 2. Fetch Data Directly from DB
  const fetchNews = async () => {
    setLoading(true);
    try {
        // Ensure table exists first
        await initDb();

        const result = await pool.query('SELECT * FROM news ORDER BY id DESC');
        setNewsList(result.rows);
        setError('');
    } catch (err: any) {
        console.error("Database Fetch Error:", err);
        setError("ડેટાબેઝ સાથે કનેક્શન મળતું નથી. (Check Internet)");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleLogin = () => {
    if (pin === '1234') {
      setIsAdmin(true);
      setShowLogin(false);
      setPin('');
    } else {
      alert('ખોટો પિન!');
    }
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
    
    const finalImage = imageUrl.trim() || `https://ui-avatars.com/api/?name=${encodeURIComponent(category)}&background=random&color=fff&size=128`;
    const dateStr = new Date().toLocaleDateString('gu-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    try {
        const query = `
          INSERT INTO news (title, category, summary, content, image, date)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *
        `;
        const values = [title, category, summary, content, finalImage, dateStr];
        
        const result = await pool.query(query, values);
        const savedArticle = result.rows[0];

        // Update UI immediately
        setNewsList([savedArticle, ...newsList]);
        setShowForm(false);
        resetForm();
        alert('સમાચાર સફળતાપૂર્વક પબ્લિશ થયા! (Saved to Global DB)');
    } catch (e) {
        console.error(e);
        alert('સર્વર એરર: ડેટા સેવ થયો નથી.');
    }
  };

  const resetForm = () => {
    setTitle('');
    setCategory('યોજના');
    setSummary('');
    setContent('');
    setImageUrl('');
  };

  const toggleArticle = (id: number) => {
    setSelectedId(selectedId === id ? null : id);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-8 animate-fade-in pb-20">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
         <div className="flex items-center gap-2">
            <span className="h-8 w-1.5 bg-indigo-600 rounded-full"></span>
            <div>
                <h2 className="text-xl font-bold text-gray-800">યોજના અને સમાચાર</h2>
                <p className="text-xs text-gray-500">સરકારી યોજનાઓની સચોટ માહિતી</p>
            </div>
         </div>
         
         {isAdmin && (
             <button 
                onClick={() => setShowForm(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md hover:bg-indigo-700 transition-all flex items-center gap-2"
             >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                નવો લેખ
             </button>
         )}
      </div>

      {/* Connection Error Banner */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
           <div className="flex items-center">
              <svg className="w-6 h-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-700 font-bold">{error}</p>
           </div>
           <p className="text-xs text-red-500 mt-1 ml-9">ઈન્ટરનેટ કનેક્શન ચેક કરો.</p>
        </div>
      )}

      {/* Ad Slot */}
      <AdSenseSlot slotId="NEWS_HEADER_AD_SLOT" />

      {/* Articles List */}
      {loading ? (
        <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
            <p className="text-gray-500 text-sm mt-2">ડેટાબેઝમાંથી માહિતી લોડ થઈ રહી છે...</p>
        </div>
      ) : (
        <div className="grid gap-6 mt-6">
            {newsList.length === 0 && !error && (
                <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-400">હાલમાં કોઈ સમાચાર નથી.</p>
                </div>
            )}
            {newsList.map((article, index) => (
            <React.Fragment key={article.id}>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow relative">
                
                {/* Delete Button for Admin */}
                {isAdmin && (
                    <button 
                        onClick={() => handleDelete(article.id)}
                        className="absolute top-2 right-2 z-10 bg-red-100 text-red-600 p-2 rounded-full hover:bg-red-200"
                        title="Delete Article"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                )}

                <div className="flex flex-col sm:flex-row">
                    
                    {/* Image Section */}
                    <div className="sm:w-32 h-32 bg-gray-100 flex-shrink-0 relative">
                        <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm">
                            {article.category}
                        </span>
                    </div>

                    {/* Content Section */}
                    <div className="p-5 flex-1">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold text-gray-900 leading-snug hover:text-indigo-600 transition-colors cursor-pointer" onClick={() => toggleArticle(article.id)}>
                            {article.title}
                            </h3>
                        </div>
                        
                        <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            {article.date}
                        </p>

                        {/* Summary */}
                        <p className="text-sm text-gray-600 leading-relaxed mb-4">
                            {article.summary}
                        </p>

                        {/* Expandable Full Content */}
                        {selectedId === article.id && (
                            <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in">
                                <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
                                    {article.content}
                                </p>
                            </div>
                        )}

                        <button 
                            onClick={() => toggleArticle(article.id)}
                            className="text-indigo-600 text-xs font-bold uppercase tracking-wide hover:underline mt-2 flex items-center gap-1"
                        >
                            {selectedId === article.id ? 'ઓછું વાંચો' : 'વધુ વાંચો'}
                            <svg className={`w-4 h-4 transition-transform ${selectedId === article.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                    </div>
                </div>
                </div>
                
                {/* Insert Ad after the 2nd article */}
                {index === 1 && <AdSenseSlot slotId="IN_FEED_AD_SLOT" />}
            </React.Fragment>
            ))}
        </div>
      )}

      {/* Admin Panel Toggle */}
      <div className="mt-8 pt-4 border-t border-gray-200 text-center">
          {!isAdmin ? (
             <div className="flex justify-center">
                 {!showLogin ? (
                     <button onClick={() => setShowLogin(true)} className="text-xs text-gray-300 hover:text-gray-500">
                        Admin Login
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
             <button onClick={() => setIsAdmin(false)} className="text-xs text-red-500 bg-red-50 px-3 py-1 rounded-full">
                Logout Admin
             </button>
          )}
      </div>

      {/* Add News Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
                    <h3 className="font-bold text-lg text-gray-800">નવો આર્ટિકલ લખો</h3>
                    <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>
                
                <form onSubmit={handleAddNews} className="p-6 space-y-4">
                    
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">શીર્ષક (Title)</label>
                        <input 
                            type="text" required
                            value={title} onChange={e => setTitle(e.target.value)}
                            placeholder="દા.ત. નવી આવાસ યોજના..."
                            className="w-full p-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">કેટેગરી</label>
                            <select 
                                value={category} onChange={e => setCategory(e.target.value)}
                                className="w-full p-3 border rounded-xl text-sm"
                            >
                                <option>યોજના</option>
                                <option>ખેતીવાડી</option>
                                <option>આરોગ્ય</option>
                                <option>શિક્ષણ</option>
                                <option>સમાચાર</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">ફોટો URL (Optional)</label>
                            <input 
                                type="text"
                                value={imageUrl} onChange={e => setImageUrl(e.target.value)}
                                placeholder="Image Link..."
                                className="w-full p-3 border rounded-xl text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">ટૂંકસાર (Summary)</label>
                        <textarea 
                            required rows={2}
                            value={summary} onChange={e => setSummary(e.target.value)}
                            placeholder="બે લાઈનમાં માહિતી..."
                            className="w-full p-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">સંપૂર્ણ વિગત (Full Content)</label>
                        <textarea 
                            required rows={8}
                            value={content} onChange={e => setContent(e.target.value)}
                            placeholder="અહીં આખો આર્ટિકલ લખો..."
                            className="w-full p-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700">
                        પબ્લિશ કરો (Save to Global DB)
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default NewsSection;
