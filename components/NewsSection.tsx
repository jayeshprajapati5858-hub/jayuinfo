
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

  const autoSyncDailyNews = useCallback(async () => {
    if (syncing) return;
    setSyncing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `Generate 8 professional and authentic news articles in Gujarati specifically for today, ${todayStr}. 
      Target Audience: Farmers and rural citizens of Gujarat.
      Focus on:
      1. New Government Resolutions (GR) from Gujarat Cabinet.
      2. i-Khedut portal updates for May 2024 equipment subsidies.
      3. Weather alert for Saurashtra/Surendranagar region for the coming 48 hours.
      4. PM-Kisan installment updates or Digital Gujarat scholarship deadlines.
      
      Format:
      - Title: High-impact, news-style headline.
      - Summary: Clear 2-line summary.
      - Content: Detailed 200-300 word report with 'How to apply' or 'Key benefits' section.
      - Category: 'ખેતી', 'યોજના', or 'સમાચાર'.
      
      Return as a valid JSON array of objects.`;

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

      if (parsedNews.length > 0) {
        for (const item of parsedNews) {
          // Check if similar title exists to avoid duplicates in rapid sync
          const existing = await pool.query('SELECT id FROM news WHERE title = $1 AND date = $2', [item.title, todayStr]);
          if (existing.rows.length === 0) {
            await pool.query(
              `INSERT INTO news (title, summary, content, category, date) VALUES ($1, $2, $3, $4, $5)`,
              [item.title, item.summary, item.content, item.category, todayStr]
            );
          }
        }
        // Refresh local state
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
      
      // Auto-trigger sync if today's news is missing
      const hasTodayNews = data.some((a: any) => a.date === todayStr);
      if (!hasTodayNews) {
        console.log("News for today is missing. Triggering background sync...");
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
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 ml-3">લેટેસ્ટ અપડેટ્સ: {todayStr}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
           {syncing && (
             <div className="text-[9px] bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full animate-pulse font-black border border-indigo-100 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                નવી માહિતી અપડેટ થઈ રહી છે...
             </div>
           )}
           {isAdmin && (
             <button 
                onClick={autoSyncDailyNews} 
                disabled={syncing}
                className="bg-indigo-600 text-white text-[10px] font-black px-4 py-2 rounded-xl shadow-lg hover:bg-indigo-700 disabled:opacity-50 transition-all uppercase tracking-widest"
             >
               {syncing ? 'Syncing...' : 'મેન્યુઅલ અપડેટ ⚡'}
             </button>
           )}
        </div>
      </div>

      <div className="space-y-6">
        {loading && newsList.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xs text-gray-400 font-bold">માહિતી ચેક થઈ રહી છે...</p>
          </div>
        ) : newsList.length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 p-12 rounded-[2.5rem] text-center">
             <p className="text-gray-400 font-bold italic mb-4">હાલમાં કોઈ સમાચાર ઉપલબ્ધ નથી.</p>
             <button onClick={autoSyncDailyNews} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg">સમાચાર લોડ કરો</button>
          </div>
        ) : (
          newsList.map((article, idx) => (
            <React.Fragment key={article.id || idx}>
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-6 md:p-8 hover:shadow-lg transition-all relative overflow-hidden group">
                {article.date === todayStr && (
                  <div className="absolute top-0 right-0 bg-red-500 text-white text-[8px] font-black px-4 py-1 rounded-bl-xl uppercase tracking-widest animate-pulse">નવું</div>
                )}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black px-4 py-1.5 rounded-full uppercase bg-indigo-50 text-indigo-700 tracking-wider">{article.category}</span>
                  <span className="text-[10px] text-gray-400 font-bold">{article.date}</span>
                </div>
                <h3 className="text-lg md:text-xl font-black text-gray-900 mb-3 cursor-pointer group-hover:text-indigo-600 transition-colors leading-tight" onClick={() => setSelectedId(selectedId === article.id ? null : article.id!)}>
                  {article.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed line-clamp-2">{article.summary}</p>
                
                {selectedId === article.id && (
                  <div className="mt-6 pt-6 border-t border-gray-100 animate-fade-in text-gray-700 text-sm leading-relaxed whitespace-pre-wrap bg-gray-50 p-6 rounded-3xl">
                    <div className="prose prose-sm max-w-none mb-6">
                      {article.content}
                    </div>
                    <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100">
                       <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">સ્રોત: કૃષિ વિભાગ સમાચાર</p>
                       <button onClick={() => {
                          const text = `📢 *${article.title}*\n\n${article.summary}\n\nવધુ વાંચો: https://www.jayuinfo.in`;
                          window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                       }} className="bg-green-500 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 text-[10px] font-black">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.18-.573c.978.539 2.027.823 3.151.824h.001c3.181 0 5.767-2.586 5.768-5.766.001-3.18-2.585-5.766-5.77-5.766zm3.364 8.162c-.149.418-.752.766-1.04.811-.273.045-.615.084-1.017-.046-.248-.08-.57-.183-.93-.339-1.536-.653-2.531-2.204-2.607-2.305-.075-.1-.615-.818-.615-1.56s.385-1.104.52-1.254c.135-.15.295-.187.393-.187.098 0 .196.001.282.005.089.004.21-.034.328.254.122.296.417 1.015.453 1.09.036.075.059.163.009.263-.05.1-.075.163-.149.251-.075.088-.158.196-.225.263-.075.075-.153.157-.066.307.086.15.383.633.821 1.023.565.503 1.041.659 1.191.734.15.075.238.063.326-.038.088-.1.376-.438.476-.588.1-.15.2-.125.338-.075.138.05.875.413 1.025.488s.25.113.288.175c.037.062.037.359-.112.777z"/></svg>
                          WhatsApp Share
                       </button>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center mt-4">
                  <button onClick={() => setSelectedId(selectedId === article.id ? null : article.id!)} className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em]">
                    {selectedId === article.id ? 'ઓછું વાંચો ↑' : 'વધુ માહિતી વાંચો ↓'}
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
            </React.Fragment>
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
