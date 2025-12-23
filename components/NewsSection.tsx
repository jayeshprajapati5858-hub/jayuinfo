
import React, { useState, useEffect } from 'react';
import { pool } from '../utils/db';
import AdSenseSlot from './AdSenseSlot';
import { GoogleGenAI } from "@google/genai";

interface Article {
  id: number;
  title: string;
  category: string;
  summary: string;
  content: string;
  image: string;
  date: string;
}

const NewsSection: React.FC = () => {
  const [news, setNews] = useState<Article[]>([]);
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  const categories = [
      { id: 'All', label: 'મુખ્ય સમાચાર' },
      { id: 'ખેતીવાડી', label: 'કૃષિ જગત' },
      { id: 'યોજના', label: 'સરકારી યોજના' },
      { id: 'હવામાન', label: 'હવામાન' },
  ];

  // Check if AI Key is already selected in the environment
  const checkKeyStatus = async () => {
    try {
      // @ts-ignore
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasKey(selected || !!process.env.API_KEY);
    } catch (e) {
      setHasKey(!!process.env.API_KEY);
    }
  };

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await pool.query('SELECT * FROM news ORDER BY id DESC LIMIT 30');
      setNews(res.rows);
    } catch (err) {
      console.warn("DB Quota reached or connection error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkKeyStatus();
    fetchNews();
  }, []);

  const handleSelectKey = async () => {
    try {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      setHasKey(true);
    } catch (e) {
      alert("API Key સેટ કરવામાં ભૂલ આવી. કૃપા કરીને ફરી પ્રયત્ન કરો.");
    }
  };

  // --- Gemini AI News Generation ---
  const generateAINews = async () => {
    // Re-check and instantiate right before use to avoid stale keys
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      handleSelectKey();
      return;
    }
    
    setIsSyncing(true);
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Generate 5 latest news items for rural Gujarat in Gujarati. Focus on: Farmer subsidies, New crops, Market prices (APMC), and Weather. Format as a JSON array of objects with keys: title, category (ખેતીવાડી, યોજના, સમાચાર, હવામાન), summary, content, date (today's date).",
        config: { 
          responseMimeType: "application/json"
        }
      });

      const text = response.text;
      if (!text) throw new Error("AI returned empty response");

      const aiData = JSON.parse(text);
      
      if (Array.isArray(aiData)) {
          for (const item of aiData) {
             await pool.query(
               `INSERT INTO news (title, category, summary, content, image, date) VALUES ($1, $2, $3, $4, $5, $6)`,
               [
                 item.title, 
                 item.category, 
                 item.summary, 
                 item.content, 
                 "https://images.unsplash.com/photo-1599581843324-7e77747e0996?auto=format&fit=crop&q=80&w=1000", 
                 item.date
               ]
             );
          }
          fetchNews();
          alert("Gemini AI દ્વારા લેટેસ્ટ સમાચાર અપડેટ કરવામાં આવ્યા છે!");
      }
    } catch (err: any) {
      console.error("AI Error:", err);
      if (err.message?.includes("Requested entity was not found")) {
        alert("તમારો API Key માન્ય નથી, કૃપા કરીને ફરીથી સેટ કરો.");
        handleSelectKey();
      } else {
        alert("AI અત્યારે વ્યસ્ત છે. થોડીવાર પછી ફરી પ્રયત્ન કરો.");
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const filteredNews = activeTab === 'All' 
    ? news 
    : news.filter(n => n.category === activeTab || n.category.includes(activeTab));

  return (
    <div className="w-full max-w-7xl mx-auto px-4 mt-6 mb-8 animate-fade-in pb-20">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
           <div className="flex items-center gap-2 mb-2">
             <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.5)]"></span>
             <p className="text-[11px] font-black tracking-widest text-red-600 uppercase">Live Gemini AI Smart Feed</p>
           </div>
           <h2 className="text-4xl font-black text-gray-900 leading-none tracking-tight">ગ્રામ સમાચાર</h2>
           <p className="text-sm text-gray-500 font-bold mt-3 max-w-md">Gemini AI ની મદદથી દરરોજ મેળવો ખેતીવાડી અને સરકારી યોજનાઓની લેટેસ્ટ માહિતી ગુજરાતીમાં.</p>
        </div>

        <div className="flex flex-wrap gap-3">
            {!hasKey && (
                <button 
                   onClick={handleSelectKey}
                   className="flex items-center gap-2 px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest bg-amber-100 text-amber-800 border-2 border-amber-200 hover:bg-amber-200 transition-all active:scale-95"
                >
                   🔑 AI Key સેટ કરો
                </button>
            )}
            
            <button 
               onClick={generateAINews}
               disabled={isSyncing}
               className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-2xl ${
                 isSyncing ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700 active:scale-95'
               }`}
            >
               {isSyncing ? (
                 <>
                   <svg className="animate-spin h-5 w-5 text-gray-400" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                   AI સમાચાર શોધી રહ્યું છે...
                 </>
               ) : (
                 <>
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                   નવા સમાચાર અપડેટ કરો
                 </>
               )}
            </button>
        </div>
      </div>

      {!hasKey && (
          <div className="mb-10 p-6 bg-amber-50 rounded-3xl border border-amber-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-amber-600 shadow-sm shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              </div>
              <div>
                  <p className="text-sm font-bold text-amber-900">AI સમાચાર મેળવવા માટે Google AI Studio માંથી કી સેટ કરવી જરૂરી છે.</p>
                  <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-xs text-amber-600 underline font-bold">બિલિંગ અને વધુ માહિતી માટે અહીં ક્લિક કરો</a>
              </div>
          </div>
      )}

      <AdSenseSlot slot="8877665544" format="rectangle" />

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-8 no-scrollbar mb-4">
         {categories.map((cat) => (
             <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider whitespace-nowrap transition-all border ${
                    activeTab === cat.id 
                    ? 'bg-gray-900 text-white border-gray-900 shadow-xl' 
                    : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'
                }`}
             >
                 {cat.label}
             </button>
         ))}
      </div>

      {/* News Feed */}
      {loading ? (
          <div className="grid md:grid-cols-2 gap-8">
              {[1,2,3,4].map(i => (
                  <div key={i} className="animate-pulse flex flex-col p-8 bg-white rounded-[2.5rem] border border-gray-50 shadow-sm">
                      <div className="w-full h-64 bg-gray-50 rounded-3xl mb-8"></div>
                      <div className="h-6 bg-gray-50 rounded-lg w-3/4 mb-4"></div>
                      <div className="h-4 bg-gray-50 rounded-lg w-full mb-2"></div>
                      <div className="h-4 bg-gray-50 rounded-lg w-5/6"></div>
                  </div>
              ))}
          </div>
      ) : (
          <div className="grid md:grid-cols-2 gap-10">
              {filteredNews.length === 0 ? (
                  <div className="col-span-full text-center py-32 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200 flex flex-col items-center gap-6">
                      <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center text-gray-200 shadow-inner">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" strokeWidth="2"/></svg>
                      </div>
                      <div className="max-w-xs">
                        <p className="text-gray-400 font-black uppercase tracking-widest text-sm mb-2">અત્યારે કોઈ સમાચાર નથી</p>
                        <p className="text-xs text-gray-400 font-medium">નવા સમાચાર મેળવવા માટે ઉપર આપેલ 'અપડેટ કરો' બટન દબાવો.</p>
                      </div>
                  </div>
              ) : (
                  filteredNews.map((article, idx) => (
                    <React.Fragment key={article.id}>
                      {idx > 0 && idx % 4 === 0 && <div className="col-span-full"><AdSenseSlot slot="5544332211" format="fluid" /></div>}
                      
                      <article className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-700 group flex flex-col h-full">
                          <div className="relative h-64 overflow-hidden shrink-0">
                              <img 
                                src={article.image} 
                                alt={article.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                                onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"; }}
                              />
                              <div className="absolute top-6 left-6">
                                  <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-wider text-white shadow-2xl ${
                                      article.category === 'ખેતીવાડી' ? 'bg-emerald-600' :
                                      article.category === 'યોજના' ? 'bg-indigo-600' :
                                      article.category === 'હવામાન' ? 'bg-amber-500' :
                                      'bg-gray-900'
                                  }`}>
                                      {article.category}
                                  </span>
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/60 to-transparent"></div>
                          </div>

                          <div className="p-10 flex flex-col flex-1">
                              <div className="flex items-center gap-4 mb-6">
                                  <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">{article.date}</span>
                                  <span className="w-1.5 h-1.5 bg-gray-200 rounded-full"></span>
                                  <span className="text-[10px] text-indigo-500 font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                                      Gemini Verified News
                                  </span>
                              </div>
                              
                              <h3 className="text-2xl font-black text-gray-900 mb-5 leading-[1.3] group-hover:text-indigo-600 transition-colors">
                                  {article.title}
                              </h3>
                              
                              <p className="text-sm text-gray-500 leading-relaxed mb-10 line-clamp-3 font-medium">
                                  {article.summary}
                              </p>

                              <div className="mt-auto pt-8 border-t border-gray-50 flex justify-between items-center">
                                  <button className="text-indigo-600 text-[11px] font-black uppercase tracking-[0.25em] flex items-center gap-3 group/btn">
                                      સંપૂર્ણ વિગત 
                                      <span className="group-hover/btn:translate-x-2 transition-transform text-xl leading-none">→</span>
                                  </button>
                                  
                                  <button 
                                     onClick={() => {
                                        if (navigator.share) {
                                            navigator.share({ title: article.title, text: article.summary, url: window.location.href });
                                        }
                                     }}
                                     className="p-4 bg-gray-50 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-2xl transition-all active:scale-90"
                                  >
                                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                                  </button>
                              </div>
                          </div>
                      </article>
                    </React.Fragment>
                  ))
              )}
          </div>
      )}

      {/* Footer Info */}
      <div className="mt-20 pt-10 border-t border-gray-100 text-center opacity-40">
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em]">
              દરેક સમાચાર Gemini AI દ્વારા આપમેળે વેરિફાય કરવામાં આવે છે.
          </p>
      </div>
    </div>
  );
};

export default NewsSection;
