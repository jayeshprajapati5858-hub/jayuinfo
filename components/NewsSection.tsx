
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

// Helper to get dynamic date (Today/Yesterday) for fallback data
const getDynamicDate = (daysAgo: number = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString('gu-IN', { day: 'numeric', month: 'long', year: 'numeric' });
};

// Extended Fallback images library for variety
const fallbackImages = [
    "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80", // Farmer Field
    "https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?auto=format&fit=crop&w=800&q=80", // Indian Village Street
    "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80", // Green Field
    "https://images.unsplash.com/photo-1530933449625-7f58d9b32564?auto=format&fit=crop&w=800&q=80", // Rural Life
    "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=800&q=80", // Farming Crops
    "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80", // Tech Agriculture
    "https://images.unsplash.com/photo-1592985651348-185e50523097?auto=format&fit=crop&w=800&q=80", // Indian Woman Farmer
    "https://images.unsplash.com/photo-1561085203-d6874479bd72?auto=format&fit=crop&w=800&q=80", // Tractor
    "https://images.unsplash.com/photo-1597816027376-74944fb0b343?auto=format&fit=crop&w=800&q=80", // Monsoon Clouds
    "https://images.unsplash.com/photo-1589883661923-6476cf0ce7f1?auto=format&fit=crop&w=800&q=80"  // Market Yard
];

// Fallback news now uses dynamic dates
const fallbackNews: Article[] = [
    {
        id: 101,
        title: "ખેડૂતો માટે ખુશખબર: પાક વીમા યોજનામાં નવા ફેરફાર",
        date: getDynamicDate(0), // Today
        summary: "રાજ્ય સરકાર દ્વારા ખેડૂતો માટે નવી જાહેરાત કરવામાં આવી છે. હવે પાક નુકસાનનું વળતર ઝડપથી મળશે.",
        content: "ગાંધીનગર: રાજ્યના કૃષિ મંત્રી રાઘવજી પટેલે ખેડૂતો માટે મહત્વનો નિર્ણય લીધો છે. હવેથી પાક નુકસાન સર્વે 7 દિવસમાં પૂર્ણ કરી સહાય ચૂકવવામાં આવશે. આ નિર્ણયથી ખેડૂતોને મોટી રાહત મળશે.",
        category: "ખેતીવાડી",
        image: fallbackImages[0]
    },
    {
        id: 102,
        title: "જીરું અને વરિયાળીના ભાવમાં આજનો ઉછાળો",
        date: getDynamicDate(0), // Today
        summary: "આજના માર્કેટ યાર્ડ ભાવ મુજબ જીરું અને વરિયાળીના ભાવમાં સુધારો જોવા મળ્યો છે.",
        content: "આજે ઊંઝા અને ધ્રાંગધ્રા માર્કેટ યાર્ડમાં જીરુંના ભાવમાં મણે ૫૦ રૂપિયાનો વધારો જોવા મળ્યો છે. નિકાસની માંગ નીકળતા ભાવમાં તેજી છે.",
        category: "બજાર ભાવ",
        image: fallbackImages[5]
    },
    {
        id: 103,
        title: "સુકન્યા સમૃદ્ધિ યોજનામાં વ્યાજદરમાં વધારો",
        date: getDynamicDate(1), // Yesterday
        summary: "દીકરીઓના ભવિષ્ય માટે સરકારની સુકન્યા યોજનામાં વ્યાજદરમાં વધારો કરવામાં આવ્યો છે.",
        content: "કેન્દ્ર સરકારે નાની બચત યોજનાઓના વ્યાજદરમાં ફેરફાર કર્યો છે. સુકન્યા સમૃદ્ધિ યોજનામાં હવે ૮.૨% વ્યાજ મળશે.",
        category: "યોજના",
        image: fallbackImages[2]
    }
];

