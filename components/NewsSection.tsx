import React, { useState, useEffect } from 'react';

interface Article {
  id: number;
  title: string;
  date: string;
  summary: string;
  content: string;
  image: string;
  category: string;
}

const initialArticles: Article[] = [
  {
    id: 1,
    title: "પી.એમ. કિસાન સન્માન નિધિ યોજના: 17મો હપ્તો ક્યારે આવશે?",
    date: "12 May 2024",
    category: "ખેડૂત સમાચાર",
    image: "https://ui-avatars.com/api/?name=PM+Kisan&background=16a34a&color=fff&size=128",
    summary: "પી.એમ. કિસાન યોજનાના 17મા હપ્તાની રાહ જોઈ રહેલા ખેડૂતો માટે મહત્વના સમાચાર. eKYC ફરજિયાત છે.",
    content: `પ્રધાનમંત્રી કિસાન સન્માન નિધિ યોજના (PM-Kisan) હેઠળ દેશભરના કરોડો ખેડૂતોને વાર્ષિક 6000 રૂપિયાની આર્થિક સહાય આપવામાં આવે છે. આ રકમ 2000-2000 રૂપિયાના ત્રણ હપ્તામાં સીધી ખેડૂતોના બેંક ખાતામાં જમા થાય છે.

**eKYC અપડેટ કરવું ફરજિયાત:**
જો તમે હજુ સુધી તમારું eKYC નથી કરાવ્યું, તો તમારો હપ્તો અટકી શકે છે. eKYC તમે ઘરે બેઠા PM Kisan પોર્ટલ પર અથવા નજીકના CSC સેન્ટર પર જઈને કરાવી શકો છો.

**સ્ટેટસ કેવી રીતે ચેક કરવું?**
1. pmkisan.gov.in વેબસાઇટ પર જાઓ.
2. 'Know Your Status' પર ક્લિક કરો.
3. તમારો રજીસ્ટ્રેશન નંબર અને કેપ્ચા કોડ નાખો.
4. તમારું સ્ટેટસ જોવા મળશે.

આ યોજનાનો લાભ લેવા માટે જમીનનું આધાર સીડિંગ અને બેંક ખાતા સાથે આધાર લિંક હોવું પણ જરૂરી છે.`
  },
  {
    id: 2,
    title: "આયુષ્માન કાર્ડ: 5 લાખ સુધીની મફત સારવાર",
    date: "10 May 2024",
    category: "આરોગ્ય",
    image: "https://ui-avatars.com/api/?name=Ayushman+Bharat&background=0891b2&color=fff&size=128",
    summary: "આયુષ્માન ભારત યોજના હેઠળ હવે 70 વર્ષથી વધુ વયના તમામ વૃદ્ધોને આવરી લેવામાં આવ્યા છે.",
    content: `આયુષ્માન ભારત પ્રધાનમંત્રી જન આરોગ્ય યોજના (AB-PMJAY) એ વિશ્વની સૌથી મોટી સ્વાસ્થ્ય વીમા યોજના છે. આ યોજના હેઠળ પાત્રતા ધરાવતા પરિવારોને વાર્ષિક 5 લાખ રૂપિયા સુધીનું સ્વાસ્થ્ય કવચ પૂરું પાડવામાં આવે છે.

**કોને લાભ મળે?**
- સામાજિક-આર્થિક વસ્તી ગણતરી (SECC) 2011 મુજબના લિસ્ટમાં નામ હોય તેવા પરિવારો.
- રેશન કાર્ડ ધારકો (અંત્યોદય અને અમુક બીપીએલ).
- તાજેતરમાં સરકારે જાહેરાત કરી છે કે 70 વર્ષથી વધુ ઉંમરના તમામ વરિષ્ઠ નાગરિકોને આ યોજનાનો લાભ મળશે, ભલે તેમની આવક ગમે તેટલી હોય.

**લાભ ક્યાં મળે?**
આ કાર્ડ દ્વારા તમે સરકારી હોસ્પિટલો તેમજ પેનલમાં જોડાયેલી ખાનગી હોસ્પિટલોમાં મફત સારવાર મેળવી શકો છો. કેન્સર, હૃદયરોગ, કિડની જેવી ગંભીર બીમારીઓનો પણ સમાવેશ થાય છે.`
  }
];

