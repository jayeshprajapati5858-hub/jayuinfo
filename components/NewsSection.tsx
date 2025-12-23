
import React, { useState, useEffect, useCallback } from 'react';
import { pool } from '../utils/db';
import { GoogleGenAI, Type } from "@google/genai";

interface Article {
  id?: number;
  title: string;
  date: string;
  summary: string;
  content: string;
  category: string;
  image?: string;
}

const NewsSection: React.FC = () => {
  const [newsList, setNewsList] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pin, setPin] = useState('');

  const todayStr = new Date().toLocaleDateString('gu-IN');

  const generateImageForNews = async (title: string): Promise<string | null> => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: `High-quality, realistic journalistic photography representing: ${title}. Showing Gujarat farmers, modern technology, or government schemes. Authentic Indian rural setting.`,
            },
          ],
        },
        config: { imageConfig: { aspectRatio: "16:9" } },
      });

      // Fixed TS18048 & TS2532: Added optional chaining
      const parts = response.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (err) { return null; }
  };

  const autoSyncDailyNews = useCallback(async () => {
    if (syncing) return;
    setSyncing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `Generate 5 professional Gujarati news articles for ${todayStr}. 
      Articles must be original, helpful for farmers, and formatted as long-form blog posts (300+ words).
      Topics: 1. Latest APMC Market trends. 2. Educational help for students. 3. New Agricultural subsidies. 4. Weather forecast for Saurashtra.
      Return as a valid JSON array of objects with title, summary, content, and category.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
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

      if (parsedNews.length > 0) {
        for (const item of parsedNews) {
          if (!item.title || !item.content) continue;
          const existing = await pool.query('SELECT id FROM news WHERE title = $1 AND date = $2', [item.title, todayStr]);
          if (existing.rows.length === 0) {
            const imageUrl = await generateImageForNews(item.title);
            await pool.query(
              `INSERT INTO news (title, summary, content, category, date, image) VALUES ($1, $2, $3, $4, $5, $6)`,
              [item.title, item.summary || '', item.content, item.category || 'સમાચાર', todayStr, imageUrl]
            );
          }
        }
        const refresh = await pool.query('SELECT * FROM news ORDER BY id DESC LIMIT 20');
        setNewsList(refresh.rows);
      }
    } catch (err) {
      console.error("Auto-Sync Failed:", err);
    } finally {
      setSyncing(false);
    }
  }, [syncing, todayStr]);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const result = await pool.query('SELECT * FROM news ORDER BY id DESC LIMIT 20');
      const data = result.rows;
      setNewsList(data);
      const hasTodayNews = data.some((a: any) => a.date === todayStr);
      if (!hasTodayNews) { autoSyncDailyNews(); }
    } catch (err) { } finally { setLoading(false); }
  }, [autoSyncDailyNews, todayStr]);

  useEffect(() => { fetchNews(); }, [fetchNews]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 animate-fade-in pb-20">
      <div className="mb-10 text-center">
          <h2 className="text-3xl font-black text-gray-900 mb-2">તાજા સમાચાર અને લેખ</h2>
          <p className="text-xs text-emerald-600 font-black uppercase tracking-[0.2em]">Latest Updates: {todayStr}</p>
      </div>

      <div className="space-y-12">
        {loading && newsList.length === 0 ? (
          <div className="text-center py-20 opacity-30">માહિતી ચેક થઈ રહી છે...</div>
        ) : (
          newsList.map((article, idx) => (
            <div key={article.id || idx} className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-500">
              <div className="aspect-[16/8] w-full bg-gray-50 relative overflow-hidden">
                {article.image ? (
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-200">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </div>
                )}
                <div className="absolute top-6 left-6">
                  <span className="text-[10px] font-black px-4 py-1.5 rounded-full uppercase bg-white/90 text-emerald-700 backdrop-blur-md shadow-lg">{article.category}</span>
                </div>
              </div>

              <div className="p-8 md:p-12">
                <p className="text-[10px] text-gray-400 font-bold mb-4 flex items-center gap-2">
                   <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                   {article.date} | પ્રસ્તુતકર્તા: ભરાડા ડિજિટલ ડેસ્ક
                </p>
                <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 cursor-pointer group-hover:text-emerald-600 transition-colors leading-tight" onClick={() => setSelectedId(selectedId === article.id ? null : article.id!)}>
                  {article.title}
                </h3>
                <p className="text-base text-gray-500 mb-8 leading-relaxed line-clamp-3">{article.summary}</p>
                
                {selectedId === article.id && (
                  <div className="mt-8 pt-8 border-t border-gray-100 animate-fade-in text-gray-800 text-lg leading-loose whitespace-pre-wrap">
                    <div className="prose prose-emerald prose-lg max-w-none mb-10 font-medium">
                      {article.content}
                    </div>
                    <div className="bg-gray-50 p-6 rounded-[2rem] flex flex-col md:flex-row justify-between items-center gap-4 border border-gray-100">
                       <div className="text-center md:text-left">
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">આ સમાચાર ગમ્યા? શેર કરો:</p>
                       </div>
                       <button onClick={() => {
                          const text = `📢 *${article.title}*\n\n${article.summary}\n\nવધુ વાંચો: https://www.jayuinfo.in`;
                          window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                       }} className="bg-green-500 text-white px-8 py-3 rounded-2xl shadow-xl shadow-green-100 flex items-center gap-2 text-sm font-black active:scale-95 transition-all">
                          WhatsApp Share
                       </button>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center mt-6">
                  <button onClick={() => setSelectedId(selectedId === article.id ? null : article.id!)} className="text-emerald-600 font-black text-xs uppercase tracking-[0.2em] border-b-2 border-emerald-100 hover:border-emerald-500 transition-all pb-1">
                    {selectedId === article.id ? 'ઓછું વાંચો ↑' : 'સંપૂર્ણ આર્ટિકલ વાંચો ↓'}
                  </button>
                  {isAdmin && (
                    <button onClick={async () => {
                      if(confirm('Delete?')) {
                        await pool.query('DELETE FROM news WHERE id = $1', [article.id]);
                        setNewsList(newsList.filter(n => n.id !== article.id));
                      }
                    }} className="text-red-300 hover:text-red-500 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showLogin && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <form onSubmit={(e) => { e.preventDefault(); if (pin === '1234') { setIsAdmin(true); setShowLogin(false); setPin(''); } else { alert('Error'); } }} className="bg-white p-8 rounded-[2.5rem] shadow-2xl w-full max-w-xs text-center border border-gray-100">
            <h3 className="font-black text-xl mb-6">એડમિન લૉગિન</h3>
            <input type="password" value={pin} onChange={e => setPin(e.target.value)} placeholder="PIN" className="w-full bg-gray-50 p-4 rounded-2xl mb-4 text-center border-none outline-none focus:ring-2 focus:ring-emerald-100" autoFocus />
            <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black">Login</button>
            <button type="button" onClick={() => setShowLogin(false)} className="mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">કેન્સલ</button>
          </form>
        </div>
      )}
      {!isAdmin && <div className="mt-20 text-center"><button onClick={() => setShowLogin(true)} className="text-[10px] text-gray-200 hover:text-gray-400 font-bold uppercase tracking-widest transition-colors">Admin Access</button></div>}
    </div>
  );
};
export default NewsSection;
