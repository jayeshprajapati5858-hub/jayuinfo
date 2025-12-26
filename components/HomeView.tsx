
import React, { useState, useEffect } from 'react';
import { fetchTopHeadlines } from '../utils/gnews';
import { NewsArticle, NewsItem } from '../types';
import { pool } from '../utils/db'; // Import DB to fetch local news

const HomeView: React.FC = () => {
  const [gNews, setGNews] = useState<NewsArticle[]>([]);
  const [localNews, setLocalNews] = useState<NewsItem[]>([]);
  const [breakingNews, setBreakingNews] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      
      // 1. Fetch Local News (Original Content - Crucial for AdSense)
      try {
        // Initialize table if not exists (handling edge case)
        await pool.query(`
          CREATE TABLE IF NOT EXISTS news (
            id SERIAL PRIMARY KEY, category TEXT, title TEXT, content TEXT, image_url TEXT, date_str TEXT, author TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);
        const localRes = await pool.query('SELECT * FROM news ORDER BY id DESC LIMIT 6');
        setLocalNews(localRes.rows);
      } catch (e) {
        console.error("Local DB Error:", e);
      }

      // 2. Fetch GNews (External Content)
      const articles = await fetchTopHeadlines('general');
      if (articles.length > 0) {
        setBreakingNews(articles[0]);
        setGNews(articles.slice(1));
      } else {
        setApiError(true);
      }
      
      setLoading(false);
    };
    getData();
  }, []);

  if (loading) return (
    <div className="h-screen flex justify-center items-center flex-col gap-4">
      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-500 font-bold animate-pulse">લોડ થઈ રહ્યું છે...</p>
    </div>
  );

  return (
    <div className="pb-20 bg-gray-50">
      
      {/* Breaking Ticker - Using GNews or Local Fallback */}
      <div className="bg-red-600 text-white flex items-center overflow-hidden h-10 relative z-10 shadow-md">
           <div className="bg-red-800 px-4 h-full flex items-center font-black text-xs uppercase tracking-widest shrink-0 z-20">Breaking</div>
           <div className="whitespace-nowrap animate-marquee flex items-center">
              <span className="mx-4 text-sm font-bold">
                {breakingNews ? breakingNews.title : (localNews[0]?.title || "હાઈપર-લોકલ ન્યૂઝ પોર્ટલમાં તમારું સ્વાગત છે.")}
              </span>
           </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* --- SECTION 1: LOCAL NEWS (AdSense Priority) --- */}
        {/* Google prefers original content. Displaying DB news first. */}
        {localNews.length > 0 && (
          <div className="mb-12 animate-fade-in">
             <div className="flex items-center gap-3 mb-6">
                <span className="h-8 w-1.5 bg-indigo-600 rounded-full"></span>
                <h2 className="text-2xl font-black text-gray-900">ગામ અને વિસ્તારના સમાચાર</h2>
                <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded-full">Original</span>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {localNews.map((item) => (
                   <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
                      {item.image_url && (
                        <div className="h-48 overflow-hidden">
                          <img src={item.image_url} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                        </div>
                      )}
                      <div className="p-5">
                         <span className="text-[10px] font-black text-indigo-600 uppercase bg-indigo-50 px-2 py-1 rounded">{item.category}</span>
                         <h3 className="text-lg font-bold text-gray-900 mt-2 line-clamp-2">{item.title}</h3>
                         <p className="text-sm text-gray-500 mt-2 line-clamp-3">{item.content}</p>
                         <p className="text-xs text-gray-400 mt-4 pt-4 border-t border-gray-50 flex justify-between">
                            <span>✍ {item.author}</span>
                            <span>{item.date_str}</span>
                         </p>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )}

        {/* --- SECTION 2: GNEWS (Aggregation) --- */}
        <div className="flex items-center justify-between mb-8 mt-10">
           <div className="flex items-center gap-3">
              <div className="h-8 w-1.5 bg-red-600 rounded-full"></div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">દેશ-દુનિયા (GNews)</h2>
           </div>
           <span className="text-xs font-bold text-gray-400 uppercase tracking-widest hidden md:block">Powered by GNews</span>
        </div>

        {apiError && (
          <div className="bg-orange-50 border border-orange-200 text-orange-800 p-4 rounded-xl mb-6 text-sm text-center">
             ⚠️ હાલમાં GNews સર્વર વ્યસ્ત છે અથવા API લિમિટ પૂરી થઈ છે. કૃપા કરીને થોડી વાર પછી પ્રયત્ન કરો. (Cached data may be shown if available)
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
           {gNews.map((item, index) => (
             <a key={index} href={item.url} target="_blank" rel="noopener noreferrer" className="group flex flex-col h-full bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden hover:-translate-y-1">
                <div className="aspect-[16/10] overflow-hidden relative">
                   <img 
                     src={item.image || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80"} 
                     alt={item.title}
                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                   />
                   <div className="absolute top-4 left-4">
                      <span className="bg-white/95 backdrop-blur-sm text-gray-900 text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-sm">
                         {item.source.name}
                      </span>
                   </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                   <div className="flex items-center gap-2 mb-3 text-[11px] text-gray-400 font-bold uppercase tracking-wide">
                      <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      <span>{new Date(item.publishedAt).toLocaleDateString('gu-IN', { month: 'long', day: 'numeric'})}</span>
                   </div>
                   <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug group-hover:text-red-600 transition-colors line-clamp-3">
                      {item.title}
                   </h3>
                   <p className="text-sm text-gray-500 line-clamp-3 mb-5 leading-relaxed">
                      {item.description}
                   </p>
                   <div className="mt-auto pt-5 border-t border-gray-50 flex items-center justify-between">
                      <span className="text-xs font-black text-red-600 flex items-center gap-1 group/btn">
                         સંપૂર્ણ વાંચો 
                         <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                      </span>
                   </div>
                </div>
             </a>
           ))}
        </div>

        {gNews.length === 0 && !loading && !apiError && (
          <div className="text-center py-20 bg-gray-100 rounded-3xl">
             <p className="text-gray-500">હાલમાં કોઈ સમાચાર ઉપલબ્ધ નથી.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default HomeView;
