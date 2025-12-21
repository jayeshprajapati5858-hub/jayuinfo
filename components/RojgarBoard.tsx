import React, { useState, useEffect } from 'react';
import { pool } from '../utils/db';

interface JobListing {
  id: number;
  category: 'hire' | 'work';
  title: string;
  details: string;
  wages: string;
  contact_name: string;
  mobile: string;
  date_str: string;
}

const RojgarBoard: React.FC = () => {
  const [listings, setListings] = useState<JobListing[]>([]);
  const [activeTab, setActiveTab] = useState<'hire' | 'work'>('hire');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Admin State
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pin, setPin] = useState('');

  // Form
  const [newTitle, setNewTitle] = useState('');
  const [newDetails, setNewDetails] = useState('');
  const [newWages, setNewWages] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newMobile, setNewMobile] = useState('');

  const initDb = async () => {
      try {
          await pool.query(`
             CREATE TABLE IF NOT EXISTS jobs (
                 id SERIAL PRIMARY KEY,
                 category TEXT, title TEXT, details TEXT, wages TEXT, contact_name TEXT, mobile TEXT, date_str TEXT
             )
          `);
      } catch(e) { console.error(e); }
  };

  const fetchJobs = async () => {
      setLoading(true);
      try {
          await initDb();
          const res = await pool.query('SELECT * FROM jobs ORDER BY id DESC');
          setListings(res.rows);
      } catch(e) { console.error(e); }
      finally { setLoading(false); }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleLogin = () => {
    if (pin === '1234') {
      setIsAdmin(true);
      setShowLogin(false);
      setPin('');
    } else {
      alert('ખોટો પિન!');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newTitle.trim()) return;
      
      try {
          await pool.query(
              `INSERT INTO jobs (category, title, details, wages, contact_name, mobile, date_str) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
              [activeTab, newTitle, newDetails, newWages, newContact, newMobile, new Date().toLocaleDateString('gu-IN')]
          );
          fetchJobs();
          setShowForm(false);
          setNewTitle(''); setNewDetails(''); setNewWages(''); setNewContact(''); setNewMobile('');
          alert('જાહેરાત સફળતાપૂર્વક મુકાઈ ગઈ.');
      } catch(e) { 
        console.error(e);
        alert('Error saving job'); 
      }
  };

  const handleDelete = async (id: number) => {
      if(confirm('આ જાહેરાત ડિલીટ કરવી છે?')) {
          try {
            await pool.query('DELETE FROM jobs WHERE id = $1', [id]);
            setListings(listings.filter(j => j.id !== id));
          } catch(e) {
            console.error(e);
          }
      }
  };

  const shareJob = (job: JobListing) => {
    const text = `રોજગાર જાહેરાત (${job.category === 'hire' ? 'નોકરી' : 'કામ'})\n\n*${job.title}*\n${job.details}\n\nપગાર: ${job.wages}\nસંપર્ક: ${job.contact_name} (${job.mobile})`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const filteredListings = listings.filter(item => item.category === activeTab);

  if(loading) return <div className="p-10 text-center">Loading Jobs...</div>;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 mt-6 mb-8 animate-fade-in pb-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">રોજગાર કેન્દ્ર</h2>
        <button onClick={() => setShowForm(true)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-emerald-700 transition-colors">
          + જાહેરાત મૂકો
        </button>
      </div>

      <div className="flex bg-gray-100 p-1 rounded-xl mb-6 shadow-inner">
        <button onClick={() => setActiveTab('hire')} className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'hire' ? 'bg-white shadow text-emerald-700' : 'text-gray-500 hover:text-gray-700'}`}>માણસો જોઈએ છે (Hiring)</button>
        <button onClick={() => setActiveTab('work')} className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'work' ? 'bg-white shadow text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}>કામ જોઈએ છે (Need Work)</button>
      </div>

      <div className="space-y-4">
        {filteredListings.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-400">કોઈ જાહેરાત ઉપલબ્ધ નથી.</p>
            </div>
        ) : (
            filteredListings.map(item => (
            <div key={item.id} className={`bg-white rounded-xl p-5 border-l-4 shadow-sm relative ${item.category === 'hire' ? 'border-emerald-500' : 'border-blue-500'}`}>
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                    {isAdmin && (
                        <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-600 bg-red-50 p-1 rounded text-xs">
                            Delete
                        </button>
                    )}
                </div>
                <p className="text-sm text-gray-700 my-2 whitespace-pre-wrap">{item.details}</p>
                
                <div className="flex flex-wrap gap-2 my-3">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                        💰 {item.wages}
                    </span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                        👤 {item.contact_name}
                    </span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                        📅 {item.date_str}
                    </span>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 flex gap-3">
                     <a href={`tel:${item.mobile}`} className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-sm font-bold text-center shadow-md hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                        Call
                     </a>
                     <button onClick={() => shareJob(item)} className="flex-1 bg-green-100 text-green-700 py-2 rounded-lg text-sm font-bold text-center hover:bg-green-200 transition-colors flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                        Share
                     </button>
                </div>
            </div>
        )))}
      </div>

      {/* Admin Login Panel */}
      <div className="mt-8 pt-4 border-t border-gray-200 text-center">
          {!isAdmin ? (
             <div className="flex justify-center">
                 {!showLogin ? (
                     <button onClick={() => setShowLogin(true)} className="text-xs text-gray-300 hover:text-gray-500">
                        Admin Login (For Deletion)
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
             <div className="flex flex-col items-center gap-2">
                 <span className="text-xs text-green-600 font-bold">Admin Logged In (Delete Enabled)</span>
                 <button onClick={() => setIsAdmin(false)} className="text-xs text-red-500 bg-red-50 px-3 py-1 rounded-full">
                    Logout
                 </button>
             </div>
          )}
      </div>

      {showForm && (
         <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-800 text-lg">
                        {activeTab === 'hire' ? 'નવી ભરતી જાહેરાત' : 'કામ માટે જાહેરાત'}
                    </h3>
                    <button onClick={() => setShowForm(false)} className="text-gray-400">✕</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">કામનું શીર્ષક (Title)</label>
                        <input type="text" placeholder="દા.ત. ખેતર કામ માટે મજૂર જોઈએ છે" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full p-3 border rounded-xl bg-gray-50" required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">વિગતવાર માહિતી</label>
                        <textarea placeholder="કામનો સમય, પ્રકાર વગેરે..." value={newDetails} onChange={e => setNewDetails(e.target.value)} className="w-full p-3 border rounded-xl bg-gray-50" required rows={3}/>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">પગાર / મહેનતાણું</label>
                        <input type="text" placeholder="દા.ત. ૩૦૦/દિવસ અથવા નક્કી કર્યા મુજબ" value={newWages} onChange={e => setNewWages(e.target.value)} className="w-full p-3 border rounded-xl bg-gray-50" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">તમારું નામ</label>
                            <input type="text" placeholder="નામ" value={newContact} onChange={e => setNewContact(e.target.value)} className="w-full p-3 border rounded-xl bg-gray-50" required />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">મોબાઈલ નંબર</label>
                            <input type="tel" placeholder="નંબર" value={newMobile} onChange={e => setNewMobile(e.target.value)} className="w-full p-3 border rounded-xl bg-gray-50" required />
                        </div>
                    </div>
                    
                    <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-emerald-700 transition-all">
                        જાહેરાત પબ્લિશ કરો
                    </button>
                </form>
            </div>
         </div>
      )}
    </div>
  );
};
export default RojgarBoard;