
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTopHeadlines } from '../utils/gnews';
import { NewsArticle } from '../types';

const CategoryView: React.FC = () => {
  const { cat } = useParams<{ cat: string }>();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      // GNews supports: general, world, nation, business, technology, entertainment, sports, science, health
      const articles = await fetchTopHeadlines(cat);
      setNews(articles);
      setLoading(false);
    };
    getData();
  }, [cat]);

  if (loading) return (
    <div className="h-screen flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-20">
       <div className="flex items-center gap-3 mb-8 border-b border-gray-200 pb-4">
          <span className="text-4xl">
             {cat === 'technology' ? '💻' : cat === 'sports' ? '🏏' : cat === 'entertainment' ? '🎬' : cat === 'business' ? '📈' : '📰'}
          </span>
          <h1 className="text-3xl font-black capitalize text-gray-900">{cat} News</h1>
       </div>

       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
           {news.length === 0 ? <p className="col-span-full text-center text-gray-400">No news found.</p> : news.map((item, index) => (
             <a key={index} href={item.url} target="_blank" rel="noopener noreferrer" className="group flex flex-col h-full bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 overflow-hidden">
                <div className="aspect-video overflow-hidden relative bg-gray-100">
                   <img 
                     src={item.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80"} 
                     alt={item.title}
                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                   />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                   <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug group-hover:text-red-600 transition-colors line-clamp-2">
                      {item.title}
                   </h3>
                   <p className="text-sm text-gray-500 line-clamp-3 mb-4">
                      {item.description}
                   </p>
                   <div className="mt-auto text-xs text-gray-400 font-bold uppercase flex justify-between">
                      <span>{item.source.name}</span>
                      <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                   </div>
                </div>
             </a>
           ))}
       </div>
    </div>
  );
};

export default CategoryView;
