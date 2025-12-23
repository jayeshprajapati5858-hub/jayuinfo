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
}

const NewsSection: React.FC = () => {
  const [newsList, setNewsList] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pin, setPin] = useState('');

  const fetchNews = async () => {
    setLoading(true);
    try {
      const result = await pool.query('SELECT * FROM news ORDER BY id DESC LIMIT 20');
      const data = result.rows;
      setNewsList(data);
      const today = new Date().toLocaleDateString('gu-IN');
      if (!data.some((a: any) => a.date === today)) {
        autoSyncDailyNews();
      }
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  const autoSyncDailyNews = async () => {
    if (syncing) return;
    setSyncing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // High-quality prompt for AdSense value
      const prompt = `Write 10 highly detailed news articles in Gujarati about the latest Gujarat government notifications (like i-Khedut, Digital Gujarat, PM-Kisan) for today. 
      For each article:
      - Title: Catchy and specific.
      - Summary: Clear 2-line intro.
      - Content: Detailed breakdown including 'Who is eligible', 'Benefits', and 'How to apply' (at least 200 words).
      - Category: 'ખેતી', 'યોજના', or 'સમાચાર'.
      Ensure the information is useful for villagers. Return in JSON array.`;

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

      const parsedNews = JSON.parse(response.text || "[]");
      const today = new Date().toLocaleDateString('gu-IN');

      for (const item of parsedNews) {
        await pool.query(
          `INSERT INTO news (title, summary, content, category, date) VALUES ($1, $2, $3, $4, $5)`,
          [item.title, item.summary, item.content, item.category, today]
        );
      }
      fetchNews();
    } catch (err) { console.error(err); } 
    finally { setSyncing(false); }
  };

  useEffect(() => { fetchNews(); }, []);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 animate-fade-in pb-20">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-gray-900 border-l-4 border-indigo-600 pl-3">સરકારી સમાચાર (Live)</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 ml-3">Verified Information Hub</p>
        </div>
        {syncing && <div className="text-[10px] bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full animate-pulse font-bold">નવી માહિતી અપડેટ થઈ રહી છે...</div>}
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-20"><div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div></div>
        ) : (
          newsList.map((article, idx) => (
            <React.Fragment key={article.id || idx}>
              {/* Ad Placement Suggestion for User */}
              {idx === 2 && (
                <div className="bg-gray-50 border-2 border-dashed border-gray-200 p-4 rounded-3xl text-center text-[10px] text-gray-400 font-bold mb-6">
                  AD PLACEMENT AREA (FOR ADSENSE)
                </div>
              )}

              <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 md:p-8 hover:shadow-lg transition-all">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black px-4 py-1.5 rounded-full uppercase bg-indigo-50 text-indigo-700">{article.category}</span>
                  <span className="text-[10px] text-gray-400 font-bold">{article.date}</span>
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3 cursor-pointer" onClick={() => setSelectedId(selectedId === article.id ? null : article.id!)}>{article.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{article.summary}</p>
                {selectedId === article.id && (
                  <div className="mt-6 pt-6 border-t border-gray-100 animate-fade-in text-gray-700 text-sm leading-relaxed whitespace-pre-wrap bg-gray-50 p-6 rounded-2xl">
                    {article.content}
                  </div>
                )}
                <button onClick={() => setSelectedId(selectedId === article.id ? null : article.id!)} className="text-indigo-600 font-black text-xs uppercase tracking-widest mt-4">
                  {selectedId === article.id ? 'ઓછું વાંચો' : 'વધુ માહિતી વાંચો'} →
                </button>
              </div>
            </React.Fragment>
          ))
        )}
      </div>

      {showLogin && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <form onSubmit={(e) => { e.preventDefault(); if (pin === '1234') { setIsAdmin(true); setShowLogin(false); } else { alert('Error'); } }} className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-xs text-center">
            <h3 className="font-black text-xl mb-6">એડમિન લૉગિન</h3>
            <input type="password" value={pin} onChange={e => setPin(e.target.value)} placeholder="PIN" className="w-full bg-gray-50 p-4 rounded-xl mb-4 text-center border outline-none focus:border-indigo-500" autoFocus />
            <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold">Login</button>
            <button type="button" onClick={() => setShowLogin(false)} className="mt-4 text-xs text-gray-400">કેન્સલ</button>
          </form>
        </div>
      )}
      {!isAdmin && <div className="mt-20 text-center"><button onClick={() => setShowLogin(true)} className="text-[10px] text-gray-300">Admin</button></div>}
    </div>
  );
};
export default NewsSection;