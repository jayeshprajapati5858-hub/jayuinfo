
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
              text: `A professional, realistic news photograph for a Gujarati news article titled: "${title}". The style should be high-quality journalism photography, showing rural Gujarat, farmers, or government offices where appropriate. No text in the image.`,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9"
          }
        },
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (err) {
      console.error("Image Gen Error:", err);
      return null;
    }
  };

  const autoSyncDailyNews = useCallback(async () => {
    if (syncing) return;
    setSyncing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `Generate 5 professional and authentic news articles in Gujarati specifically for today, ${todayStr}. 
      Target Audience: Farmers and rural citizens of Gujarat.
      Focus on:
      1. New Government Resolutions (GR) from Gujarat Cabinet.
      2. i-Khedut portal updates.
      3. Weather alerts or APMC market trends.
      
      Format:
      - Title: High-impact headline.
      - Summary: 2-line summary.
      - Content: Detailed 200-300 word report.
      - Category: 'ખેતી', 'યોજના', or 'સમાચાર'.
      
      Return as a valid JSON array of objects.`;

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
            // Generate photo for each news
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
      if (!hasTodayNews) {
        autoSyncDailyNews();
      }
    } catch (err) { 
      console.error("Fetch Error:", err); 
    } finally { 
      setLoading(false); 
    }
  }, [autoSyncDailyNews, todayStr]);

  useEffect(() => { 
    fetchNews(); 
  }, [fetchNews]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 animate-fade-in pb-20">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-gray-900 border-l-4 border-indigo-600 pl-3">સરકારી સમાચાર (Live)</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 ml-3">ફોટો સાથે લેટેસ્ટ અપડેટ્સ: {todayStr}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
           {syncing && (
             <div className="text-[9px] bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full animate-pulse font-black border border-indigo-100 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                ફોટો સાથે સમાચાર તૈયાર થઈ રહ્યા છે...
             </div>
           )}
        </div>
      </div>

      <div className="space-y-8">
        {loading && newsList.length === 0 ? (
          <div className="text-center py-20 opacity-30">માહિતી ચેક થઈ રહી છે...</div>
        ) : (
          newsList.map((article, idx) => (
            <div key={article.id || idx} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-500">
              {/* News Image */}
              <div className="aspect-video w-full bg-gray-100 relative overflow-hidden">
                {article.image ? (
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </div>
                )}
                {article.date === todayStr && (
                  <div className="absolute top-4 right-4 bg-red-600 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">નવું</div>
                )}
                <div className="absolute bottom-4 left-4">
                  <span className="text-[10px] font-black px-3 py-1 rounded-lg uppercase bg-white/90 text-indigo-700 backdrop-blur-sm shadow-sm">{article.category}</span>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] text-gray-400 font-bold">{article.date}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-4 cursor-pointer group-hover:text-indigo-600 transition-colors leading-tight" onClick={() => setSelectedId(selectedId === article.id ? null : article.id!)}>
                  {article.title}
                </h3>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed line-clamp-2">{article.summary}</p>
                
                {selectedId === article.id && (
                  <div className="mt-6 pt-6 border-t border-gray-100 animate-fade-in text-gray-700 text-sm leading-relaxed whitespace-pre-wrap bg-gray-50 p-6 rounded-3xl">
                    <div className="prose prose-sm max-w-none mb-6">
                      {article.content}
                    </div>
                    <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100">
                       <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest font-sans">Source: Digital Panchayat Intelligence</p>
                       <button onClick={() => {
                          const text = `📢 *${article.title}*\n\n${article.summary}\n\nવધુ વાંચો: https://www.jayuinfo.in`;
                          window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                       }} className="bg-green-500 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 text-[10px] font-black active:scale-95 transition-all">
                          WhatsApp Share
                       </button>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center mt-4">
                  <button onClick={() => setSelectedId(selectedId === article.id ? null : article.id!)} className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em]">
                    {selectedId === article.id ? 'ઓછું વાંચો ↑' : 'સંપૂર્ણ સમાચાર વાંચો ↓'}
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
          <form onSubmit={(e) => { e.preventDefault(); if (pin === '1234') { setIsAdmin(true); setShowLogin(false); setPin(''); } else { alert('Error'); } }} className="bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-xs text-center border border-gray-100">
            <h3 className="font-black text-xl mb-6">એડમિન લૉગિન</h3>
            <input type="password" value={pin} onChange={e => setPin(e.target.value)} placeholder="PIN" className="w-full bg-gray-50 p-4 rounded-2xl mb-4 text-center border-none outline-none focus:ring-2 focus:ring-indigo-100" autoFocus />
            <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 active:scale-95 transition-all">Login</button>
            <button type="button" onClick={() => setShowLogin(false)} className="mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">કેન્સલ</button>
          </form>
        </div>
      )}
      {!isAdmin && <div className="mt-20 text-center"><button onClick={() => setShowLogin(true)} className="text-[10px] text-gray-100 hover:text-gray-300 font-bold uppercase tracking-widest transition-colors">News Admin Access</button></div>}
    </div>
  );
};
export default NewsSection;
