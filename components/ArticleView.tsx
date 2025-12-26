
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { pool } from '../utils/db';
import { DBNewsArticle } from '../types';
import AdSenseSlot from './AdSenseSlot';

const ArticleView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<DBNewsArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const res = await pool.query('SELECT * FROM news_articles WHERE id = $1', [id]);
        if (res.rows.length > 0) {
           setArticle(res.rows[0]);
           // Increment view count slightly (simulated)
           pool.query('UPDATE news_articles SET views = views + 1 WHERE id = $1', [id]);
        }
      } catch(e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchArticle();
  }, [id]);

  if (loading) return <div className="h-96 flex items-center justify-center">Loading...</div>;
  if (!article) return <div className="text-center py-20 font-bold text-xl">સમાચાર મળ્યા નથી.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in pb-20">
       
       {/* Breadcrumb */}
       <div className="flex items-center gap-2 text-xs text-gray-500 font-bold mb-6 uppercase tracking-wide">
          <Link to="/" className="hover:text-red-600">Home</Link> 
          <span>/</span> 
          <span className="text-red-600">{article.category}</span>
       </div>

       <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-4">{article.title}</h1>
       {article.subtitle && <h2 className="text-xl text-gray-500 font-medium mb-6 leading-relaxed border-l-4 border-red-500 pl-4">{article.subtitle}</h2>}

       <div className="flex items-center justify-between border-y border-gray-100 py-3 mb-8">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                {article.author ? article.author[0] : 'A'}
             </div>
             <div>
                <p className="text-xs font-black text-gray-900 uppercase">By {article.author}</p>
                <p className="text-[10px] font-bold text-gray-400">{article.date_str}</p>
             </div>
          </div>
          <div className="flex gap-2">
             <button onClick={() => navigator.share({title: article.title, url: window.location.href})} className="bg-green-50 text-green-600 p-2 rounded-full hover:bg-green-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
             </button>
          </div>
       </div>

       <div className="mb-8">
          <img 
            src={article.image_url || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80"} 
            alt={article.title}
            className="w-full rounded-2xl shadow-lg mb-2"
          />
          <p className="text-center text-xs text-gray-400 italic">Image for representation</p>
       </div>

       {/* Article Body */}
       <div className="prose prose-lg prose-red max-w-none text-gray-800 leading-8 space-y-6">
          {article.content.split('\n').map((para, i) => (
             <p key={i}>{para}</p>
          ))}
       </div>

       <AdSenseSlot slot="1234567890" />
       
       {/* Read More Section */}
       <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="font-black text-2xl mb-6">આગળ વાંચો</h3>
          <div className="flex gap-4">
             <Link to="/" className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold">બધા સમાચાર</Link>
          </div>
       </div>
    </div>
  );
};

export default ArticleView;