const NewsSection: React.FC = () => {
  const [newsList, setNewsList] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pin, setPin] = useState('');

  const todayStr = new Date().toLocaleDateString('gu-IN');

  const generateImageForNews = async (title: string, index: number): Promise<string> => {
    // Check if we are in a cooldown period for images
    const lastImgError = localStorage.getItem('lastImgError');
    if (lastImgError && Date.now() - parseInt(lastImgError) < 30 * 60 * 1000) { // 30 min cooldown
        return fallbackImages[index % fallbackImages.length];
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: `A realistic, high-quality news photo for an article titled: "${title}". Context: Rural India, Gujarat, Agriculture, Villages. No text in image. 16:9 aspect ratio.`,
            },
          ],
        },
        config: { 
            imageConfig: { 
                aspectRatio: "16:9"
            } 
        },
      });

      const parts = response.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return fallbackImages[index % fallbackImages.length];
    } catch (err: any) { 
        console.warn("Image Gen Error:", err);
        // If quota exceeded, set timestamp to avoid retrying immediately
        if (err?.message?.includes('429') || err?.message?.includes('quota')) {
            localStorage.setItem('lastImgError', Date.now().toString());
        }
        return fallbackImages[index % fallbackImages.length]; 
    }
  };

  const autoSyncDailyNews = useCallback(async (force = false) => {
    if (syncing) return;

    // Check quota cooldown (1 hour), unless forced
    const lastQuotaError = localStorage.getItem('lastQuotaError');
    if (!force && lastQuotaError && Date.now() - parseInt(lastQuotaError) < 60 * 60 * 1000) {
        console.log("Skipping sync due to recent quota error.");
        return;
    }

    setSyncing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `Act as a Gujarati News Reporter for a rural village app. 
      Today is ${todayStr}.
      Generate 4 *FRESH*, *UNIQUE* and *LATEST* news articles relevant to Gujarat villagers/farmers.
      
      MANDATORY TOPICS (Mix these):
      1. Today's Weather Alert (Heat/Rain/Cold based on current actual date).
      2. Latest Agriculture Market Price trends (Cotton, Jeera, Groundnut) - Make sure prices are realistic for ${todayStr}.
      3. Government Scheme Update.
      4. Local Gujarat News.

      Output JSON format: [{ "title": "...", "summary": "...", "content": "...", "category": "..." }]
      Language: Gujarati only. Content length: 120 words per article. Make it sound very recent.`;

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
        let index = 0;
        for (const item of parsedNews) {
          if (!item.title || !item.content) continue;
          
          // Check if duplicate for today
          const existing = await pool.query('SELECT id, image FROM news WHERE title = $1 AND date = $2', [item.title, todayStr]);
          
          if (existing.rows.length === 0) {
            const imageUrl = await generateImageForNews(item.title, index);
            await pool.query(
              `INSERT INTO news (title, summary, content, category, date, image) VALUES ($1, $2, $3, $4, $5, $6)`,
              [item.title, item.summary || '', item.content, item.category || 'સમાચાર', todayStr, imageUrl]
            );
          } else if (!existing.rows[0].image) {
            // Retry image if missing
            const imageUrl = await generateImageForNews(item.title, index);
            if (imageUrl) {
                await pool.query(`UPDATE news SET image = $1 WHERE id = $2`, [imageUrl, existing.rows[0].id]);
            }
          }
          index++;
        }
        // Refresh list
        const refresh = await pool.query('SELECT * FROM news ORDER BY id DESC LIMIT 20');
        setNewsList(refresh.rows);
      }
    } catch (err: any) {
      console.error("Auto-Sync Failed:", err);
      if (err?.message?.includes('quota') || err?.message?.includes('limit') || err?.message?.includes('429')) {
          localStorage.setItem('lastQuotaError', Date.now().toString());
      }
    } finally {
      setSyncing(false);
    }
  }, [syncing, todayStr]);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      await pool.query(`CREATE TABLE IF NOT EXISTS news (id SERIAL PRIMARY KEY, title TEXT, summary TEXT, content TEXT, category TEXT, date TEXT, image TEXT)`);
      const result = await pool.query('SELECT * FROM news ORDER BY id DESC LIMIT 20');
      const data = result.rows;
      
      if (data.length > 0) {
          setNewsList(data);
          // Check if we have news for TODAY. If not, trigger sync.
          const todaysNews = data.filter((a: any) => a.date === todayStr);
          if (todaysNews.length === 0) { 
              console.log("No news for today found in DB, syncing...");
              autoSyncDailyNews(true); 
          }
      } else {
          setNewsList(fallbackNews);
          autoSyncDailyNews(true);
      }
    } catch (err: any) { 
        console.error("Fetch Error:", err);
        setNewsList(fallbackNews);
    } finally { 
        setLoading(false); 
    }
  }, [autoSyncDailyNews, todayStr]);

  useEffect(() => { fetchNews(); }, [fetchNews]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 animate-fade-in pb-20">
      <div className="mb-8 text-center relative">
          <div className="flex flex-col items-center gap-2">
             <div className="inline-block bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">
                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${syncing ? 'bg-orange-500 animate-ping' : 'bg-emerald-500'}`}></span>
                    {syncing ? 'સમાચાર અપડેટ થઈ રહ્યા છે...' : `આજની તારીખ: ${todayStr}`}
                </span>
             </div>
             {!syncing && (
                <button onClick={() => autoSyncDailyNews(true)} className="text-[10px] text-emerald-600 font-bold underline cursor-pointer hover:text-emerald-800">
                   🔄 Refresh Latest News
                </button>
             )}
          </div>
          <h2 className="text-3xl font-black text-gray-900 mt-2">તાજા સમાચાર અને લેખ</h2>
      </div>

      <div className="space-y-12">
        {loading && newsList.length === 0 ? (
          <div className="text-center py-20 opacity-30 flex flex-col items-center gap-4">
             <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
             <p>સમાચાર લોડ થઈ રહ્યા છે...</p>
          </div>
        ) : (
          newsList.map((article, idx) => (
            <div key={article.id || idx} className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-500">
              <div className="aspect-[16/9] w-full bg-gray-100 relative overflow-hidden">
                {article.image ? (
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" loading="lazy" />
                ) : (
                  <img src={fallbackImages[idx % fallbackImages.length]} alt="Fallback" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-90" />
                )}
                <div className="absolute top-6 left-6">
                  <span className="text-[10px] font-black px-4 py-1.5 rounded-full uppercase bg-white/90 text-emerald-700 backdrop-blur-md shadow-lg">{article.category}</span>
                </div>
              </div>

              <div className="p-8 md:p-12">
                <p className="text-[10px] text-gray-400 font-bold mb-4 flex items-center gap-2">
                   <span className={`w-1.5 h-1.5 rounded-full ${article.date === todayStr ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></span>
                   {article.date}
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
                       <button onClick={() => {
                          const text = `📢 *${article.title}*\n\n${article.summary}\n\nવધુ વાંચો: https://www.jayuinfo.in`;
                          window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                       }} className="w-full md:w-auto bg-green-500 text-white px-8 py-3 rounded-2xl shadow-xl shadow-green-100 flex items-center justify-center gap-2 text-sm font-black active:scale-95 transition-all">
                          WhatsApp પર મોકલો
                       </button>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center mt-6">
                  <button onClick={() => setSelectedId(selectedId === article.id ? null : article.id!)} className="text-emerald-600 font-black text-xs uppercase tracking-[0.2em] border-b-2 border-emerald-100 hover:border-emerald-500 transition-all pb-1">
                    {selectedId === article.id ? 'ઓછું વાંચો ↑' : 'સંપૂર્ણ સમાચાર વાંચો ↓'}
                  </button>
                  {isAdmin && (
                    <button onClick={async () => {
                      if(confirm('Delete?')) {
                        try {
                            await pool.query('DELETE FROM news WHERE id = $1', [article.id]);
                            setNewsList(newsList.filter(n => n.id !== article.id));
                        } catch(e) { alert("Delete failed"); }
                      }
                    }} className="text-red-300 hover:text-red-500 transition-colors p-2">
                      Delete
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
