import React, { useState, useEffect } from 'react';
import { pool } from '../utils/db';

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

  // Define categories that appeal to AdSense and Rural Users
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
        // Ensure table exists (redundant safety)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS news (
                id SERIAL PRIMARY KEY, title TEXT, category TEXT, summary TEXT, content TEXT, image TEXT, date TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Fetch latest 50 news items
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
           <p className="text-xs text-gray-500 font-medium mt-1">ભરાડા ગામ અને ગુજરાતની ખેતીવાડીના તાજા સમાચાર</p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-4">
         {categories.map((cat) => (
             <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                    activeTab === cat.id 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                    : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
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
                  <div key={i} className="animate-pulse flex gap-4 p-4 bg-white rounded-2xl border border-gray-100">
                      <div className="w-24 h-24 bg-gray-200 rounded-xl shrink-0"></div>
                      <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-full"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                  </div>
              ))}
          </div>
      ) : (
          <div className="space-y-6">
              {filteredNews.length === 0 ? (
                  <div className="text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
                      <p className="text-gray-400 font-bold">હાલ કોઈ સમાચાર નથી.</p>
                      <p className="text-xs text-gray-400 mt-1">ડેટા સિંક થઇ રહ્યો છે, થોડીવાર પછી પ્રયાસ કરો.</p>
                  </div>
              ) : (
                  filteredNews.map((article, index) => (
                      <article key={article.id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                          
                          {/* Article Image */}
                          <div className="relative h-48 sm:h-64 overflow-hidden">
                              <img 
                                src={article.image} 
                                alt={article.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1586769852044-692d6e37d0d9?auto=format&fit=crop&w=800&q=80";
                                }}
                              />
                              <div className="absolute top-4 left-4">
                                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-lg ${
                                      article.category === 'ખેતીવાડી' ? 'bg-green-600' :
                                      article.category === 'યોજના' ? 'bg-purple-600' :
                                      article.category === 'હવામાન' ? 'bg-blue-500' :
                                      'bg-indigo-600'
                                  }`}>
                                      {article.category}
                                  </span>
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 to-transparent"></div>
                          </div>

                          {/* Content */}
                          <div className="p-6 relative">
                              <div className="flex items-center gap-2 mb-3 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                  <span>{article.date}</span>
                                  <span>•</span>
                                  <span>GNews Verified</span>
                              </div>
                              
                              <h3 className="text-xl font-black text-gray-900 mb-3 leading-tight group-hover:text-indigo-600 transition-colors">
                                  {article.title}
                              </h3>
                              
                              <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
                                  {article.summary}
                              </p>

                              {/* AdSense Friendly "Read More" simulation */}
                              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                  <button className="text-indigo-600 text-xs font-black uppercase tracking-wider flex items-center gap-1 group/btn">
                                      સંપૂર્ણ સમાચાર વાંચો 
                                      <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                                  </button>
                                  
                                  {/* Share Button */}
                                  <button 
                                     onClick={() => {
                                        if (navigator.share) {
                                            navigator.share({
                                                title: article.title,
                                                text: article.summary,
                                                url: window.location.href
                                            });
                                        } else {
                                            alert("લિંક કોપી કરી!");
                                        }
                                     }}
                                     className="text-gray-400 hover:text-green-600"
                                  >
                                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                                  </button>
                              </div>
                          </div>
                      </article>
                  ))
              )}
          </div>
      )}

      {/* Footer Disclaimer for AdSense Compliance */}
      <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-[10px] text-gray-400">
              Disclaimer: News is aggregated from GNews API and public sources for informational purposes only. Verification is recommended before taking financial decisions.
          </p>
      </div>
    </div>
  );
};

export default NewsSection;