import React, { useState, useEffect } from 'react';
import { pool } from '../utils/db';

interface Business {
  id: number;
  name: string;
  category: string;
  owner: string;
  mobile: string;
  details: string;
}

const BusinessDirectory: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('kirana');
  const [newOwner, setNewOwner] = useState('');
  const [newMobile, setNewMobile] = useState('');
  const [newDetails, setNewDetails] = useState('');

  const initDb = async () => {
      try {
          await pool.query(`
             CREATE TABLE IF NOT EXISTS businesses (
                 id SERIAL PRIMARY KEY, name TEXT, category TEXT, owner TEXT, mobile TEXT, details TEXT
             )
          `);
      } catch(e) { console.error(e); }
  };

  const fetchBusinesses = async () => {
      setLoading(true);
      try {
          await initDb();
          const res = await pool.query('SELECT * FROM businesses ORDER BY id DESC');
          setBusinesses(res.rows);
      } catch(e) { console.error(e); }
      finally { setLoading(false); }
  };

  useEffect(() => { fetchBusinesses(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          await pool.query(
              `INSERT INTO businesses (name, category, owner, mobile, details) VALUES ($1, $2, $3, $4, $5)`,
              [newName, newCategory, newOwner, newMobile, newDetails]
          );
          fetchBusinesses();
          setShowForm(false);
          setNewName(''); setNewOwner(''); setNewMobile(''); setNewDetails('');
          alert('દુકાન ઉમેરાઈ ગઈ!');
      } catch(e) { 
        console.error(e);
        alert('Error adding business'); 
      }
  };

  const handleDelete = async (id: number) => {
      if(confirm('Delete this business?')) {
          try {
            await pool.query('DELETE FROM businesses WHERE id = $1', [id]);
            setBusinesses(businesses.filter(b => b.id !== id));
          } catch (e) { console.error(e); }
      }
  };

  const filteredBusinesses = businesses.filter(b => {
      const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || b.category === selectedCategory;
      return matchesSearch && matchesCategory;
  });

  if(loading) return <div className="p-10 text-center">Loading Directory...</div>;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 mt-6 mb-8 animate-fade-in pb-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">ગામનો વેપાર (Dukano)</h2>
        <button onClick={() => setShowForm(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md">
          + ઉમેરો
        </button>
      </div>

      <div className="mb-6 space-y-4">
          <input type="text" placeholder="દુકાન શોધો..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full p-3 border rounded-xl" />
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {['all', 'kirana', 'agro', 'service', 'transport'].map(cat => (
                  <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-3 py-1 rounded-full text-sm font-bold border ${selectedCategory === cat ? 'bg-gray-800 text-white' : 'bg-white'}`}>
                      {cat}
                  </button>
              ))}
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {filteredBusinesses.map(item => (
             <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 relative">
                 <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-xl shrink-0">🏪</div>
                 <div className="flex-1">
                     <div className="flex justify-between">
                        <h3 className="font-bold text-gray-800">{item.name}</h3>
                        <button onClick={() => handleDelete(item.id)} className="text-red-300 text-xs">✕</button>
                     </div>
                     <p className="text-xs text-gray-500 font-bold mb-1">{item.owner}</p>
                     <p className="text-sm text-gray-600 mb-2">{item.details}</p>
                     <a href={`tel:${item.mobile}`} className="inline-block bg-gray-100 px-3 py-1 rounded text-xs font-bold text-gray-700">📞 {item.mobile}</a>
                 </div>
             </div>
         ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-md p-6">
                <h3 className="font-bold mb-4">દુકાન ઉમેરો</h3>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input type="text" placeholder="દુકાનનું નામ" value={newName} onChange={e => setNewName(e.target.value)} className="w-full p-2 border rounded" required />
                    <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className="w-full p-2 border rounded">
                        <option value="kirana">કરિયાણું</option>
                        <option value="agro">ખેતીવાડી</option>
                        <option value="service">સર્વિસ</option>
                        <option value="transport">વાહન</option>
                    </select>
                    <input type="text" placeholder="માલિકનું નામ" value={newOwner} onChange={e => setNewOwner(e.target.value)} className="w-full p-2 border rounded" required />
                    <input type="tel" placeholder="મોબાઈલ" value={newMobile} onChange={e => setNewMobile(e.target.value)} className="w-full p-2 border rounded" required />
                    <textarea placeholder="વિગત" value={newDetails} onChange={e => setNewDetails(e.target.value)} className="w-full p-2 border rounded" required />
                    <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded font-bold">ઉમેરો</button>
                    <button type="button" onClick={() => setShowForm(false)} className="w-full mt-1 text-gray-500 text-xs">બંધ</button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};
export default BusinessDirectory;
