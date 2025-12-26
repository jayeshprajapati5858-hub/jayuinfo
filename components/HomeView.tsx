
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { pool } from '../utils/db';
import { NewsArticle } from '../types';

const HomeView: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [breakingNews, setBreakingNews] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await pool.query('SELECT * FROM news_articles ORDER BY id DESC LIMIT 20');
        if (res.rows.length > 0) {
          const allNews = res.rows;
          const breaking = allNews.find((n: NewsArticle) => n.is_breaking) || allNews[0];
          setBreakingNews(breaking);
          // Filter out the breaking news from the main list so it doesn't duplicate prominently
          setNews(allNews.filter((n: NewsArticle) => n.id !== breaking.id));
        }
      } catch (e) {
        console.error("Failed to fetch news");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="h-screen flex justify-center items-center"><div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="pb-20">
      
      {/* Breaking Ticker */}
      {breakingNews && (
        <div className="bg-red-600 text-white flex items-center overflow-hidden h-10 relative z-10">
           <div className="bg-red-800 px-4 h-full flex items-center font-black text-xs uppercase tracking-widest shrink-0 z-20 shadow-md">Breaking</div>
           <div className="whitespace-nowrap animate-marquee flex items-center">
              <span className="mx-4 text-sm font-bold">{breakingNews.title}</span>
              <span className="mx-4 text-sm font-bold">•</span>
              <span className="mx-4 text-sm font-bold">{breakingNews.subtitle || "વધુ વાંચો વેબસાઈટ પર..."}</span>
           </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Hero Section (Big News) */}
        {breakingNews && (
          <Link to={`/news/${breakingNews.id}`} className="block group mb-10">
             <div className="relative rounded-2xl overflow-hidden aspect-[16/9] md:aspect-[21/9] shadow-md">
                <img 
                  src={breakingNews.image_url || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80"} 
                  alt={breakingNews.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-10">
                   <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded w-fit uppercase mb-3">Top Story</span>
                   <h1 className="text-2xl md:text-5xl font-black text-white leading-tight mb-2 group-hover:text-red-100 transition-colors drop-shadow-lg">
                     {breakingNews.title}
                   </h1>
                   <p className="text-gray-200 text-sm md:text-lg line-clamp-2 max-w-3xl drop-shadow-md">{breakingNews.subtitle || breakingNews.content}</p>
                </div>
             </div>
          </Link>
        )}

        {/* Latest News Grid */}
        <div className="flex items-center justify-between mb-6 border-l-4 border-red-600 pl-4">
           <h2 className="text-2xl font-black text-gray-900">તાજા સમાચાર</h2>
           <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Latest Updates</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
           {news.map(item => (
             <Link key={item.id} to={`/news/${item.id}`} className="group flex flex-col h-full bg-white rounded-xl shadow-sm hover:shadow-xl transition-all border border-gray-100 overflow-hidden">
                <div className="aspect-[3/2] overflow-hidden relative">
                   <img 
                     src={item.image_url || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80"} 
                     alt={item.title}
                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                   />
                   <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-gray-900 text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider">
                      {item.category}
                   </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                   <div className="flex items-center gap-2 mb-2 text-[10px] text-gray-400 font-bold uppercase">
                      <span>{item.date_str}</span>
                      <span>•</span>
                      <span>{item.author}</span>
                   </div>
                   <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug group-hover:text-red-600 transition-colors line-clamp-3">
                      {item.title}
                   </h3>
                   <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                      {item.subtitle || item.content}
                   </p>
                   <div className="mt-auto pt-4 border-t border-gray-50 flex items-center text-xs font-bold text-red-600">
                      વધુ વાંચો <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                   </div>
                </div>
             </Link>
           ))}
        </div>

      </div>
    </div>
  );
};

export default HomeView;
