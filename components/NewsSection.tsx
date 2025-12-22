import React, { useState, useEffect } from 'react';
import { pool } from '../utils/db';

interface Article {
  id: number;
  title: string;
  date: string;
  summary: string;
  content: string;
  category: string;
  media_url?: string; // Base64 string or URL
  media_type?: 'image' | 'video';
}

const NewsSection: React.FC = () => {
  const [newsList, setNewsList] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pin, setPin] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Form States
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('યોજના');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [mediaInputMode, setMediaInputMode] = useState<'upload' | 'link'>('upload');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [uploadLoading, setUploadLoading] = useState(false);

  const initDb = async () => {
    try {
      // Create table if not exists
      await pool.query(`
        CREATE TABLE IF NOT EXISTS news (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          category TEXT NOT NULL,
          summary TEXT NOT NULL,
          content TEXT NOT NULL,
          media_url TEXT,
          media_type TEXT,
          date TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Ensure missing columns are added to existing tables
      await pool.query(`ALTER TABLE news ADD COLUMN IF NOT EXISTS media_url TEXT;`);
      await pool.query(`ALTER TABLE news ADD COLUMN IF NOT EXISTS media_type TEXT;`);
      
    } catch (e) {
      console.error("Database Init/Alter Error:", e);
    }
  };

  const fetchNews = async () => {
    setLoading(true);
    try {
      await initDb();
      const result = await pool.query('SELECT * FROM news ORDER BY id DESC');
      setNewsList(result.rows);
    } catch (err) {
      console.error("Fetch News Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) setMediaType('image');
    else if (file.type.startsWith('video/')) setMediaType('video');
    else {
      alert('કૃપા કરીને ફક્ત ફોટો અથવા વિડિયો ફાઈલ પસંદ કરો.');
      return;
    }

    if (file.size > 15 * 1024 * 1024) { // Increased to 15MB
      alert('ફાઈલ ૧૫ MB થી ઓછી હોવી જોઈએ.');
      return;
    }

    setUploadLoading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaUrl(reader.result as string);
      setUploadLoading(false);
    };
    reader.onerror = () => {
      alert('ફાઈલ વાંચવામાં ભૂલ પડી.');
      setUploadLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234') {
      setIsAdmin(true);
      setShowLogin(false);
      setPin('');
    } else {
      alert('ખોટો પિન!');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('આ સમાચાર કાયમ માટે ડિલીટ કરવા છે?')) {
      try {
        await pool.query('DELETE FROM news WHERE id = $1', [id]);
        setNewsList(prev => prev.filter(a => a.id !== id));
        alert('ડિલીટ થઈ ગયા.');
      } catch (e) {
        console.error("Delete Error:", e);
        alert('ડિલીટ કરવામાં ભૂલ પડી.');
      }
    }
  };

  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadLoading) return;

    const dateStr = new Date().toLocaleDateString('gu-IN', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
    
    try {
      const query = `
        INSERT INTO news (title, category, summary, content, media_url, media_type, date) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
      `;
      const res = await pool.query(query, [title, category, summary, content, mediaUrl, mediaType, dateStr]);
      setNewsList([res.rows[0], ...newsList]);
      setShowForm(false);
      resetForm();
      alert('સમાચાર સફળતાપૂર્વક પબ્લિશ થયા!');
    } catch (e) {
      console.error("Insert Error:", e);
      alert('સેવ કરવામાં ભૂલ પડી! (ડેટાબેઝ એરર)');
    }
  };

  const resetForm = () => {
    setTitle('');
    setSummary('');
    setContent('');
    setMediaUrl('');
    setMediaType('image');
    setMediaInputMode('upload');
  };

  const toggleArticle = (id: number) => {
    setSelectedId(prev => (prev === id ? null : id));
  };

  const renderMedia = (url: string, type: 'image' | 'video', isSmall: boolean = false) => {
    if (!url) return null;
    
    const isYoutube = url.includes('youtube.com') || url.includes('youtu.be');

    if (type === 'video') {
      if (isYoutube) {
        const videoId = url.includes('v=') ? url.split('v=')[1]?.split('&')[0] : url.split('/').pop();
        return (
          <iframe 
            className={`w-full aspect-video rounded-2xl shadow-sm ${isSmall ? 'md:w-48' : ''}`}
            src={`https://www.youtube.com/embed/${videoId}`}
            title="Video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        );
      }
      return (
        <video 
          src={url} 
          controls 
          className={`w-full aspect-video rounded-2xl object-cover shadow-sm ${isSmall ? 'md:w-48' : ''}`}
        />
      );
    }

    return (
      <img 
        src={url} 
        alt="News" 
        className={`w-full aspect-video rounded-2xl object-cover shadow-sm ${isSmall ? 'md:w-48 md:h-32' : ''}`}
      />
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 animate-fade-in pb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-900 border-l-4 border-indigo-600 pl-3">યોજના સમાચાર</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 ml-3">ગ્રામની નવીનતમ માહિતી</p>
        </div>
        <div className="flex gap-2">
          {!isAdmin ? (
            <button onClick={() => setShowLogin(true)} className="text-[10px] text-gray-300 hover:text-gray-500 transition-colors">Admin Access</button>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => setShowForm(true)} className="bg-indigo-600 text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-xl shadow-indigo-100 active:scale-95 transition-all">નવો લેખ +</button>
              <button onClick={() => setIsAdmin(false)} className="bg-red-50 text-red-500 px-3 py-2.5 rounded-2xl text-[10px] font-bold">Logout</button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-20 animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 font-bold">સમાચાર લોડ થઈ રહ્યા છે...</p>
          </div>
        ) : newsList.length === 0 ? (
          <div className="text-center py-24 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
            <p className="text-gray-400 font-medium">કોઈ સમાચાર ઉપલબ્ધ નથી.</p>
          </div>
        ) : (
          newsList.map((article) => (
            <div key={article.id} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-500 relative p-6 md:p-8">
              {isAdmin && (
                <button 
                  onClick={() => handleDelete(article.id)} 
                  className="absolute top-4 right-4 z-20 bg-red-50 text-red-500 p-2.5 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              )}
              
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 order-2 md:order-1">
                  <div className="flex justify-between items-center mb-4">
                    <span className="bg-indigo-50 text-indigo-700 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                      {article.category}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                      {article.date}
                    </span>
                  </div>
                  
                  <h3 
                    className="text-2xl font-black text-gray-900 leading-tight mb-3 cursor-pointer hover:text-indigo-600 transition-colors" 
                    onClick={() => toggleArticle(article.id)}
                  >
                    {article.title}
                  </h3>
                  
                  <p className="text-base text-gray-500 line-clamp-2 leading-relaxed mb-6 font-medium">
                    {article.summary}
                  </p>

                  {selectedId === article.id && (
                    <div className="mt-6 pt-6 border-t border-gray-50 animate-fade-in space-y-6">
                       {article.media_url && (
                         <div className="w-full">
                            {renderMedia(article.media_url, article.media_type || 'image')}
                         </div>
                       )}
                       <div className="text-gray-700 leading-loose whitespace-pre-wrap text-sm md:text-base bg-gray-50/50 p-6 rounded-[2rem]">
                        {article.content}
                       </div>
                    </div>
                  )}

                  <button 
                    onClick={() => toggleArticle(article.id)} 
                    className="mt-4 text-indigo-600 font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2 group"
                  >
                    {selectedId === article.id ? 'ઓછું વાંચો' : 'વધુ વાંચો'}
                    <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
                  </button>
                </div>

                {article.media_url && selectedId !== article.id && (
                  <div className="shrink-0 order-1 md:order-2">
                    {renderMedia(article.media_url, article.media_type || 'image', true)}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {showLogin && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <form onSubmit={handleLogin} className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-xs text-center animate-fade-in">
            <h3 className="font-black text-xl mb-6 text-gray-900">એડમિન લૉગિન</h3>
            <input 
              type="password" 
              value={pin} 
              onChange={e => setPin(e.target.value)} 
              placeholder="PIN દાખલ કરો" 
              className="w-full border-none bg-gray-50 p-5 rounded-2xl mb-4 text-center font-bold text-lg focus:ring-2 focus:ring-indigo-200 outline-none transition-all" 
              autoFocus 
            />
            <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 active:scale-95 transition-all">લૉગિન</button>
            <button type="button" onClick={() => setShowLogin(false)} className="mt-6 text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600">કેન્સલ</button>
          </form>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[3rem] w-full max-w-xl p-8 md:p-10 my-auto shadow-2xl animate-fade-in border border-white/20">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-black text-gray-900">નવો સમાચાર ઉમેરો</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Create News Article</p>
              </div>
              <button onClick={() => setShowForm(false)} className="bg-gray-100 p-3 rounded-full hover:bg-red-50 hover:text-red-500 transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <form onSubmit={handleAddNews} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2">શીર્ષક (Title)</label>
                  <input 
                    type="text" 
                    required 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    placeholder="સમાચારનું શીર્ષક..." 
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none font-bold" 
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2">કેટેગરી</label>
                  <select 
                    value={category} 
                    onChange={e => setCategory(e.target.value)} 
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none font-bold appearance-none cursor-pointer"
                  >
                    <option>યોજના</option>
                    <option>ખેતી</option>
                    <option>પંચાયત</option>
                    <option>અન્ય</option>
                  </select>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">મીડિયા (ફોટો અથવા વિડિયો)</label>
                  <div className="flex bg-white p-1 rounded-full border border-gray-200 shadow-inner">
                    <button 
                      type="button" 
                      onClick={() => setMediaInputMode('upload')}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${mediaInputMode === 'upload' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500'}`}
                    >
                      અપલોડ કરો
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setMediaInputMode('link')}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${mediaInputMode === 'link' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500'}`}
                    >
                      લિંક ઉમેરો
                    </button>
                  </div>
                </div>

                {mediaInputMode === 'upload' ? (
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="image/*,video/*" 
                      onChange={handleFileChange} 
                      className="hidden" 
                      id="media-upload-final"
                    />
                    <label 
                      htmlFor="media-upload-final" 
                      className={`w-full flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-[2rem] cursor-pointer transition-all ${mediaUrl ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30'}`}
                    >
                      {uploadLoading ? (
                        <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                      ) : mediaUrl ? (
                        <>
                          <svg className="w-10 h-10 text-emerald-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                          <p className="text-xs font-bold text-emerald-600">ફાઈલ પસંદ થઈ ગઈ ✅</p>
                          <button type="button" onClick={(e) => { e.preventDefault(); setMediaUrl(''); }} className="mt-2 text-[10px] text-red-400 font-bold hover:underline">દૂર કરો</button>
                        </>
                      ) : (
                        <>
                          <div className="bg-indigo-50 text-indigo-600 p-3 rounded-full mb-3">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
                          </div>
                          <p className="text-sm font-bold text-gray-700">મોબાઈલ માંથી પસંદ કરો</p>
                          <p className="text-[10px] text-gray-400 mt-1">Photo (JPG/PNG) અથવા Video (MP4)</p>
                        </>
                      )}
                    </label>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <input 
                      type="text" 
                      value={mediaUrl} 
                      onChange={e => setMediaUrl(e.target.value)} 
                      placeholder="Image અથવા YouTube વિડિયો લિંક..." 
                      className="w-full p-4 bg-white border-2 border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none text-sm font-medium" 
                    />
                    <select 
                      value={mediaType} 
                      onChange={e => setMediaType(e.target.value as any)} 
                      className="w-full p-4 bg-white border-2 border-gray-100 rounded-2xl outline-none font-bold text-xs"
                    >
                      <option value="image">આ એક ફોટો લિંક છે</option>
                      <option value="video">આ એક વિડિયો લિંક છે</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">ટૂંકી વિગત (Summary)</label>
                <textarea 
                  required 
                  value={summary} 
                  onChange={e => setSummary(e.target.value)} 
                  placeholder="સમાચારની ટૂંકી વિગત (૨-૩ લીટીમાં)..." 
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none text-sm font-medium" 
                  rows={2} 
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">સંપૂર્ણ સમાચાર (Full Content)</label>
                <textarea 
                  required 
                  value={content} 
                  onChange={e => setContent(e.target.value)} 
                  placeholder="સંપૂર્ણ સમાચારની વિગતવાર માહિતી અહીં લખો..." 
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none text-sm leading-relaxed" 
                  rows={4} 
                />
              </div>

              <button 
                type="submit" 
                disabled={uploadLoading}
                className={`w-full py-5 rounded-[2rem] font-black text-lg shadow-2xl transition-all ${uploadLoading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 text-white shadow-indigo-100 hover:scale-[1.02] active:scale-95'}`}
              >
                {uploadLoading ? 'મીડિયા લોડ થઈ રહ્યું છે...' : 'સમાચાર પબ્લિશ કરો'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default NewsSection;