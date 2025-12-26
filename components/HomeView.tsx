
import React, { useState, useEffect } from 'react';
import { fetchTopHeadlines } from '../utils/gnews';
import { NewsArticle } from '../types';

const HomeView: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [breakingNews, setBreakingNews] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      // Fetch General News
      const articles = await fetchTopHeadlines('general');
      if (articles.length > 0) {
        setBreakingNews(articles[0]);
        setNews(articles.slice(1));
      }
      setLoading(false);
    };
    getData();
  }, []);

  if (loading) return (
    <div className="h-screen flex justify-center items-center flex-col gap-4">
      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-500 font-bold animate-pulse">સમાચાર અપડેટ થઈ રહ્યા છે...</p>
    </div>
  );

  return (
    <div className="pb-20 bg-gray-50">
      
      {/* Breaking Ticker */}
      {breakingNews && (
        <div className="bg-red-600 text-white flex items-center overflow-hidden h-10 relative z-10">
           <div className="bg-red-800 px-4 h-full flex items-center font-black text-xs uppercase tracking-widest shrink-0 z-20 shadow-md">Breaking</div>
           <div className="whitespace-nowrap animate-marquee flex items-center">
              <span className="mx-4 text-sm font-bold">{breakingNews.title}</span>
              <span className="mx-4 text-sm font-bold">•</span>
              <span className="mx-4 text-sm font-bold opacity-80">{breakingNews.source.name}</span>
           </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Hero Section (Big News) */}
        {breakingNews && (
          <a href={breakingNews.url} target="_blank" rel="noopener noreferrer" className="block group mb-12">
             <div className="relative rounded-3xl overflow-hidden aspect-[16/9] md:aspect-[21/9] shadow-2xl">
                <img 
                  src={breakingNews.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80"} 
                  alt={breakingNews.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-6 md:p-12">
                   <div className="flex items-center gap-3 mb-3">
                      <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">Top Story</span>
                      <span className="text-gray-300 text-xs font-bold">{new Date(breakingNews.publishedAt).toLocaleDateString('gu-IN')}</span>
                   </div>
                   <h1 className="text-2xl md:text-5xl font-black text-white leading-tight mb-3 group-hover:text-red-100 transition-colors drop-shadow-lg">
                     {breakingNews.title}
                   </h1>
                   <p className="text-gray-300 text-sm md:text-xl line-clamp-2 max-w-4xl drop-shadow-md font-medium">{breakingNews.description}</p>
                </div>
             </div>
          </a>
        )}

        {/* Latest News Grid */}
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-3">
              <div className="h-8 w-1.5 bg-red-600 rounded-full"></div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">તાજા ખબર</h2>
           </div>
           <span className="text-xs font-bold text-gray-400 uppercase tracking-widest hidden md:block">Live Updates from GNews</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
           {news.map((item, index) => (
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

      </div>
    </div>
  );
};

export default HomeView;
