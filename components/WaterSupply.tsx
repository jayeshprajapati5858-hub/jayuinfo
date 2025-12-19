import React, { useState, useEffect } from 'react';

interface WaterUpdate {
  id: number;
  date: string;
  lineName: string;
  area: string;
  time: string;
  status: 'Running' | 'Upcoming' | 'Completed';
}

interface Complaint {
  id: number;
  name: string;
  details: string;
  date: string;
  status: 'Pending' | 'Resolved';
}

const initialData: WaterUpdate[] = [
  { 
    id: 1, 
    date: new Date().toISOString().split('T')[0], 
    lineName: 'નર્મદા લાઈન (મેઈન)', 
    area: 'પટેલ વાસ અને મેઈન બજાર', 
    time: '08:00 AM થી 10:00 AM', 
    status: 'Running' 
  },
];

const WaterSupply: React.FC = () => {
  // --- STATE MANAGEMENT ---
  const [updates, setUpdates] = useState<WaterUpdate[]>(() => {
    const saved = localStorage.getItem('waterUpdates');
    return saved ? JSON.parse(saved) : initialData;
  });

  const [tankLevel, setTankLevel] = useState<number>(() => {
    const saved = localStorage.getItem('tankLevel');
    return saved ? parseInt(saved) : 75; // Default 75%
  });

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem('waterComplaints');
    return saved ? JSON.parse(saved) : [];
  });

  // New State for Operator Notice
  const [notice, setNotice] = useState<string>(() => {
    return localStorage.getItem('waterNotice') || 'આજે પાણી રાબેતા મુજબ સમયસર આવશે.';
  });
  const [noticeDate, setNoticeDate] = useState<string>(() => {
    return localStorage.getItem('waterNoticeDate') || new Date().toLocaleDateString('gu-IN');
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pin, setPin] = useState('');

  // Update Form State
  const [newLineName, setNewLineName] = useState('');
  const [newArea, setNewArea] = useState('');
  
  // Time Inputs State
  const [startTime, setStartTime] = useState('07:00');
  const [startAmPm, setStartAmPm] = useState('AM');
  const [endTime, setEndTime] = useState('09:00');
  const [endAmPm, setEndAmPm] = useState('AM');

  const [newStatus, setNewStatus] = useState<'Running' | 'Upcoming'>('Upcoming');

  // Complaint Form State
  const [complainerName, setComplainerName] = useState('');
  const [complaintDetails, setComplaintDetails] = useState('');
  const [showComplaintForm, setShowComplaintForm] = useState(false);

  // --- EFFECTS ---
  useEffect(() => {
    localStorage.setItem('waterUpdates', JSON.stringify(updates));
  }, [updates]);

  useEffect(() => {
    localStorage.setItem('tankLevel', tankLevel.toString());
  }, [tankLevel]);

  useEffect(() => {
    localStorage.setItem('waterComplaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('waterNotice', notice);
    localStorage.setItem('waterNoticeDate', noticeDate);
  }, [notice, noticeDate]);

  // --- HANDLERS ---
  const handleLogin = () => {
    if (pin === '1234') {
      setIsAdmin(true);
      setShowLogin(false);
      setPin('');
    } else {
      alert('ખોટો પિન છે!');
    }
  };

  const handleUpdateNotice = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setNotice(e.target.value);
      setNoticeDate(new Date().toLocaleDateString('gu-IN'));
  };

  const handleAddUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLineName.trim()) { alert('કૃપા કરીને લાઈનનું નામ લખો.'); return; }
    
    // Construct time string with AM/PM
    const formattedTime = `${startTime} ${startAmPm} થી ${endTime} ${endAmPm}`;

    const newUpdate: WaterUpdate = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      lineName: newLineName,
      area: newArea,
      time: formattedTime,
      status: newStatus
    };
    setUpdates([newUpdate, ...updates]);
    setNewLineName('');
    setNewArea('');
    alert('માહિતી ઉમેરાઈ ગઈ!');
  };

  const handleDeleteUpdate = (id: number) => {
    if(window.confirm('ડિલીટ કરવું છે?')) {
        setUpdates(updates.filter(u => u.id !== id));
    }
  };

  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    const newComplaint: Complaint = {
      id: Date.now(),
      name: complainerName,
      details: complaintDetails,
      date: new Date().toLocaleDateString('gu-IN'),
      status: 'Pending'
    };
    setComplaints([newComplaint, ...complaints]);
    setComplainerName('');
    setComplaintDetails('');
    setShowComplaintForm(false);
    alert('તમારી ફરિયાદ નોંધાઈ ગઈ છે. વાલ્વમેન જલ્દી તપાસ કરશે.');
  };

  const resolveComplaint = (id: number) => {
    const updated = complaints.map(c => c.id === id ? { ...c, status: 'Resolved' as const } : c);
    setComplaints(updated);
  };

  const deleteComplaint = (id: number) => {
      setComplaints(complaints.filter(c => c.id !== id));
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 animate-fade-in pb-20">
      
      {/* 1. HERO SECTION: TANK STATUS */}
      <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl shadow-xl text-white p-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold">ગ્રામ પંચાયત પાણી પુરવઠો</h2>
            <p className="text-blue-100 text-sm opacity-90">લાઈવ પાણી પુરવઠા માહિતી</p>
            <div className="mt-4 flex items-center justify-center md:justify-start gap-2 bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-md">
               <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
               <span className="text-xs font-semibold">સિસ્ટમ ચાલુ છે</span>
            </div>
          </div>

          {/* Tank Level Visual */}
          <div className="flex flex-col items-center">
             <div className="w-24 h-32 border-4 border-white/30 rounded-xl relative overflow-hidden bg-blue-900/20 backdrop-blur-sm">
                <div 
                  className="absolute bottom-0 left-0 w-full bg-blue-200 transition-all duration-1000 ease-in-out opacity-80"
                  style={{ height: `${tankLevel}%` }}
                >
                   {/* Wave effect overlay */}
                   <div className="absolute top-0 left-0 w-full h-2 bg-white/50 animate-pulse"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <span className="font-bold text-xl drop-shadow-md">{tankLevel}%</span>
                </div>
             </div>
             <p className="text-xs mt-2 font-medium text-blue-100">ટાંકી લેવલ</p>
          </div>
        </div>
      </div>

      {/* 2. OPERATOR INFO CARD */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-blue-100 mb-6">
         <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
             </div>
             <div>
                 <p className="text-xs text-gray-400 font-bold uppercase">ઓપરેટર</p>
                 <p className="font-bold text-gray-800 text-sm">દિનેશભાઈ</p>
             </div>
         </div>
         <a href="tel:+919328088547" className="bg-green-500 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-green-200 shadow-lg hover:bg-green-600 transition-all">
             કોલ કરો
         </a>
      </div>

      {/* 2.5 NOTICE BOARD SECTION (NEW) */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 shadow-sm relative overflow-hidden">
         {/* Decorative background icon */}
         <svg className="absolute -right-4 -bottom-4 w-24 h-24 text-amber-100/50 transform rotate-12" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
         
         <div className="flex gap-4 relative z-10">
            <div className="bg-amber-100 p-3 rounded-full h-fit shrink-0">
                <svg className="w-6 h-6 text-amber-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>
            </div>
            <div className="w-full">
                <div className="flex justify-between items-center mb-1">
                    <h3 className="text-amber-800 font-bold text-sm uppercase tracking-wider">ઓપરેટરની અગત્યની સૂચના</h3>
                    <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">{noticeDate}</span>
                </div>
                <div className="bg-white/60 p-3 rounded-lg border border-amber-100">
                    <p className="text-gray-800 font-medium text-sm leading-relaxed whitespace-pre-wrap">
                        {notice || "હાલમાં કોઈ નવી સૂચના નથી."}
                    </p>
                </div>
            </div>
         </div>
      </div>

      {/* 3. SCHEDULE LIST */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
           <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
             <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
             આજનું વિતરણ
           </h3>
           <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
             {new Date().toLocaleDateString('gu-IN')}
           </span>
        </div>
        
        <div className="space-y-4">
           {updates.length === 0 ? (
               <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                   <p className="text-gray-400">આજે પાણીની કોઈ માહિતી નથી.</p>
               </div>
           ) : (
               updates.map((update) => (
                   <div key={update.id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden relative group hover:shadow-lg transition-shadow">
                       {/* Left Color Bar based on Status */}
                       <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                           update.status === 'Running' ? 'bg-green-500' : update.status === 'Upcoming' ? 'bg-blue-500' : 'bg-gray-400'
                       }`}></div>
                       
                       <div className="p-5 pl-7">
                           <div className="flex justify-between items-start mb-2">
                               <h4 className="text-lg font-bold text-gray-800">{update.lineName}</h4>
                               {update.status === 'Running' && <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-md animate-pulse">ચાલુ છે</span>}
                               {update.status === 'Upcoming' && <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-md">આવશે</span>}
                               {update.status === 'Completed' && <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded-md">પૂરું થયું</span>}
                           </div>
                           
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                               <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                  <span className="truncate">{update.area}</span>
                               </div>
                               <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                  <span>{update.time}</span>
                               </div>
                           </div>
                           
                           {isAdmin && (
                               <button onClick={() => handleDeleteUpdate(update.id)} className="mt-3 text-xs text-red-500 hover:text-red-700 font-medium">
                                   ડિલીટ
                               </button>
                           )}
                       </div>
                   </div>
               ))
           )}
        </div>
      </div>

      {/* 4. COMPLAINT SECTION */}
      <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100 relative overflow-visible">
         <div className="flex items-center justify-between mb-4 relative z-10">
             <h3 className="text-lg font-bold text-orange-900 flex items-center gap-2">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>
                 ફરિયાદ પેટી
             </h3>
             
             {/* Stylish Button */}
             <button 
                onClick={() => setShowComplaintForm(!showComplaintForm)}
                className={`
                  flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95
                  ${showComplaintForm 
                    ? 'bg-gray-200 text-gray-600 shadow-none' 
                    : 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-orange-500/30'
                  }
                `}
             >
                {showComplaintForm ? (
                   <>બંધ કરો</>
                ) : (
                   <>
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                     નવી ફરિયાદ
                   </>
                )}
             </button>
         </div>

         {showComplaintForm && (
             <form onSubmit={handleSubmitComplaint} className="bg-white p-4 rounded-xl shadow-sm mb-6 animate-fade-in-up border border-orange-100">
                 <div className="space-y-3">
                     <input 
                        type="text" 
                        placeholder="તમારું નામ"
                        value={complainerName}
                        onChange={e => setComplainerName(e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 bg-gray-50"
                        required
                     />
                     <textarea 
                        placeholder="ફરિયાદ શું છે? (દા.ત. પાણી ધીમું આવે છે, વાલ લીકેજ છે...)"
                        value={complaintDetails}
                        onChange={e => setComplaintDetails(e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 min-h-[80px] bg-gray-50"
                        required
                     ></textarea>
                     <button type="submit" className="w-full bg-orange-500 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-orange-600 transition-colors shadow-md">
                         ફરિયાદ મોકલો
                     </button>
                 </div>
             </form>
         )}

         {/* Public Complaint List (Last 3) */}
         <div className="space-y-3">
             {complaints.length === 0 ? (
                 <p className="text-sm text-orange-800/60 italic text-center py-4 bg-orange-50/50 rounded-lg">
                    હાલમાં કોઈ ફરિયાદ નથી.
                 </p>
             ) : (
                 complaints.slice(0, 3).map(complaint => (
                     <div key={complaint.id} className="bg-white p-3 rounded-lg border border-orange-100 flex justify-between items-start shadow-sm">
                         <div>
                             <p className="text-sm font-bold text-gray-800">{complaint.name}</p>
                             <p className="text-xs text-gray-600 mt-1">{complaint.details}</p>
                             <p className="text-[10px] text-gray-400 mt-1">{complaint.date}</p>
                         </div>
                         <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${complaint.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                             {complaint.status === 'Resolved' ? 'ઉકેલાઈ ગયું' : 'પેન્ડિંગ'}
                         </span>
                         
                         {isAdmin && (
                             <div className="flex flex-col gap-1 ml-2">
                                {complaint.status === 'Pending' && (
                                    <button onClick={() => resolveComplaint(complaint.id)} className="text-[10px] text-green-600 font-bold border border-green-200 px-1 rounded hover:bg-green-50">Solve</button>
                                )}
                                <button onClick={() => deleteComplaint(complaint.id)} className="text-[10px] text-red-600 border border-red-200 px-1 rounded hover:bg-red-50">Del</button>
                             </div>
                         )}
                     </div>
                 ))
             )}
         </div>
      </div>

      {/* 5. ADMIN PANEL TOGGLE */}
      <div className="mt-12 pt-8 border-t border-gray-200">
          {!isAdmin ? (
             <div className="flex justify-center">
                 {!showLogin ? (
                     <button onClick={() => setShowLogin(true)} className="text-xs text-gray-300 hover:text-gray-500 transition-colors">
                        એડમિન લોગીન
                     </button>
                 ) : (
                     <div className="flex gap-2 items-center bg-gray-100 p-2 rounded-lg">
                         <input 
                            type="password" 
                            value={pin}
                            onChange={e => setPin(e.target.value)}
                            placeholder="PIN"
                            className="w-20 p-1 text-sm border rounded"
                         />
                         <button onClick={handleLogin} className="bg-gray-800 text-white text-xs px-3 py-1.5 rounded">દાખલ</button>
                         <button onClick={() => setShowLogin(false)} className="text-gray-500 text-xs px-2">X</button>
                     </div>
                 )}
             </div>
          ) : (
              <div className="bg-slate-800 text-white rounded-xl p-6 shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-blue-200">એડમિન પેનલ</h3>
                      <button onClick={() => setIsAdmin(false)} className="text-xs bg-red-500 hover:bg-red-600 px-3 py-1 rounded">લોગ આઉટ</button>
                  </div>

                  {/* Admin: Notice Board Edit */}
                  <div className="mb-6 bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                      <label className="block text-xs font-bold text-amber-400 mb-2 flex items-center gap-2">
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>
                         સૂચના બોર્ડ અપડેટ
                      </label>
                      <textarea
                        value={notice}
                        onChange={handleUpdateNotice}
                        rows={2}
                        className="w-full bg-slate-800 border border-slate-600 text-white text-sm rounded p-2 focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                        placeholder="અહીં લખો..."
                      />
                  </div>

                  {/* Admin: Tank Level */}
                  <div className="mb-6">
                      <label className="block text-xs font-bold text-gray-400 mb-2">ટાંકી લેવલ કંટ્રોલ ({tankLevel}%)</label>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={tankLevel} 
                        onChange={(e) => setTankLevel(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                      <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                          <span>ખાલી</span>
                          <span>ભરેલી</span>
                      </div>
                  </div>
                  
                  {/* Admin: Add Schedule */}
                  <form onSubmit={handleAddUpdate} className="space-y-4 border-t border-gray-700 pt-4">
                      <p className="text-xs font-bold text-blue-400">નવું શેડ્યૂલ ઉમેરો</p>
                      <div className="space-y-3">
                          <input 
                             type="text" 
                             value={newLineName}
                             onChange={(e) => setNewLineName(e.target.value)}
                             placeholder="લાઈનનું નામ (દા.ત. નર્મદા)"
                             className="w-full bg-gray-700 border-none text-white text-sm rounded p-2 focus:ring-1 focus:ring-blue-500"
                          />
                          <input 
                             type="text" 
                             value={newArea}
                             onChange={(e) => setNewArea(e.target.value)}
                             placeholder="વિસ્તારનું નામ (દા.ત. પટેલ વાસ)"
                             className="w-full bg-gray-700 border-none text-white text-sm rounded p-2 focus:ring-1 focus:ring-blue-500"
                          />
                          
                          {/* Time Selection with AM/PM */}
                          <div className="bg-gray-700 p-2 rounded-lg">
                              <label className="block text-[10px] text-gray-400 mb-1">સમય પત્રક (AM/PM)</label>
                              <div className="flex items-center gap-2">
                                  {/* Start Time */}
                                  <div className="flex-1 flex gap-1">
                                      <input 
                                        type="text" 
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        className="w-full bg-gray-600 text-white text-xs p-1.5 rounded text-center"
                                        placeholder="08:00"
                                      />
                                      <select 
                                        value={startAmPm}
                                        onChange={(e) => setStartAmPm(e.target.value)}
                                        className="bg-gray-600 text-white text-xs p-1 rounded"
                                      >
                                          <option value="AM">AM</option>
                                          <option value="PM">PM</option>
                                      </select>
                                  </div>
                                  <span className="text-gray-400 text-xs">થી</span>
                                  {/* End Time */}
                                  <div className="flex-1 flex gap-1">
                                      <input 
                                        type="text" 
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        className="w-full bg-gray-600 text-white text-xs p-1.5 rounded text-center"
                                        placeholder="10:00"
                                      />
                                      <select 
                                        value={endAmPm}
                                        onChange={(e) => setEndAmPm(e.target.value)}
                                        className="bg-gray-600 text-white text-xs p-1 rounded"
                                      >
                                          <option value="AM">AM</option>
                                          <option value="PM">PM</option>
                                      </select>
                                  </div>
                              </div>
                          </div>

                          <select 
                             value={newStatus}
                             onChange={(e) => setNewStatus(e.target.value as any)}
                             className="w-full bg-gray-700 border-none text-white text-sm rounded p-2 focus:ring-1 focus:ring-blue-500"
                          >
                             <option value="Upcoming">આવશે</option>
                             <option value="Running">ચાલુ છે</option>
                          </select>
                      </div>
                      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded font-bold text-sm shadow-lg">માહિતી ઉમેરો</button>
                  </form>
              </div>
          )}
      </div>

    </div>
  );
};

export default WaterSupply;