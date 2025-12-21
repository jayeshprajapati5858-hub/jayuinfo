import React, { useState, useEffect } from 'react';
import { pool } from '../utils/db';

interface WaterUpdate {
  id: number;
  line_name: string;
  area: string;
  time_slot: string;
  status: 'Running' | 'Upcoming' | 'Completed';
}

interface Complaint {
  id: number;
  name: string;
  details: string;
  date_str: string;
  status: 'Pending' | 'Resolved';
}

const WaterSupply: React.FC = () => {
  // --- STATE ---
  const [updates, setUpdates] = useState<WaterUpdate[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [tankLevel, setTankLevel] = useState<number>(75);
  const [notice, setNotice] = useState<string>('');
  const [noticeDate, setNoticeDate] = useState<string>('');
  
  const [loading, setLoading] = useState(true);

  // Admin State
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pin, setPin] = useState('');

  // Form States
  const [newLineName, setNewLineName] = useState('');
  const [newArea, setNewArea] = useState('');
  const [startTime, setStartTime] = useState('07:00');
  const [startAmPm, setStartAmPm] = useState('AM');
  const [endTime, setEndTime] = useState('09:00');
  const [endAmPm, setEndAmPm] = useState('AM');
  const [newStatus, setNewStatus] = useState<'Running' | 'Upcoming'>('Upcoming');

  // Complaint Form
  const [complainerName, setComplainerName] = useState('');
  const [complaintDetails, setComplaintDetails] = useState('');
  const [showComplaintForm, setShowComplaintForm] = useState(false);

  // --- DB INIT & FETCH ---
  const initDb = async () => {
    try {
        // 1. Water Schedule Table
        await pool.query(`CREATE TABLE IF NOT EXISTS water_schedule (
            id SERIAL PRIMARY KEY, line_name TEXT, area TEXT, time_slot TEXT, status TEXT
        )`);
        // 2. Complaints Table
        await pool.query(`CREATE TABLE IF NOT EXISTS water_complaints (
            id SERIAL PRIMARY KEY, name TEXT, details TEXT, date_str TEXT, status TEXT
        )`);
        // 3. Settings Table (Tank Level & Notice)
        await pool.query(`CREATE TABLE IF NOT EXISTS water_settings (
            key TEXT PRIMARY KEY, value TEXT
        )`);
        
        // Insert defaults if missing
        await pool.query(`INSERT INTO water_settings (key, value) VALUES ('tank_level', '75') ON CONFLICT DO NOTHING`);
        await pool.query(`INSERT INTO water_settings (key, value) VALUES ('notice', 'પાણી રાબેતા મુજબ આવશે.') ON CONFLICT DO NOTHING`);
        await pool.query(`INSERT INTO water_settings (key, value) VALUES ('notice_date', '${new Date().toLocaleDateString('gu-IN')}') ON CONFLICT DO NOTHING`);

    } catch (e) {
        console.error("DB Init Error", e);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
        await initDb();

        // Fetch Schedule
        const schedRes = await pool.query('SELECT * FROM water_schedule ORDER BY id DESC');
        setUpdates(schedRes.rows);

        // Fetch Complaints
        const compRes = await pool.query('SELECT * FROM water_complaints ORDER BY id DESC');
        setComplaints(compRes.rows);

        // Fetch Settings
        const setRes = await pool.query('SELECT * FROM water_settings');
        setRes.rows.forEach((row: any) => {
            if (row.key === 'tank_level') setTankLevel(parseInt(row.value));
            if (row.key === 'notice') setNotice(row.value);
            if (row.key === 'notice_date') setNoticeDate(row.value);
        });

    } catch (e) {
        console.error("Fetch Error", e);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- HANDLERS ---
  const handleLogin = () => {
    if (pin === '1234') { setIsAdmin(true); setShowLogin(false); setPin(''); } 
    else { alert('ખોટો પિન!'); }
  };

  // 1. Update Tank Level
  const updateTankLevel = async (val: number) => {
      setTankLevel(val);
      await pool.query(`UPDATE water_settings SET value = $1 WHERE key = 'tank_level'`, [val.toString()]);
  };

  // 2. Update Notice
  const updateNotice = async (text: string) => {
      setNotice(text);
      const today = new Date().toLocaleDateString('gu-IN');
      setNoticeDate(today);
      await pool.query(`UPDATE water_settings SET value = $1 WHERE key = 'notice'`, [text]);
      await pool.query(`UPDATE water_settings SET value = $1 WHERE key = 'notice_date'`, [today]);
  };

  // 3. Add Schedule
  const handleAddUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLineName.trim()) return;
    const timeSlot = `${startTime} ${startAmPm} થી ${endTime} ${endAmPm}`;
    
    await pool.query(
        `INSERT INTO water_schedule (line_name, area, time_slot, status) VALUES ($1, $2, $3, $4)`,
        [newLineName, newArea, timeSlot, newStatus]
    );
    fetchData();
    setNewLineName(''); setNewArea('');
    alert('શેડ્યૂલ ઉમેરાઈ ગયું.');
  };

  const handleDeleteUpdate = async (id: number) => {
      if(window.confirm('ડિલીટ કરવું છે?')) {
          await pool.query('DELETE FROM water_schedule WHERE id = $1', [id]);
          setUpdates(updates.filter(u => u.id !== id));
      }
  };

  // 4. Complaints
  const handleSubmitComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    const dateStr = new Date().toLocaleDateString('gu-IN');
    
    await pool.query(
        `INSERT INTO water_complaints (name, details, date_str, status) VALUES ($1, $2, $3, 'Pending')`,
        [complainerName, complaintDetails, dateStr]
    );
    
    fetchData();
    setComplainerName(''); setComplaintDetails(''); setShowComplaintForm(false);
    alert('ફરિયાદ નોંધાઈ ગઈ.');
  };

  const resolveComplaint = async (id: number) => {
      await pool.query(`UPDATE water_complaints SET status = 'Resolved' WHERE id = $1`, [id]);
      fetchData();
  };

  const deleteComplaint = async (id: number) => {
      await pool.query('DELETE FROM water_complaints WHERE id = $1', [id]);
      setComplaints(complaints.filter(c => c.id !== id));
  };

  if (loading) return <div className="text-center py-10">Loading Water Data...</div>;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 animate-fade-in pb-20">
      
      {/* HERO SECTION: TANK STATUS */}
      <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl shadow-xl text-white p-6 mb-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold">ગ્રામ પંચાયત પાણી પુરવઠો</h2>
            <div className="mt-4 flex items-center justify-center md:justify-start gap-2 bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-md">
               <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
               <span className="text-xs font-semibold">સિસ્ટમ ઓનલાઇન</span>
            </div>
          </div>
          <div className="flex flex-col items-center">
             <div className="w-24 h-32 border-4 border-white/30 rounded-xl relative overflow-hidden bg-blue-900/20 backdrop-blur-sm">
                <div className="absolute bottom-0 left-0 w-full bg-blue-200 transition-all duration-1000 ease-in-out opacity-80" style={{ height: `${tankLevel}%` }}></div>
                <div className="absolute inset-0 flex items-center justify-center"><span className="font-bold text-xl drop-shadow-md">{tankLevel}%</span></div>
             </div>
             <p className="text-xs mt-2 font-medium text-blue-100">ટાંકી લેવલ</p>
          </div>
        </div>
      </div>

      {/* NOTICE BOARD */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 shadow-sm">
         <div className="flex gap-4">
            <div className="bg-amber-100 p-3 rounded-full h-fit shrink-0"><svg className="w-6 h-6 text-amber-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg></div>
            <div className="w-full">
                <div className="flex justify-between items-center mb-1">
                    <h3 className="text-amber-800 font-bold text-sm uppercase">ઓપરેટરની સૂચના</h3>
                    <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">{noticeDate}</span>
                </div>
                <p className="text-gray-800 font-medium text-sm">{notice}</p>
            </div>
         </div>
      </div>

      {/* SCHEDULE */}
      <div className="mb-10">
        <h3 className="text-lg font-bold text-gray-800 mb-4">આજનું વિતરણ</h3>
        <div className="space-y-4">
           {updates.length === 0 ? (
               <div className="text-center py-10 bg-gray-50 rounded-xl"><p className="text-gray-400">કોઈ માહિતી નથી.</p></div>
           ) : (
               updates.map((update) => (
                   <div key={update.id} className="bg-white rounded-xl shadow-md border border-gray-100 p-5 relative overflow-hidden">
                       <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${update.status === 'Running' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                       <div className="flex justify-between items-start mb-2 pl-2">
                           <h4 className="text-lg font-bold text-gray-800">{update.line_name}</h4>
                           <span className={`px-2 py-1 text-xs font-bold rounded-md ${update.status === 'Running' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{update.status}</span>
                       </div>
                       <div className="pl-2 text-sm text-gray-600">
                           <p>📍 {update.area} | ⏰ {update.time_slot}</p>
                       </div>
                       {isAdmin && <button onClick={() => handleDeleteUpdate(update.id)} className="text-xs text-red-500 mt-2 pl-2">Delete</button>}
                   </div>
               ))
           )}
        </div>
      </div>

      {/* COMPLAINTS */}
      <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100 mb-8">
         <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-bold text-orange-900">ફરિયાદ પેટી</h3>
             <button onClick={() => setShowComplaintForm(!showComplaintForm)} className="bg-orange-500 text-white px-4 py-2 rounded-lg text-xs font-bold">
                {showComplaintForm ? 'બંધ કરો' : 'નવી ફરિયાદ'}
             </button>
         </div>

         {showComplaintForm && (
             <form onSubmit={handleSubmitComplaint} className="bg-white p-4 rounded-xl shadow-sm mb-6 border border-orange-100">
                 <input type="text" placeholder="તમારું નામ" value={complainerName} onChange={e => setComplainerName(e.target.value)} className="w-full p-2 border rounded mb-2" required />
                 <textarea placeholder="ફરિયાદ વિગત..." value={complaintDetails} onChange={e => setComplaintDetails(e.target.value)} className="w-full p-2 border rounded mb-2" required />
                 <button type="submit" className="w-full bg-orange-600 text-white py-2 rounded font-bold">સબમિટ</button>
             </form>
         )}

         <div className="space-y-3">
             {complaints.slice(0, 5).map(c => (
                 <div key={c.id} className="bg-white p-3 rounded-lg border border-orange-100 flex justify-between">
                     <div>
                         <p className="text-sm font-bold">{c.name}</p>
                         <p className="text-xs text-gray-600">{c.details}</p>
                         <p className="text-[10px] text-gray-400">{c.date_str}</p>
                     </div>
                     <div>
                        <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${c.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{c.status}</span>
                        {isAdmin && (
                            <div className="flex flex-col gap-1 mt-1">
                                <button onClick={() => resolveComplaint(c.id)} className="text-[10px] text-green-600">Solve</button>
                                <button onClick={() => deleteComplaint(c.id)} className="text-[10px] text-red-600">Del</button>
                            </div>
                        )}
                     </div>
                 </div>
             ))}
         </div>
      </div>

      {/* ADMIN */}
      <div className="border-t pt-6 text-center">
          {!isAdmin ? (
             !showLogin ? <button onClick={() => setShowLogin(true)} className="text-xs text-gray-400">Admin Login</button> :
             <div className="flex justify-center gap-2"><input type="password" value={pin} onChange={e => setPin(e.target.value)} className="border p-1 text-xs" /><button onClick={handleLogin} className="bg-blue-600 text-white px-2 py-1 text-xs">OK</button></div>
          ) : (
              <div className="bg-slate-800 p-6 rounded-xl text-white text-left">
                  <div className="flex justify-between mb-4"><h3 className="font-bold">Admin Panel</h3><button onClick={() => setIsAdmin(false)} className="text-red-400 text-xs">Logout</button></div>
                  
                  <div className="mb-4">
                      <label className="text-xs">Notice Update</label>
                      <textarea value={notice} onChange={e => updateNotice(e.target.value)} className="w-full text-black p-2 rounded text-sm"/>
                  </div>
                  
                  <div className="mb-4">
                      <label className="text-xs">Tank Level: {tankLevel}%</label>
                      <input type="range" min="0" max="100" value={tankLevel} onChange={e => updateTankLevel(parseInt(e.target.value))} className="w-full" />
                  </div>

                  <form onSubmit={handleAddUpdate} className="space-y-2 border-t border-gray-600 pt-2">
                      <p className="text-xs font-bold text-blue-300">Add Schedule</p>
                      <input type="text" placeholder="Line Name" value={newLineName} onChange={e => setNewLineName(e.target.value)} className="w-full text-black p-2 rounded text-sm"/>
                      <input type="text" placeholder="Area" value={newArea} onChange={e => setNewArea(e.target.value)} className="w-full text-black p-2 rounded text-sm"/>
                      <div className="flex gap-2">
                        <input type="text" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full text-black p-2 rounded text-sm"/>
                        <input type="text" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full text-black p-2 rounded text-sm"/>
                      </div>
                      <select value={newStatus} onChange={e => setNewStatus(e.target.value as any)} className="w-full text-black p-2 rounded"><option value="Upcoming">Upcoming</option><option value="Running">Running</option></select>
                      <button type="submit" className="w-full bg-blue-600 py-2 rounded text-sm font-bold">Add Schedule</button>
                  </form>
              </div>
          )}
      </div>
    </div>
  );
};
export default WaterSupply;
