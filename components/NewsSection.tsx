
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

// Fallback images in case AI generation fails or quota exceeds
const fallbackImages = [
    "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80", // Farmer
    "https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?auto=format&fit=crop&w=800&q=80", // Village
    "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80", // Field
    "https://images.unsplash.com/photo-1530933449625-7f58d9b32564?auto=format&fit=crop&w=800&q=80", // Agriculture
    "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=800&q=80", // Farming
    "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80"  // Tech in Agri
];

const fallbackNews: Article[] = [
    {
        id: 101,
        title: "ખેડૂતો માટે ખુશખબર: પાક વીમા યોજનામાં ફેરફાર",
        date: "20 May 2024",
        summary: "રાજ્ય સરકાર દ્વારા ખેડૂતો માટે નવી જાહેરાત કરવામાં આવી છે. હવે પાક નુકસાનનું વળતર ઝડપથી મળશે.",
        content: "ગાંધીનગર: રાજ્યના કૃષિ મંત્રી રાઘવજી પટેલે ખેડૂતો માટે મહત્વનો નિર્ણય લીધો છે. હવેથી પાક નુકસાન સર્વે 7 દિવસમાં પૂર્ણ કરી સહાય ચૂકવવામાં આવશે. આ વર્ષે અતિવૃષ્ટિ અને કમોસમી વરસાદને કારણે થયેલા નુકસાનનું વળતર દિવાળી પહેલા ચૂકવવાનું આયોજન છે.",
        category: "ખેતીવાડી",
        image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 102,
        title: "ધોરણ 10 અને 12 નું પરિણામ જાહેર",
        date: "20 May 2024",
        summary: "ગુજરાત બોર્ડ દ્વારા ધોરણ ૧૦ અને ૧૨ ના પરિણામો વેબસાઈટ પર મુકાયા.",
        content: "ગુજરાત માધ્યમિક અને ઉચ્ચતર માધ્યમિક શિક્ષણ બોર્ડ દ્વારા માર્ચ-૨૦૨૪ માં લેવાયેલી પરીક્ષાનું પરિણામ જાહેર કરવામાં આવ્યું છે. વિદ્યાર્થીઓ બોર્ડની વેબસાઈટ પર અથવા વોટ્સએપ નંબર પર સીટ નંબર મોકલીને પરિણામ મેળવી શકે છે.",
        category: "શિક્ષણ",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 103,
        title: "સુકન્યા સમૃદ્ધિ યોજનામાં વ્યાજદરમાં વધારો",
        date: "20 May 2024",
        summary: "દીકરીઓના ભવિષ્ય માટે શ્રેષ્ઠ યોજના. હવે મળશે 8.2% વ્યાજ.",
        content: "કેન્દ્ર સરકારની સુકન્યા સમૃદ્ધિ યોજનામાં હવે વાર્ષિક 8.2% વ્યાજ મળશે. આ યોજનામાં 10 વર્ષથી નાની દીકરીના નામે ખાતું ખોલાવી શકાય છે. જેમાં વાર્ષિક ન્યૂનતમ 250 રૂપિયા જમા કરાવી શકાય છે.",
        category: "યોજના",
        image: "https://images.unsplash.com/photo-1623050040776-37b0c841c6f3?auto=format&fit=crop&w=800&q=80"
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
    try {
      if (localStorage.getItem('img_quota_exceeded') === 'true') {
          return fallbackImages[index % fallbackImages.length];
      }

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: `A professional, realistic news photograph related to: "${title}". Indian village context, agriculture, farmers, or government office. High quality, 4k, no text overlay.`,
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
        console.warn("Image Gen Skipped (Quota/Error)");
        if (err?.message?.includes('429') || err?.message?.includes('quota')) {
            localStorage.setItem('img_quota_exceeded', 'true');
        }
        return fallbackImages[index % fallbackImages.length]; 
    }
  };

  const autoSyncDailyNews = useCallback(async () => {
    if (syncing || localStorage.getItem('db_quota_exceeded') === 'true') return;
    setSyncing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `You are a Gujarati News Editor. Today is ${todayStr}.
      Generate 5 *FRESH* and *LATEST* news articles relevant to farmers in Gujarat.
      
      Topics to cover (Real-time simulation):
      1. Current Weather Forecast (Monsoon/Winter/Summer based on current month).
      2. Latest Market Prices (APMC) for Cotton, Groundnut, Jeera.
      3. New Government Subsidy or Scheme announcements (i-Khedut).
      4. General Gujarat state news relevant to villages.

      The content MUST be in Gujarati language.
      Return a JSON Array with: title, summary, content, category.`;

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
          
          const existing = await pool.query('SELECT id, image FROM news WHERE title = $1 AND date = $2', [item.title, todayStr]);
          
          if (existing.rows.length === 0) {
            const imageUrl = await generateImageForNews(item.title, index);
            await pool.query(
              `INSERT INTO news (title, summary, content, category, date, image) VALUES ($1, $2, $3, $4, $5, $6)`,
              [item.title, item.summary || '', item.content, item.category || 'સમાચાર', todayStr, imageUrl]
            );
          } else if (!existing.rows[0].image) {
            const imageUrl = await generateImageForNews(item.title, index);
            if (imageUrl) {
                await pool.query(`UPDATE news SET image = $1 WHERE id = $2`, [imageUrl, existing.rows[0].id]);
            }
          }
          index++;
        }
        const refresh = await pool.query('SELECT * FROM news ORDER BY id DESC LIMIT 20');
        setNewsList(refresh.rows);
      }
    } catch (err: any) {
      if (err?.message?.includes('quota') || err?.message?.includes('limit')) {
          console.warn("Sync Stopped: DB Quota Exceeded");
          localStorage.setItem('db_quota_exceeded', 'true');
      } else {
          console.error("Auto-Sync Failed:", err);
      }
    } finally {
      setSyncing(false);
    }
  }, [syncing, todayStr]);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    // If quota already exceeded, skip DB and load fallback
    if (localStorage.getItem('db_quota_exceeded') === 'true') {
        setNewsList(fallbackNews);
        setLoading(false);
        return;
    }

    try {
      await pool.query(`CREATE TABLE IF NOT EXISTS news (id SERIAL PRIMARY KEY, title TEXT, summary TEXT, content TEXT, category TEXT, date TEXT, image TEXT)`);
      const result = await pool.query('SELECT * FROM news ORDER BY id DESC LIMIT 20');
      const data = result.rows;
      
      if (data.length > 0) {
          setNewsList(data);
          const todaysNews = data.filter((a: any) => a.date === todayStr);
          const missingImages = todaysNews.some((a: any) => !a.image);
          if ((todaysNews.length === 0 || missingImages) && !localStorage.getItem('newsSyncError')) { 
              autoSyncDailyNews(); 
          }
      } else {
          setNewsList(fallbackNews);
          autoSyncDailyNews(); // Try to fetch initial news if DB is empty but working
      }
    } catch (err: any) { 
        if (err?.message?.includes('quota') || err?.message?.includes('limit')) {
            console.warn("DB Quota Exceeded. Switching to static mode.");
            localStorage.setItem('db_quota_exceeded', 'true');
            setNewsList(fallbackNews);
        } else {
            console.error("Fetch Error:", err);
            setNewsList(fallbackNews);
        }
    } finally { 
        setLoading(false); 
    }
  }, [autoSyncDailyNews, todayStr]);

  useEffect(() => { fetchNews(); }, [fetchNews]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 animate-fade-in pb-20">
      <div className="mb-10 text-center relative">
          <h2 className="text-3xl font-black text-gray-900 mb-2">તાજા સમાચાર અને લેખ</h2>
          <p className="text-xs text-emerald-600 font-black uppercase tracking-[0.2em]">Latest Updates: {todayStr}</p>
          {syncing && (
             <div className="absolute top-0 right-0">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
             </div>
          )}
      </div>

      <div className="space-y-12">
        {loading && newsList.length === 0 ? (
          <div className="text-center py-20 opacity-30 flex flex-col items-center gap-4">
             <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
             <p>માહિતી ચેક થઈ રહી છે...</p>
          </div>
        ) : (
          newsList.map((article, idx) => (
            <div key={article.id || idx} className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-500">
              <div className="aspect-[16/9] w-full bg-gray-100 relative overflow-hidden">
                {article.image ? (
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                ) : (
                  <img src={fallbackImages[idx % fallbackImages.length]} alt="Fallback" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-80" />
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
                        try {
                            await pool.query('DELETE FROM news WHERE id = $1', [article.id]);
                            setNewsList(newsList.filter(n => n.id !== article.id));
                        } catch(e) { alert("Delete failed due to quota limit"); }
                      }
                    }} className="text-red-300 hover:text-red-500 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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
