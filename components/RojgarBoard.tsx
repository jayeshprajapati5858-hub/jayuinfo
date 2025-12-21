import React, { useState, useEffect } from 'react';
// @ts-ignore
import { Pool } from '@neondatabase/serverless';

const connectionString = 'postgresql://neondb_owner:npg_LZ5H2AChwUGB@ep-sparkling-block-a4stnq97-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require';
const pool = new Pool({ connectionString });

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

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          await pool.query(
              `INSERT INTO jobs (category, title, details, wages, contact_name, mobile, date_str) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
              [activeTab, newTitle, newDetails, newWages, newContact, newMobile, new Date().toLocaleDateString('gu-IN')]
          );
          fetchJobs();
          setShowForm(false);
          setNewTitle(''); setNewDetails(''); setNewWages(''); setNewContact(''); setNewMobile('');
          alert('જાહેરાત સફળતાપૂર્વક મુકાઈ ગઈ.');
      } catch(e) { alert('Error saving job'); }
  };

  const handleDelete = async (id: number) => {
      if(confirm('Delete this listing?')) {
          await pool.query('DELETE FROM jobs WHERE id = $1', [id]);
          setListings(listings.filter(j => j.id !== id));
      }
  };

  const filteredListings = listings.filter(item => item.category === activeTab);

  if(loading) return <div className="p-10 text-center">Loading Jobs...</div>;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 mt-6 mb-8 animate-fade-in pb-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">રોજગાર કેન્દ્ર</h2>
        <button onClick={() => setShowForm(true)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md">
          + જાહેરાત મૂકો
        </button>
      </div>

      <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
        <button onClick={() => setActiveTab('hire')} className={`flex-1 py-2 rounded-lg font-bold ${activeTab === 'hire' ? 'bg-white shadow' : 'text-gray-500'}`}>માણસો જોઈએ છે</button>
        <button onClick={() => setActiveTab('work')} className={`flex-1 py-2 rounded-lg font-bold ${activeTab === 'work' ? 'bg-white shadow' : 'text-gray-500'}`}>કામ જોઈએ છે</button>
      </div>

      <div className="space-y-4">
        {filteredListings.length === 0 ? <p className="text-center text-gray-400">કોઈ માહિતી નથી.</p> : filteredListings.map(item => (
            <div key={item.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm relative">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold">{item.title}</h3>
                    <button onClick={() => handleDelete(item.id)} className="text-red-300 hover:text-red-500 text-xs">✕</button>
                </div>
                <p className="text-sm text-gray-600 my-2">{item.details}</p>
                <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 p-2 rounded">
                    <div><strong>પગાર:</strong> {item.wages}</div>
                    <div><strong>સંપર્ક:</strong> {item.contact_name}</div>
                </div>
                <div className="mt-3 pt-2 border-t flex justify-between">
                     <span className="text-xs text-gray-400">{item.date_str}</span>
                     <a href={`tel:${item.mobile}`} className="text-emerald-600 font-bold text-sm">Call Now</a>
                </div>
            </div>
        ))}
      </div>

      {showForm && (
         <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-md p-6">
                <h3 className="font-bold mb-4">{activeTab === 'hire' ? 'માણસો જોઈએ છે' : 'કામ જોઈએ છે'}</h3>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input type="text" placeholder="કામનું શીર્ષક" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full p-2 border rounded" required />
                    <textarea placeholder="વિગત" value={newDetails} onChange={e => setNewDetails(e.target.value)} className="w-full p-2 border rounded" required />
                    <input type="text" placeholder="પગાર" value={newWages} onChange={e => setNewWages(e.target.value)} className="w-full p-2 border rounded" required />
                    <input type="text" placeholder="તમારું નામ" value={newContact} onChange={e => setNewContact(e.target.value)} className="w-full p-2 border rounded" required />
                    <input type="tel" placeholder="મોબાઈલ" value={newMobile} onChange={e => setNewMobile(e.target.value)} className="w-full p-2 border rounded" required />
                    <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded font-bold">સબમિટ</button>
                    <button type="button" onClick={() => setShowForm(false)} className="w-full mt-2 text-gray-500 text-xs">બંધ કરો</button>
                </form>
            </div>
         </div>
      )}
    </div>
  );
};
export default RojgarBoard;