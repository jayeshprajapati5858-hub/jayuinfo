import React, { useState, useEffect } from 'react';

interface Notice {
  id: string;
  type: 'death' | 'event' | 'general';
  title: string;
  description: string;
  date: string;
  contactPerson: string;
  mobile: string;
  timestamp: number;
}

const initialNotices: Notice[] = [
  {
    id: '1',
    type: 'general',
    title: 'ગ્રામ પંચાયત કચેરી સમય',
    description: 'પંચાયત કચેરી સવારે ૧૦:૩૦ થી સાંજે ૫:૦૦ સુધી ખુલ્લી રહેશે. બીજા અને ચોથા શનિવારે રજા રહેશે.',
    date: new Date().toLocaleDateString('gu-IN'),
    contactPerson: 'તલાટી કમ મંત્રી',
    mobile: '',
    timestamp: Date.now()
  },
  {
    id: '2',
    type: 'event',
    title: 'આરોગ્ય કેમ્પનું આયોજન',
    description: 'આવતા રવિવારે પ્રાથમિક શાળા ખાતે નિઃશુલ્ક નેત્ર નિદાન કેમ્પ રાખેલ છે.',
    date: new Date().toLocaleDateString('gu-IN'),
    contactPerson: 'સરપંચશ્રી',
    mobile: '9106162151',
    timestamp: Date.now() - 100000 // Slightly earlier
  }
];

