import React, { useState, useEffect } from 'react';

interface Notice {
  id: number;
  type: 'death' | 'event' | 'general';
  title: string;
  description: string;
  date: string;
  contactPerson: string;
  mobile: string;
  timestamp: number;
}

// Initial notices
const initialNotices: Notice[] = [
  {
    id: 1,
    type: 'death',
    title: 'દુઃખદ અવસાન (બેસણું)',
    description: 'અમો જણાવતા દિલગીર છીએ કે પટેલ પરસોત્તમભાઈ (ઉ.વ. ૭૫) નું તા. ૧૨/૧૦/૨૦૨૪ ના રોજ દુઃખદ અવસાન થયેલ છે. સદ્ગતનું બેસણું તા. ૧૪/૧૦/૨૦૨૪ ના રોજ સવારે ૯ થી ૧૧ રાખેલ છે.',
    date: new Date().toLocaleDateString('gu-IN'),
    contactPerson: 'પટેલ પરિવાર',
    mobile: '9876543210',
    timestamp: Date.now()
  },
  {
    id: 2,
    type: 'event',
    title: 'નવરાત્રી મહોત્સવ',
    description: 'સમસ્ત ગ્રામજનોને જણાવવાનું કે આ વર્ષે નવરાત્રી નિમિત્તે ચોકમાં ગરબાનું આયોજન કરેલ છે. દરેક ગ્રામજનોને પધારવા આમંત્રણ છે.',
    date: new Date().toLocaleDateString('gu-IN'),
    contactPerson: 'યુવક મંડળ',
    mobile: '9988776655',
    timestamp: Date.now()
  }
];

