
import React, { useState } from 'react';
import { pool } from '../utils/db';

const AdminPanel: React.FC = () => {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Form Data
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('gujarat');
  const [imageUrl, setImageUrl] = useState('');
  const [author, setAuthor] = useState('Admin');
  const [isBreaking, setIsBreaking] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '2024') { setIsAuthenticated(true); } else { alert('Invalid PIN'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await pool.query(
        `INSERT INTO news_articles (title, subtitle, content, category, image_url, author, is_breaking, date_str) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [title, subtitle, content, category, imageUrl, author, isBreaking, new Date().toLocaleDateString('gu-IN')]
      );
      alert('News Published!');
      setTitle(''); setContent(''); setSubtitle(''); setImageUrl('');
    } catch (e) {
      console.error(e);
      alert('Failed to publish');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-4">Admin Access</h2>
          <input type="password" value={pin} onChange={e => setPin(e.target.value)} className="border p-2 rounded w-full mb-4" placeholder="Enter PIN (2024)" />
          <button className="bg-red-600 text-white w-full py-2 rounded font-bold">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black">Post News</h1>
        <button onClick={() => setIsAuthenticated(false)} className="text-red-500 font-bold">Logout</button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase">Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} className="w-full p-3 border rounded-lg" required />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase">Subtitle (Short Description)</label>
          <input value={subtitle} onChange={e => setSubtitle(e.target.value)} className="w-full p-3 border rounded-lg" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-3 border rounded-lg">
              <option value="gujarat">Gujarat</option>
              <option value="politics">Politics</option>
              <option value="sports">Sports</option>
              <option value="entertainment">Entertainment</option>
              <option value="technology">Technology</option>
              <option value="world">World</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase">Author</label>
            <input value={author} onChange={e => setAuthor(e.target.value)} className="w-full p-3 border rounded-lg" />
          </div>
        </div>
        
        <div>
           <label className="block text-xs font-bold text-gray-500 uppercase">Image URL</label>
           <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full p-3 border rounded-lg" placeholder="https://..." />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase">Content</label>
          <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full p-3 border rounded-lg h-40" required />
        </div>

        <div className="flex items-center gap-2">
           <input type="checkbox" checked={isBreaking} onChange={e => setIsBreaking(e.target.checked)} id="breaking" />
           <label htmlFor="breaking" className="font-bold text-red-600">Mark as BREAKING NEWS</label>
        </div>

        <button disabled={loading} className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800">
          {loading ? 'Publishing...' : 'Publish Article'}
        </button>
      </form>
    </div>
  );
};

export default AdminPanel;
