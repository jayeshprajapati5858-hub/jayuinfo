import React, { useState, useEffect } from 'react';

interface JobListing {
  id: number;
  category: 'hire' | 'work';
  title: string;
  details: string;
  wages: string;
  contactName: string;
  mobile: string;
  date: string;
  timestamp: number;
}

const initialListings: JobListing[] = [
  {
    id: 1,
    category: 'hire',
    title: 'કપાસ વીણવા માણસો જોઈએ છે',
    details: '૧૦ થી ૧૨ માણસોની જરૂર છે. જમવાની વ્યવસ્થા સાથે.',
    wages: 'મણ ના ભાવે / રોજ',
    contactName: 'પટેલ રમેશભાઈ',
    mobile: '9876500000',
    date: new Date().toLocaleDateString('gu-IN'),
    timestamp: Date.now()
  },
  {
    id: 2,
    category: 'work',
    title: 'ટ્રેકટર ડ્રાઈવર',
    details: 'ટ્રેકટર ચલાવવા માટે ડ્રાઈવર તરીકે કામ જોઈએ છે. ૫ વર્ષનો અનુભવ.',
    wages: 'ચર્ચા મુજબ',
    contactName: 'ઠાકોર વિક્રમજી',
    mobile: '9988776655',
    date: new Date().toLocaleDateString('gu-IN'),
    timestamp: Date.now()
  }
];

