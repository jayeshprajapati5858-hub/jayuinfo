import React, { useState, useEffect } from 'react';
import { pool } from '../utils/db';
import { GoogleGenAI, Type } from "@google/genai";

interface Article {
  id?: number;
  title: string;
  date: string;
  summary: string;
  content: string;
  category: string;
  source_urls?: string[];
  isAi?: boolean;
}

const NewsSection: React.FC = () => {
  const [newsList, setNewsList] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pin, setPin] = useState('');

  // 1. Fetch Existing News & Check for Daily Sync
  const fetchNews = async () => {
    setLoading(true);
    try {
      const result = await pool.query('SELECT * FROM news ORDER BY id DESC LIMIT 20');
      const data = result.rows;
      setNewsList(data);

      // Check if we need to sync today's news
      const today = new Date().toLocaleDateString('gu-IN');
      const hasTodayNews = data.some((a: any) => a.date === today);

      if (!hasTodayNews && data.length > 0) {
        autoSyncDailyNews();
      }
    } catch (err) {
      console.error("Fetch News Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Auto-Sync 10 News Articles using Gemini
  const autoSyncDailyNews = async () => {
    if (syncing) return;
    setSyncing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Generate exactly 10 latest and unique news articles in Gujarati about Gujarat government schemes (like i-Khedut, Ration Card, Sukanya, PM Kisan) and agricultural updates for today. 
      For each article, provide: 
      1. A catchy title 
      2. A short 2-line summary 
      3. Detailed content (3-4 paragraphs)
      4. Category (e.g., 'ખેતી', 'યોજના', 'સહાય')
      Use Google Search to ensure the info is from today's or yesterday's official notifications. Return the data in a clean structured way.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                summary: { type: Type.STRING },
                content: { type: Type.STRING },
                category: { type: Type.STRING }
              },
              required: ["title", "summary", "content", "category"]
            }
          }
        },
      });

      const rawJson = response.text;
      const parsedNews: any[] = JSON.parse(rawJson || "[]");
      const today = new Date().toLocaleDateString('gu-IN');

      // Save to Database
      for (const item of parsedNews) {
        await pool.query(
          `INSERT INTO news (title, summary, content, category, date) VALUES ($1, $2, $3, $4, $5)`,
          [item.title, item.summary, item.content, item.category, today]
        );
      }

      // Refresh list
      const finalResult = await pool.query('SELECT * FROM news ORDER BY id DESC LIMIT 20');
      setNewsList(finalResult.rows);
    } catch (err) {
      console.error("Auto-Sync Error:", err);
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234') { setIsAdmin(true); setShowLogin(false); setPin(''); } 
    else { alert('ખોટો પિન!'); }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('આ લેખ કાઢી નાખવો છે?')) {
      await pool.query('DELETE FROM news WHERE id = $1', [id]);
      setNewsList(prev => prev.filter(a => a.id !== id));
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 animate-fade-in pb-20">
      {/* Header & Status */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 border-l-4 border-indigo-600 pl-3 uppercase tracking-tighter">ડેઈલી સમાચાર પોર્ટલ</h2>
          <div className="flex items-center gap-2 mt-1 ml-3">
             <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">AI Auto-Sync Active</p>
          </div>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          {syncing && (
             <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-[10px] font-black flex items-center gap-2">
                <span className="animate-spin h-3 w-3 border-2 border-emerald-600 border-t-transparent rounded-full"></span>
                તાજા સમાચાર અપડેટ થઈ રહ્યા છે...
             </div>
          )}
          {!isAdmin && <button onClick={() => setShowLogin(true)} className="text-[10px] text-gray-300">Admin</button>}
        </div>
      </div>

      {/* News Feed */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-20"><div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div></div>
        ) : newsList.length === 0 ? (
          <div className="bg-white p-12 rounded-[2rem] text-center border border-dashed border-gray-200">
             <p className="text-gray-400 font-bold">સમાચાર લોડ થઈ રહ્યા છે, કૃપા કરીને થોડી રાહ જુઓ...</p>
             <button onClick={autoSyncDailyNews} className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-xl text-xs font-bold">Manual Sync</button>
          </div>
        ) : (
          newsList.map((article) => (
            <div key={article.id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 md:p-8 hover:shadow-xl transition-all group">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest bg-indigo-50 text-indigo-700">
                  {article.category}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400 font-bold">{article.date}</span>
                  {isAdmin && (
                    <button onClick={() => handleDelete(article.id!)} className="text-red-300 hover:text-red-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  )}
                </div>
              </div>
              
              <h3 className="text-xl font-black text-gray-900 leading-tight mb-3 group-hover:text-indigo-600 transition-colors" onClick={() => setSelectedId(selectedId === article.id ? null : article.id!)}>
                {article.title}
              </h3>
              
              <p className="text-sm text-gray-500 mb-4">{article.summary}</p>

              {selectedId === article.id && (
                <div className="mt-6 pt-6 border-t border-gray-100 animate-fade-in space-y-4">
                  <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm md:text-base bg-gray-50 p-6 rounded-2xl border border-gray-200">
                    {article.content}
                  </div>
                </div>
              )}

              <button 
                onClick={() => setSelectedId(selectedId === article.id ? null : article.id!)} 
                className="text-indigo-600 font-black text-xs uppercase tracking-widest flex items-center gap-2 mt-4"
              >
                {selectedId === article.id ? 'ઓછું વાંચો' : 'વધુ વાંચો'} →
              </button>
            </div>
          ))
        )}
      </div>

      {showLogin && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <form onSubmit={handleLogin} className="bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-xs text-center">
            <h3 className="font-black text-xl mb-6">એડમિન લૉગિન</h3>
            <input type="password" value={pin} onChange={e => setPin(e.target.value)} placeholder="PIN" className="w-full bg-gray-50 p-4 rounded-xl mb-4 text-center outline-none border border-gray-100 focus:border-indigo-500" autoFocus />
            <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold">Login</button>
            <button type="button" onClick={() => setShowLogin(false)} className="mt-4 text-xs text-gray-400">કેન્સલ</button>
          </form>
        </div>
      )}
    </div>
  );
};
export default NewsSection;