const NewsSection: React.FC = () => {
  // State for Articles
  const [newsList, setNewsList] = useState<Article[]>(() => {
    const saved = localStorage.getItem('newsArticles');
    return saved ? JSON.parse(saved) : initialArticles;
  });

  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Admin State
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pin, setPin] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('યોજના');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Persist Data
  useEffect(() => {
    localStorage.setItem('newsArticles', JSON.stringify(newsList));
  }, [newsList]);

  const handleLogin = () => {
    if (pin === '1234') {
      setIsAdmin(true);
      setShowLogin(false);
      setPin('');
    } else {
      alert('ખોટો પિન!');
    }
  };

  const handleDelete = (id: number) => {
    if(window.confirm('આ સમાચાર ડિલીટ કરવા છે?')) {
        setNewsList(newsList.filter(a => a.id !== id));
    }
  };

  const handleAddNews = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Default image generator if empty
    const finalImage = imageUrl.trim() || `https://ui-avatars.com/api/?name=${encodeURIComponent(category)}&background=random&color=fff&size=128`;

    const newArticle: Article = {
        id: Date.now(),
        title,
        category,
        summary,
        content,
        image: finalImage,
        date: new Date().toLocaleDateString('gu-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    };

    setNewsList([newArticle, ...newsList]);
    setShowForm(false);
    
    // Reset Form
    setTitle('');
    setCategory('યોજના');
    setSummary('');
    setContent('');
    setImageUrl('');
    
    alert('સમાચાર પબ્લિશ થઈ ગયા છે!');
  };

  const toggleArticle = (id: number) => {
    if (selectedId === id) {
      setSelectedId(null);
    } else {
      setSelectedId(id);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-8 animate-fade-in pb-20">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
         <div className="flex items-center gap-2">
            <span className="h-8 w-1.5 bg-indigo-600 rounded-full"></span>
            <div>
                <h2 className="text-xl font-bold text-gray-800">યોજના અને સમાચાર</h2>
                <p className="text-xs text-gray-500">સરકારી યોજનાઓની સચોટ માહિતી</p>
            </div>
         </div>
         
         {isAdmin && (
             <button 
                onClick={() => setShowForm(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md hover:bg-indigo-700 transition-all flex items-center gap-2"
             >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                નવો લેખ
             </button>
         )}
      </div>

      {/* Articles List */}
      <div className="grid gap-6">
        {newsList.map((article) => (
          <div key={article.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow relative">
             
             {/* Delete Button for Admin */}
             {isAdmin && (
                 <button 
                    onClick={() => handleDelete(article.id)}
                    className="absolute top-2 right-2 z-10 bg-red-100 text-red-600 p-2 rounded-full hover:bg-red-200"
                 >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                 </button>
             )}

             <div className="flex flex-col sm:flex-row">
                
                {/* Image Section */}
                <div className="sm:w-32 h-32 bg-gray-100 flex-shrink-0 relative">
                   <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                   <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm">
                      {article.category}
                   </span>
                </div>

                {/* Content Section */}
                <div className="p-5 flex-1">
                   <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-gray-900 leading-snug hover:text-indigo-600 transition-colors cursor-pointer" onClick={() => toggleArticle(article.id)}>
                        {article.title}
                      </h3>
                   </div>
                   
                   <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      {article.date}
                   </p>

                   {/* Summary (Always Visible) */}
                   <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      {article.summary}
                   </p>

                   {/* Expandable Full Content */}
                   {selectedId === article.id && (
                      <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in">
                          <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
                              {article.content}
                          </p>
                      </div>
                   )}

                   <button 
                      onClick={() => toggleArticle(article.id)}
                      className="text-indigo-600 text-xs font-bold uppercase tracking-wide hover:underline mt-2 flex items-center gap-1"
                   >
                      {selectedId === article.id ? 'ઓછું વાંચો' : 'વધુ વાંચો'}
                      <svg className={`w-4 h-4 transition-transform ${selectedId === article.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                   </button>
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* Admin Panel Toggle */}
      <div className="mt-8 pt-4 border-t border-gray-200 text-center">
          {!isAdmin ? (
             <div className="flex justify-center">
                 {!showLogin ? (
                     <button onClick={() => setShowLogin(true)} className="text-xs text-gray-300 hover:text-gray-500">
                        Admin Login
                     </button>
                 ) : (
                     <div className="flex gap-2 bg-gray-100 p-2 rounded-lg">
                         <input type="password" value={pin} onChange={e => setPin(e.target.value)} placeholder="PIN (1234)" className="w-20 p-1 text-xs border rounded" />
                         <button onClick={handleLogin} className="bg-indigo-600 text-white text-xs px-2 rounded">OK</button>
                         <button onClick={() => setShowLogin(false)} className="text-gray-500 text-xs px-1">X</button>
                     </div>
                 )}
             </div>
          ) : (
             <button onClick={() => setIsAdmin(false)} className="text-xs text-red-500 bg-red-50 px-3 py-1 rounded-full">
                Logout Admin
             </button>
          )}
      </div>

      {/* Add News Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
                    <h3 className="font-bold text-lg text-gray-800">નવો આર્ટિકલ લખો</h3>
                    <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>
                
                <form onSubmit={handleAddNews} className="p-6 space-y-4">
                    
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">શીર્ષક (Title)</label>
                        <input 
                            type="text" required
                            value={title} onChange={e => setTitle(e.target.value)}
                            placeholder="દા.ત. નવી આવાસ યોજના..."
                            className="w-full p-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">કેટેગરી</label>
                            <select 
                                value={category} onChange={e => setCategory(e.target.value)}
                                className="w-full p-3 border rounded-xl text-sm"
                            >
                                <option>યોજના</option>
                                <option>ખેતીવાડી</option>
                                <option>આરોગ્ય</option>
                                <option>શિક્ષણ</option>
                                <option>સમાચાર</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">ફોટો URL (Optional)</label>
                            <input 
                                type="text"
                                value={imageUrl} onChange={e => setImageUrl(e.target.value)}
                                placeholder="Image Link..."
                                className="w-full p-3 border rounded-xl text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">ટૂંકસાર (Summary)</label>
                        <textarea 
                            required rows={2}
                            value={summary} onChange={e => setSummary(e.target.value)}
                            placeholder="બે લાઈનમાં માહિતી..."
                            className="w-full p-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">સંપૂર્ણ વિગત (Full Content)</label>
                        <textarea 
                            required rows={8}
                            value={content} onChange={e => setContent(e.target.value)}
                            placeholder="અહીં આખો આર્ટિકલ લખો..."
                            className="w-full p-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700">
                        પબ્લિશ કરો
                    </button>
                </form>
            </div>
        </div>
      )}

      <div className="mt-8 text-center bg-gray-50 p-4 rounded-xl border border-gray-200">
         <p className="text-xs text-gray-500">
            ડિસ્ક્લેમર: અહીં આપેલી માહિતી સમાચાર સ્ત્રોતો અને સરકારી પ્રેસ રિલીઝ પર આધારિત છે. સત્તાવાર માહિતી માટે જે-તે વિભાગની વેબસાઈટની મુલાકાત લેવી.
         </p>
      </div>

    </div>
  );
};

export default NewsSection;