const NoticeBoard: React.FC = () => {
  // State Management
  const [activeTab, setActiveTab] = useState<'all' | 'death' | 'event' | 'general'>('all');
  const [showForm, setShowForm] = useState(false);
  
  // Local Data Management - Using 'villageNotices' to sync with App.tsx Ticker
  const [notices, setNotices] = useState<Notice[]>(() => {
    const saved = localStorage.getItem('villageNotices');
    return saved ? JSON.parse(saved) : initialNotices;
  });

  // Form States
  const [editId, setEditId] = useState<string | null>(null);
  const [newType, setNewType] = useState<'death' | 'event' | 'general'>('general');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newMobile, setNewMobile] = useState('');
  
  // Persist Notices locally AND Dispatch Event for Live Updates
  useEffect(() => {
    localStorage.setItem('villageNotices', JSON.stringify(notices));
    // Dispatch event so App.tsx knows data changed immediately
    window.dispatchEvent(new Event('noticeUpdate'));
  }, [notices]);

  // Reset Form Helper
  const resetForm = () => {
      setShowForm(false);
      setEditId(null);
      setNewTitle('');
      setNewDesc('');
      setNewContact('');
      setNewMobile('');
      setNewType('general');
  };

  // Handle Form Submission (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTitle.trim() || !newDesc.trim() || !newContact.trim()) {
      alert("કૃપા કરીને બધી વિગતો ભરો.");
      return;
    }

    try {
        if (editId) {
            // --- UPDATE EXISTING NOTICE ---
            setNotices(prev => prev.map(notice => 
                notice.id === editId ? {
                    ...notice,
                    type: newType,
                    title: newTitle,
                    description: newDesc,
                    contactPerson: newContact,
                    mobile: newMobile,
                    timestamp: Date.now() // Update timestamp to bring it to top/fresh
                } : notice
            ));
            alert("નોટિસ સફળતાપૂર્વક અપડેટ થઈ ગઈ છે!");
        } else {
            // --- CREATE NEW NOTICE ---
            const newNotice: Notice = {
                id: Date.now().toString(),
                type: newType,
                title: newTitle,
                description: newDesc,
                date: new Date().toLocaleDateString('gu-IN'),
                contactPerson: newContact,
                mobile: newMobile,
                timestamp: Date.now(),
            };

            setNotices(prev => [newNotice, ...prev]);
            alert("તમારી જાહેરાત સફળતાપૂર્વક લાઈવ થઈ ગઈ છે!");
        }

        setActiveTab('all');
        resetForm();

    } catch (e) {
        console.error("Error processing notice: ", e);
        alert("ભૂલ આવી છે.");
    }
  };

  const handleEdit = (notice: Notice) => {
      setEditId(notice.id);
      setNewType(notice.type);
      setNewTitle(notice.title);
      setNewDesc(notice.description);
      setNewContact(notice.contactPerson);
      setNewMobile(notice.mobile);
      setShowForm(true);
  };

  const handleDelete = (id: string) => {
      if(window.confirm('શું તમે આ નોટિસ ડિલીટ કરવા માંગો છો?')) {
          setNotices(prev => prev.filter(n => n.id !== id));
      }
  };

  // Helper: WhatsApp Share
  const shareOnWhatsApp = (notice: Notice) => {
      const text = `📢 *ગામની નોટિસ* 📢\n\n📌 *${notice.title}*\n\n${notice.description}\n\n👤 જાહેરાતકર્તા: ${notice.contactPerson}\n📞 સંપર્ક: ${notice.mobile}\n\n🗓️ તારીખ: ${notice.date}\n\n👉 વધુ માહિતી માટે અમારી એપ જુઓ.`;
      const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
  };

  // Filter Logic
  const filteredNotices = notices.filter(n => activeTab === 'all' || n.type === activeTab);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-8 animate-fade-in pb-20">
      
      {/* Header & Add Button */}
      <div className="flex justify-between items-center mb-6">
        <div>
           <h2 className="text-xl font-bold text-gray-800">ડિજિટલ નોટિસ બોર્ડ</h2>
           <p className="text-xs text-gray-500">ગામની તાજી ખબરો અને સૂચનાઓ (Live)</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-indigo-700 transition-all flex items-center gap-2 active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          જાહેરાત આપો
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
        {[
            { id: 'all', label: 'બધા સમાચાર' },
            { id: 'death', label: 'શ્રદ્ધાંજલિ' },
            { id: 'event', label: 'ઉત્સવ' },
            { id: 'general', label: 'સામાન્ય' }
        ].map(tab => (
            <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    activeTab === tab.id 
                    ? 'bg-gray-800 text-white shadow-lg' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
            >
                {tab.label}
            </button>
        ))}
      </div>

      {/* Notice List */}
      <div className="space-y-4">
        {filteredNotices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <div className="bg-white p-3 rounded-full mb-3 shadow-sm">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
                </div>
                <h3 className="text-gray-500 font-medium">કોઈ નોટિસ નથી</h3>
                <p className="text-xs text-gray-400 mt-1">તમારી જાહેરાત મૂકવા માટે ઉપરનું બટન દબાવો.</p>
            </div>
        ) : (
            filteredNotices.map(notice => (
                <div key={notice.id} className={`bg-white rounded-xl p-5 border-l-4 shadow-sm relative overflow-hidden transition-all hover:shadow-md ${
                    notice.type === 'death' ? 'border-l-gray-500' :
                    notice.type === 'event' ? 'border-l-orange-500' :
                    'border-l-blue-500'
                }`}>
                    
                    {/* Badge */}
                    <div className="flex justify-between items-start mb-2">
                         <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider ${
                            notice.type === 'death' ? 'bg-gray-100 text-gray-600' :
                            notice.type === 'event' ? 'bg-orange-100 text-orange-600' :
                            'bg-blue-100 text-blue-600'
                        }`}>
                            {notice.type === 'death' ? 'શ્રદ્ધાંજલિ' : notice.type === 'event' ? 'ઉત્સવ' : 'જાહેરાત'}
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-400 font-mono bg-gray-50 px-1.5 py-0.5 rounded">
                                {notice.date}
                            </span>
                            
                            {/* Edit Button */}
                            <button onClick={() => handleEdit(notice)} className="text-blue-400 hover:text-blue-600 p-1 rounded hover:bg-blue-50" title="Edit">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                            </button>

                            {/* Delete Button */}
                            <button onClick={() => handleDelete(notice.id)} className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50" title="Delete">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                        </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">{notice.title}</h3>
                    
                    <p className="text-sm text-gray-700 leading-relaxed mb-4 whitespace-pre-wrap">
                        {notice.description}
                    </p>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 gap-2">
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-400 font-bold uppercase">જાહેરાતકર્તા</p>
                            <p className="text-sm font-bold text-gray-800 truncate">{notice.contactPerson}</p>
                        </div>
                        
                        <div className="flex gap-2">
                             <button onClick={() => shareOnWhatsApp(notice)} className="text-green-600 bg-green-50 px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-green-100 transition-colors">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                                શેર
                             </button>

                            {notice.mobile && (
                                <a href={`tel:${notice.mobile}`} className="text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-indigo-100 transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                    કોલ
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            ))
        )}
      </div>

      {/* Full Screen Form Overlay */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
                
                {/* Modal Header */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
                    <h3 className="font-bold text-lg text-gray-800">
                        {editId ? 'નોટિસમાં સુધારો કરો' : 'નવી જાહેરાત ઉમેરો'}
                    </h3>
                    <button 
                        onClick={resetForm} 
                        className="bg-white text-gray-400 hover:text-red-500 p-1.5 rounded-full shadow-sm border border-gray-200 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    
                    {/* Notice Type */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">જાહેરાતનો પ્રકાર પસંદ કરો</label>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { val: 'general', label: 'સામાન્ય', icon: '📢' },
                                { val: 'death', label: 'શ્રદ્ધાંજલિ', icon: '🙏' },
                                { val: 'event', label: 'ઉત્સવ', icon: '🎉' }
                            ].map((typeOption) => (
                                <button
                                    key={typeOption.val}
                                    type="button"
                                    onClick={() => setNewType(typeOption.val as any)}
                                    className={`p-2 rounded-xl border text-sm font-bold flex flex-col items-center gap-1 transition-all ${
                                        newType === typeOption.val 
                                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500' 
                                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <span className="text-lg">{typeOption.icon}</span>
                                    {typeOption.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">શીર્ષક (Title)</label>
                            <input 
                                type="text" 
                                required
                                placeholder="દા.ત. નવરાત્રી મહોત્સવ"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
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
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
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
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">મોબાઈલ નંબર</label>
                                <input 
                                    type="tel" 
                                    required
                                    value={newMobile}
                                    onChange={(e) => setNewMobile(e.target.value)}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                        <button type="submit" className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                            {editId ? (
                                <>
                                    <span>સુધારો સેવ કરો</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                </>
                            ) : (
                                <>
                                    <span>જાહેરાત પબ્લિશ કરો</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
                                </>
                            )}
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