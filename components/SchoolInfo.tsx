import React, { useState, useEffect } from 'react';
// @ts-ignore
import { Pool } from '@neondatabase/serverless';

const connectionString = 'postgresql://neondb_owner:npg_LZ5H2AChwUGB@ep-sparkling-block-a4stnq97-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require';
const pool = new Pool({ connectionString });

interface SchoolUpdate {
  id: number;
  title: string;
  date_str: string;
}

const SchoolInfo: React.FC = () => {
  const [updates, setUpdates] = useState<SchoolUpdate[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  
  // Admin Login State
  const [isAdmin, setIsAdmin] = useState(false);
  const [pin, setPin] = useState('');
  const [showLogin, setShowLogin] = useState(false);

  const initDb = async () => {
      try {
        await pool.query(`CREATE TABLE IF NOT EXISTS school_updates (id SERIAL PRIMARY KEY, title TEXT, date_str TEXT)`);
      } catch(e) {
        console.error("Init Error", e);
      }
  };

  const fetchUpdates = async () => {
      try {
          await initDb();
          const res = await pool.query('SELECT * FROM school_updates ORDER BY id DESC');
          setUpdates(res.rows);
      } catch(e) {
          console.error("Fetch Error", e);
      }
  };

  useEffect(() => { fetchUpdates(); }, []);

  const addUpdate = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        await pool.query(`INSERT INTO school_updates (title, date_str) VALUES ($1, $2)`, [newTitle, new Date().toLocaleDateString('gu-IN')]);
        fetchUpdates();
        setNewTitle('');
        setShowForm(false);
      } catch(err) {
        console.error(err);
      }
  };

  const deleteUpdate = async (id: number) => {
      if(confirm('Delete?')) {
          try {
            await pool.query('DELETE FROM school_updates WHERE id = $1', [id]);
            setUpdates(updates.filter(u => u.id !== id));
          } catch(err) {
            console.error(err);
          }
      }
  };

  const handleLogin = () => {
      if(pin === '1234') { setIsAdmin(true); setShowLogin(false); } else { alert('Wrong PIN'); }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-8 animate-fade-in pb-20">
      
      {/* Dynamic School Updates Section */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 relative">
          <div className="flex justify-between items-center mb-3">
             <h3 className="font-bold text-yellow-800 flex items-center gap-2">📢 શાળાના સમાચાર (School Updates)</h3>
             {isAdmin && <button onClick={() => setShowForm(true)} className="text-xs bg-yellow-200 px-2 py-1 rounded">Add</button>}
          </div>
          <div className="space-y-2">
             {updates.length === 0 ? <p className="text-sm text-gray-500 italic">કોઈ નવી સૂચના નથી.</p> : updates.map(u => (
                 <div key={u.id} className="bg-white p-2 rounded border border-yellow-100 flex justify-between">
                     <span className="text-sm">🔹 {u.title} <span className="text-[10px] text-gray-400">({u.date_str})</span></span>
                     {isAdmin && <button onClick={() => deleteUpdate(u.id)} className="text-red-500 text-xs">✕</button>}
                 </div>
             ))}
          </div>

          {showForm && (
              <div className="mt-4 p-2 bg-white rounded border">
                  <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="New Update..." className="border p-1 w-full text-sm mb-2"/>
                  <button onClick={addUpdate} className="bg-yellow-600 text-white text-xs px-3 py-1 rounded">Post</button>
                  <button onClick={() => setShowForm(false)} className="ml-2 text-xs">Cancel</button>
              </div>
          )}
      </div>

      {/* Static Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl overflow-hidden text-white relative mb-8 p-6">
            <h1 className="text-2xl font-bold mb-1">શ્રી ભરાડા પ્રાથમિક શાળા</h1>
            <p className="text-blue-100 text-sm">સ્થાપના: ૧૯૬૫ | જિ.પં. શિક્ષણ સમિતિ સંચાલિત</p>
      </div>

      {/* Admin Toggle */}
      <div className="text-center mt-8">
          {!isAdmin ? (
              !showLogin ? <button onClick={() => setShowLogin(true)} className="text-xs text-gray-300">School Admin Login</button> :
              <div className="flex justify-center gap-2"><input type="password" value={pin} onChange={e => setPin(e.target.value)} className="border p-1 w-20 text-xs" /><button onClick={handleLogin} className="bg-blue-600 text-white px-2 text-xs rounded">OK</button></div>
          ) : (
              <button onClick={() => setIsAdmin(false)} className="text-xs text-red-400">Logout Admin</button>
          )}
      </div>
    </div>
  );
};
export default SchoolInfo;