const NoticeBoard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'death' | 'event' | 'general'>('all');
  const [showForm, setShowForm] = useState(false);
  const [notices, setNotices] = useState<Notice[]>(() => {
    const saved = localStorage.getItem('villageNotices');
    let parsedData: Notice[] = saved ? JSON.parse(saved) : initialNotices;
    const oneDayMs = 86400000;
    const now = Date.now();
    return parsedData.filter(n => (now - (n.timestamp || 0)) < oneDayMs);
  });

  // Form States
  const [newType, setNewType] = useState<'death' | 'event' | 'general'>('general');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newMobile, setNewMobile] = useState('');
  
  // Notification State
  const [sendNotification, setSendNotification] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('onesignal_api_key') || '');
  const [appId, setAppId] = useState(() => localStorage.getItem('onesignal_app_id') || '');

  useEffect(() => {
    localStorage.setItem('villageNotices', JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem('onesignal_api_key', apiKey);
    localStorage.setItem('onesignal_app_id', appId);
  }, [apiKey, appId]);

  // Function to send OneSignal Notification
  const triggerNotification = async (title: string, message: string) => {
    if (!apiKey || !appId) {
        alert("નોટિફિકેશન મોકલવા માટે API Key અને App ID સેટ કરો.");
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
        const response = await fetch('https://onesignal.com/api/v1/notifications', options);
        const data = await response.json();
        if (data.id) {
            console.log('Notification sent:', data);
        } else {
            console.error('Error sending notification:', data);
            alert('નોટિફિકેશન મોકલવામાં ભૂલ આવી છે.');
        }
    } catch (err) {
        console.error(err);
        alert('ઈન્ટરનેટ કનેક્શન તપાસો.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newNotice: Notice = {
      id: Date.now(),
      type: newType,
      title: newTitle,
      description: newDesc,
      date: new Date().toLocaleDateString('gu-IN'),
      contactPerson: newContact,
      mobile: newMobile,
      timestamp: Date.now(),
    };

    setNotices([newNotice, ...notices]);
    
    // Check if user wants to send push notification
    if (sendNotification) {
        await triggerNotification(`નવી નોટિસ: ${newTitle}`, newDesc.substring(0, 50) + "...");
    }

    setShowForm(false);
    
    // Reset form
    setNewTitle('');
    setNewDesc('');
    setNewContact('');
    setNewMobile('');

    const msg = sendNotification 
        ? "જાહેરાત પબ્લિશ થઈ ગઈ! (Notification Sent & Live on Home)" 
        : "જાહેરાત પબ્લિશ થઈ ગઈ! (હવે હોમ સ્ક્રીન પર દેખાશે)";
    alert(msg);
  };

  const filteredNotices = notices.filter(n => activeTab === 'all' || n.type === activeTab);

  // WhatsApp Share Helper
  const shareOnWhatsApp = (notice: Notice) => {
      const text = `*ગામની નોટિસ*\n\n📌 *${notice.title}*\n\n${notice.description}\n\nસંપર્ક: ${notice.contactPerson} (${notice.mobile})`;
      const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-8 animate-fade-in pb-20">
      
      {/* Header & Add Button */}
      <div className="flex justify-between items-center mb-6">
        <div>
           <h2 className="text-xl font-bold text-gray-800">ડિજિટલ નોટિસ બોર્ડ</h2>
           <p className="text-xs text-gray-500">જાહેરાત ૨૪ કલાક પછી આપોઆપ નીકળી જશે</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-indigo-700 transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          જાહેરાત આપો
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
        {[
            { id: 'all', label: 'બધા સમાચાર' },
            { id: 'death', label: 'શ્રદ્ધાંજલિ / બેસણું' },
            { id: 'event', label: 'ઉત્સવ / કાર્યક્રમ' },
            { id: 'general', label: 'અન્ય જાહેરાત' }
        ].map(tab => (
            <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    activeTab === tab.id 
                    ? 'bg-gray-800 text-white shadow-lg' 
                    : 'bg-white text-gray-600 border border-gray-200'
                }`}
            >
                {tab.label}
            </button>
        ))}
      </div>

      {/* Notice List */}
      <div className="space-y-4">
        {filteredNotices.length === 0 ? (
            <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                {activeTab === 'all' ? 'કોઈ નવી નોટિસ નથી.' : 'આ કેટેગરીમાં કોઈ નોટિસ નથી.'}
                <p className="text-xs mt-2">જૂની નોટિસ ૨૪ કલાક પછી નીકળી જાય છે.</p>
            </div>
        ) : (
            filteredNotices.map(notice => (
                <div key={notice.id} className={`bg-white rounded-xl p-5 border-l-4 shadow-sm relative overflow-hidden ${
                    notice.type === 'death' ? 'border-l-gray-500' :
                    notice.type === 'event' ? 'border-l-orange-500' :
                    'border-l-blue-500'
                }`}>
                    
                    <span className={`absolute top-4 right-4 text-[10px] px-2 py-1 rounded-full font-bold uppercase ${
                        notice.type === 'death' ? 'bg-gray-100 text-gray-600' :
                        notice.type === 'event' ? 'bg-orange-100 text-orange-600' :
                        'bg-blue-100 text-blue-600'
                    }`}>
                        {notice.type === 'death' ? 'શ્રદ્ધાંજલિ' : notice.type === 'event' ? 'ઉત્સવ' : 'જાહેરાત'}
                    </span>

                    <h3 className="text-lg font-bold text-gray-900 pr-20">{notice.title}</h3>
                    <p className="text-xs text-gray-400 font-semibold mb-3">{notice.date}</p>
                    
                    <p className="text-sm text-gray-700 leading-relaxed mb-4 whitespace-pre-wrap">
                        {notice.description}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                            <span className="bg-gray-100 p-1 rounded">જાહેરાતકર્તા:</span>
                            <span>{notice.contactPerson}</span>
                        </div>
                        
                        <div className="flex gap-2">
                             {/* WhatsApp Share Button */}
                             <button onClick={() => shareOnWhatsApp(notice)} className="text-green-600 bg-green-50 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-green-100">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.506-.669-.514-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.084 1.758-.717 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                                શેર કરો
                             </button>

                            {notice.mobile && (
                                <a href={`tel:${notice.mobile}`} className="text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-indigo-100">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                    કોલ કરો
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            ))
        )}
      </div>

      {/* Modal / Form Overlay */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-800">નવી જાહેરાત ઉમેરો</h3>
                    <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 bg-white p-1 rounded-full shadow-sm">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                        <p className="text-xs text-yellow-800 font-bold text-center">
                            નોંધ: આ જાહેરાત ૨૪ કલાક પછી આપોઆપ ડિલીટ થઈ જશે.
                        </p>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">જાહેરાતનો પ્રકાર</label>
                        <select 
                            value={newType} 
                            onChange={(e) => setNewType(e.target.value as any)}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                            <option value="general">સામાન્ય જાહેરાત</option>
                            <option value="death">શ્રદ્ધાંજલિ / બેસણું</option>
                            <option value="event">ઉત્સવ / કાર્યક્રમ</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">શીર્ષક (Title)</label>
                        <input 
                            type="text" 
                            required
                            placeholder="દા.ત. નવરાત્રી મહોત્સવ"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">વિગત (Description)</label>
                        <textarea 
                            required
                            rows={4}
                            placeholder="સંપૂર્ણ માહિતી અહીં લખો..."
                            value={newDesc}
                            onChange={(e) => setNewDesc(e.target.value)}
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">તમારું નામ</label>
                            <input 
                                type="text" 
                                required
                                value={newContact}
                                onChange={(e) => setNewContact(e.target.value)}
                                className="w-full p-3 border border-gray-200 rounded-xl outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">મોબાઈલ નંબર</label>
                            <input 
                                type="tel" 
                                required
                                value={newMobile}
                                onChange={(e) => setNewMobile(e.target.value)}
                                className="w-full p-3 border border-gray-200 rounded-xl outline-none"
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
                                className="w-4 h-4 text-indigo-600 rounded"
                            />
                            <span className="text-sm font-bold text-gray-700">🔔 બધાને નોટિફિકેશન મોકલો</span>
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

                    <div className="pt-2">
                        <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transform active:scale-95 transition-all">
                            {sendNotification ? 'સબમિટ અને નોટિફાય કરો' : 'જાહેરાત પબ્લિશ કરો'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

    </div>
  );
};

export default NoticeBoard;