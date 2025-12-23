
import React, { useState, useEffect } from 'react';
import { pool } from '../utils/db';
import AdSenseSlot from './AdSenseSlot';

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

  const categories = [
      { id: 'All', label: 'મુખ્ય સમાચાર' },
      { id: 'ખેતીવાડી', label: 'કૃષિ જગત' },
      { id: 'યોજના', label: 'સરકારી યોજના' },
      { id: 'હવામાન', label: 'હવામાન' },
  ];

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const res = await pool.query('SELECT * FROM news ORDER BY id DESC LIMIT 50');
        setNews(res.rows);
      } catch (err) {
        console.error("Failed to load news", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const filteredNews = activeTab === 'All' 
    ? news 
    : news.filter(n => n.category === activeTab || n.category.includes(activeTab));

  return (
    <div className="w-full max-w-7xl mx-auto px-4 mt-6 mb-8 animate-fade-in pb-20">
      
      {/* Header Section */}
      <div className="flex justify-between items-end mb-6">
        <div>
           <div className="flex items-center gap-2 mb-1">
             <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
             <p className="text-[10px] font-black tracking-widest text-red-600 uppercase">Live Updates</p>
           </div>
           <h2 className="text-2xl font-black text-gray-900 leading-none">ગ્રામ સમાચાર</h2>
           <p className="text-xs text-gray-500 font-medium mt-1">ભરાડા ગામ અને ગુજરાતની તાજી માહિતી</p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-4">
         {categories.map((cat) => (
             <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                    activeTab === cat.id 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' 
                    : 'bg-white text-gray-600 border-gray-100 hover:border-indigo-300'
                }`}
             >
                 {cat.label}
             </button>
         ))}
      </div>

      {/* News Feed */}
      {loading ? (
          <div className="space-y-4">
              {[1,2,3].map(i => (
                  <div key={i} className="animate-pulse flex flex-col p-4 bg-white rounded-3xl border border-gray-100">
                      <div className="w-full h-48 bg-gray-100 rounded-2xl mb-4"></div>
                      <div className="space-y-2">
                          <div className="h-5 bg-gray-100 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-100 rounded w-full"></div>
                      </div>
                  </div>
              ))}
          </div>
      ) : (
          <div className="space-y-8">
              {filteredNews.length === 0 ? (
                  <div className="text-center py-20 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200 flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-gray-200">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" strokeWidth="2"/></svg>
                      </div>
                      <p className="text-gray-400 font-bold">હાલ કોઈ સમાચાર નથી.</p>
                  </div>
              ) : (
                  filteredNews.map((article, idx) => (
                    <React.Fragment key={article.id}>
                      {/* Insert ad every 3 articles */}
                      {idx > 0 && idx % 3 === 0 && <AdSenseSlot slot="5544332211" format="fluid" />}
                      
                      <article className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 group">
                          <div className="relative h-56 sm:h-72 overflow-hidden">
                              <img 
                                src={article.image} 
                                alt={article.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                                onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1586769852044-692d6e37d0d9?auto=format&fit=crop&w=800&q=80"; }}
                              />
                              <div className="absolute top-4 left-4">
                                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-xl ${
                                      article.category === 'ખેતીવાડી' ? 'bg-green-600' :
                                      article.category === 'યોજના' ? 'bg-purple-600' :
                                      article.category === 'હવામાન' ? 'bg-blue-500' :
                                      'bg-indigo-600'
                                  }`}>
                                      {article.category}
                                  </span>
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/70 to-transparent"></div>
                          </div>

                          <div className="p-8 relative">
                              <div className="flex items-center gap-2 mb-4 text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
                                  <span>{article.date}</span>
                                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                  <span className="text-indigo-600">Verified News</span>
                              </div>
                              
                              <h3 className="text-xl font-black text-gray-900 mb-4 leading-tight group-hover:text-indigo-600 transition-colors">
                                  {article.title}
                              </h3>
                              
                              <p className="text-sm text-gray-600 leading-relaxed mb-6 line-clamp-3 font-medium">
                                  {article.summary}
                              </p>

                              <div className="pt-6 border-t border-gray-50 flex justify-between items-center">
                                  <button className="text-indigo-600 text-xs font-black uppercase tracking-widest flex items-center gap-2 group/btn">
                                      સંપૂર્ણ વિગત વાંચો 
                                      <span className="group-hover/btn:translate-x-2 transition-transform">→</span>
                                  </button>
                                  
                                  <button 
                                     onClick={() => {
                                        if (navigator.share) {
                                            navigator.share({ title: article.title, text: article.summary, url: window.location.href });
                                        }
                                     }}
                                     className="p-3 bg-gray-50 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-2xl transition-all"
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
      <div className="mt-12 pt-8 border-t border-gray-100 text-center">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              આ માહિતી માત્ર જાણકારી માટે છે. સત્તાવાર પુષ્ટિ માટે ગ્રામ પંચાયતનો સંપર્ક કરો.
          </p>
      </div>
    </div>
  );
};

export default NewsSection;