const RojgarBoard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hire' | 'work'>('hire');
  const [showForm, setShowForm] = useState(false);

  const [listings, setListings] = useState<JobListing[]>(() => {
    const saved = localStorage.getItem('rojgarListings');
    let parsedData: JobListing[] = saved ? JSON.parse(saved) : initialListings;
    const oneDayMs = 86400000;
    const now = Date.now();
    return parsedData.filter(item => (now - (item.timestamp || 0)) < oneDayMs);
  });
  
  // Form State
  const [newCategory, setNewCategory] = useState<'hire' | 'work'>('hire');
  const [newTitle, setNewTitle] = useState('');
  const [newDetails, setNewDetails] = useState('');
  const [newWages, setNewWages] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newMobile, setNewMobile] = useState('');

  // Notification State
  const [sendNotification, setSendNotification] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('onesignal_api_key') || '');
  const [appId, setAppId] = useState(() => localStorage.getItem('onesignal_app_id') || '');

  useEffect(() => {
    localStorage.setItem('rojgarListings', JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem('onesignal_api_key', apiKey);
    localStorage.setItem('onesignal_app_id', appId);
  }, [apiKey, appId]);

  const triggerNotification = async (title: string, message: string) => {
    if (!apiKey || !appId) {
        alert("API Key / App ID ખૂટે છે.");
        return;
    }
    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: `Basic ${apiKey}`
        },
        body: JSON.stringify({
            app_id: appId,
            contents: { en: message },
            headings: { en: title },
            included_segments: ['All']
        })
    };
    try {
        await fetch('https://onesignal.com/api/v1/notifications', options);
    } catch (err) {
        console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newListing: JobListing = {
      id: Date.now(),
      category: newCategory,
      title: newTitle,
      details: newDetails,
      wages: newWages,
      contactName: newContact,
      mobile: newMobile,
      date: new Date().toLocaleDateString('gu-IN'),
      timestamp: Date.now() 
    };

    setListings([newListing, ...listings]);
    
    if (sendNotification) {
        await triggerNotification(`રોજગાર: ${newTitle}`, newDetails);
    }

    setShowForm(false);
    
    // Reset Form
    setNewTitle('');
    setNewDetails('');
    setNewWages('');
    setNewContact('');
    setNewMobile('');
    
    alert('જાહેરાત મૂકવામાં આવી છે! (૨૪ કલાક સુધી રહેશે)');
  };

  const filteredListings = listings.filter(item => item.category === activeTab);

  const shareOnWhatsApp = (item: JobListing) => {
      const text = `*રોજગાર માહિતી*\n\n📌 *${item.title}*\n\n${item.details}\n\nપગાર: ${item.wages}\nસંપર્ક: ${item.contactName} (${item.mobile})`;
      const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-8 animate-fade-in pb-20">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
           <h2 className="text-xl font-bold text-gray-800">ગ્રામ્ય રોજગાર કેન્દ્ર</h2>
           <p className="text-xs text-gray-500">જાહેરાત ૨૪ કલાક પછી આપોઆપ નીકળી જશે</p>
        </div>
        <button 
          onClick={() => { setShowForm(true); setNewCategory(activeTab); }}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md hover:bg-emerald-700 transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          જાહેરાત મૂકો
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
        <button
          onClick={() => setActiveTab('hire')}
          className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeTab === 'hire' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <span>👨‍🌾</span> માણસો જોઈએ છે
        </button>
        <button
          onClick={() => setActiveTab('work')}
          className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeTab === 'work' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <span>🛠️</span> કામ જોઈએ છે
        </button>
      </div>

      {/* Listings */}
      <div className="space-y-4">
        {filteredListings.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-400 font-medium">
              {activeTab === 'hire' ? 'હાલમાં કોઈ ખેડૂતને માણસોની જરૂર નથી.' : 'હાલમાં કોઈ કારીગર ઉપલબ્ધ નથી.'}
            </p>
            <p className="text-xs text-gray-400 mt-2">જૂની જાહેરાતો ૨૪ કલાકમાં ડિલીટ થાય છે.</p>
          </div>
        ) : (
          filteredListings.map(item => (
            <div key={item.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm relative overflow-hidden group">
               <div className={`absolute top-0 left-0 w-1.5 h-full ${item.category === 'hire' ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
               
               <div className="flex justify-between items-start mb-2 pl-2">
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">{item.title}</h3>
                  <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-1 rounded-full">{item.date}</span>
               </div>

               <p className="text-sm text-gray-600 mb-3 pl-2 whitespace-pre-wrap">{item.details}</p>

               <div className="grid grid-cols-2 gap-2 mb-4 pl-2">
                  <div className="bg-gray-50 p-2 rounded-lg">
                     <p className="text-[10px] text-gray-400 font-bold uppercase">મહેનતાણું / પગાર</p>
                     <p className="text-sm font-bold text-gray-800">{item.wages}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg">
                     <p className="text-[10px] text-gray-400 font-bold uppercase">સંપર્ક</p>
                     <p className="text-sm font-bold text-gray-800">{item.contactName}</p>
                  </div>
               </div>

               <div className="flex justify-between items-center pl-2 pt-2 border-t border-gray-50">
                  <button onClick={() => shareOnWhatsApp(item)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-green-600 bg-green-50 text-xs font-bold hover:bg-green-100">
                     <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.506-.669-.514-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.084 1.758-.717 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                     શેર કરો
                  </button>
                  <a href={`tel:${item.mobile}`} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-bold shadow-sm transition-all ${item.category === 'hire' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                     કૉલ કરો
                  </a>
               </div>
            </div>
          ))
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
           <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <h3 className="font-bold text-gray-800">નવી જાહેરાત</h3>
                  <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
              </div>
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                  <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                        <p className="text-xs text-yellow-800 font-bold text-center">
                            નોંધ: આ જાહેરાત ૨૪ કલાક પછી આપોઆપ ડિલીટ થઈ જશે.
                        </p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">તમારે શું જોઈએ છે?</label>
                    <div className="flex gap-2">
                       <button
                         type="button"
                         onClick={() => setNewCategory('hire')}
                         className={`flex-1 py-2 rounded-lg text-sm font-bold border ${newCategory === 'hire' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-gray-200 text-gray-600'}`}
                       >
                         માણસો જોઈએ છે
                       </button>
                       <button
                         type="button"
                         onClick={() => setNewCategory('work')}
                         className={`flex-1 py-2 rounded-lg text-sm font-bold border ${newCategory === 'work' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-200 text-gray-600'}`}
                       >
                         કામ જોઈએ છે
                       </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">કામનું શીર્ષક</label>
                    <input 
                      type="text" 
                      required
                      placeholder={newCategory === 'hire' ? "દા.ત. કપાસ વીણવા" : "દા.ત. ડ્રાઈવર / કડિયા કામ"}
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">વિગત</label>
                    <textarea 
                      required
                      placeholder="કામની વિગત, કેટલા માણસો, સમય..."
                      value={newDetails}
                      onChange={e => setNewDetails(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 h-24"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">પગાર / મહેનતાણું</label>
                    <input 
                      type="text" 
                      placeholder="દા.ત. ૩૦૦ રૂપિયે રોજ / મણ ના ભાવે"
                      value={newWages}
                      onChange={e => setNewWages(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                     <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">તમારું નામ</label>
                        <input 
                          type="text" 
                          required
                          value={newContact}
                          onChange={e => setNewContact(e.target.value)}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">મોબાઈલ નંબર</label>
                        <input 
                          type="tel" 
                          required
                          value={newMobile}
                          onChange={e => setNewMobile(e.target.value)}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                        />
                     </div>
                  </div>

                  {/* Notification Settings Section */}
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={sendNotification} 
                                onChange={(e) => setSendNotification(e.target.checked)} 
                                className="w-4 h-4 text-emerald-600 rounded"
                            />
                            <span className="text-sm font-bold text-gray-700">🔔 નોટિફિકેશન મોકલો</span>
                        </label>
                        
                        {sendNotification && (
                            <div className="space-y-2 animate-fade-in">
                                <input 
                                    type="text" 
                                    placeholder="OneSignal REST API Key"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    className="w-full p-2 text-xs border border-gray-300 rounded bg-white"
                                />
                                <input 
                                    type="text" 
                                    placeholder="OneSignal APP ID"
                                    value={appId}
                                    onChange={(e) => setAppId(e.target.value)}
                                    className="w-full p-2 text-xs border border-gray-300 rounded bg-white"
                                />
                                <p className="text-[10px] text-gray-400">એકવાર નાખ્યા પછી સેવ રહેશે.</p>
                            </div>
                        )}
                  </div>

                  <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-lg mt-2">
                     {sendNotification ? 'સબમિટ અને નોટિફાય કરો' : 'જાહેરાત સબમિટ કરો'}
                  </button>
              </form>
           </div>
        </div>
      )}

    </div>
  );
};

export default RojgarBoard;