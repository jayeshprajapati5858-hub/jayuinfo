import React, { useState, useEffect } from 'react';
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

  const fetchNews = async () => {
    setLoading(true);
    try {
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
        setNewsList([savedArticle, ...newsList]);
        setShowForm(false);
        resetForm();
        alert('સમાચાર સફળતાપૂર્વક પબ્લિશ થયા!');
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
    <div className="w-full max-w-7xl mx-auto px-4 mt-6 mb-8 animate-fade-in pb-20">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-4 text-center text-sm font-bold">
          {error}
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
         <div className="flex items-center gap-2">
            <span className="h-8 w-1.5 bg-indigo-600 rounded-full"></span>
            <div><h2 className="text-xl font-bold text-gray-800">યોજના અને સમાચાર</h2></div>
         </div>
         <div className="flex gap-2">
           {!isAdmin ? (
             <button onClick={() => setShowLogin(true)} className="text-xs text-gray-400">Admin</button>
           ) : (
             <button onClick={() => setShowForm(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold">નવો લેખ</button>
           )}
         </div>
      </div>
      
      {showLogin && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleLogin} className="bg-white p-6 rounded-2xl w-full max-w-xs text-center">
             <h3 className="font-bold mb-4">Admin Login</h3>
             <input type="password" value={pin} onChange={e => setPin(e.target.value)} placeholder="PIN (1234)" className="w-full border p-2 rounded mb-4 text-center" />
             <div className="flex gap-2">
               <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 rounded">Login</button>
               <button type="button" onClick={() => setShowLogin(false)} className="flex-1 bg-gray-100 py-2 rounded">Cancel</button>
             </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10"><div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div></div>
      ) : (
        <div className="grid gap-6 mt-6">
            {newsList.map((article) => (
                <div key={article.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
                {isAdmin && <button onClick={() => handleDelete(article.id)} className="absolute top-2 right-2 z-10 bg-red-100 text-red-600 p-2 rounded-full">✕</button>}
                <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-32 h-32 bg-gray-100 flex-shrink-0"><img src={article.image} className="w-full h-full object-cover" alt="" /></div>
                    <div className="p-5 flex-1">
                        <h3 className="text-lg font-bold text-gray-900 leading-snug cursor-pointer" onClick={() => toggleArticle(article.id)}>{article.title}</h3>
                        <p className="text-xs text-gray-400 mb-3">{article.date}</p>
                        <p className="text-sm text-gray-600 mb-4">{article.summary}</p>
                        {selectedId === article.id && <div className="mt-4 pt-4 border-t border-gray-100"><p className="text-sm text-gray-800 whitespace-pre-line">{article.content}</p></div>}
                        <button onClick={() => toggleArticle(article.id)} className="text-indigo-600 text-xs font-bold uppercase">{selectedId === article.id ? 'ઓછું વાંચો' : 'વધુ વાંચો'}</button>
                    </div>
                </div>
                </div>
            ))}
        </div>
      )}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg p-6">
                <form onSubmit={handleAddNews} className="space-y-4">
                    <input type="text" required value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="w-full p-2 border rounded" />
                    <textarea required value={summary} onChange={e => setSummary(e.target.value)} placeholder="Summary" className="w-full p-2 border rounded" />
                    <textarea required value={content} onChange={e => setContent(e.target.value)} placeholder="Content" className="w-full p-2 border rounded" rows={5} />
                    <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded font-bold">પબ્લિશ</button>
                    <button type="button" onClick={() => setShowForm(false)} className="w-full text-xs text-gray-500">Cancel</button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default NewsSection;