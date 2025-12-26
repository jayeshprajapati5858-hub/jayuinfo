
import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import Header from './components/Header';
import HomeView from './components/HomeView';
import ArticleView from './components/ArticleView';
import AdminPanel from './components/AdminPanel';

// Simple Footer Component
const Footer = () => (
  <footer className="bg-gray-900 text-white py-10 mt-auto">
     <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8">
        <div>
           <h3 className="font-black text-2xl mb-4">THE GUJARAT<span className="text-red-600">NEWS</span></h3>
           <p className="text-gray-400 text-sm leading-relaxed">ગુજરાતનું સૌથી વિશ્વસનીય ડિજિટલ ન્યૂઝ પ્લેટફોર્મ. અમે લાવીએ છીએ સત્ય, સચોટ અને નિષ્પક્ષ સમાચાર.</p>
        </div>
        <div>
           <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-gray-500">Categories</h4>
           <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
              <a href="/category/gujarat" className="hover:text-white">ગુજરાત</a>
              <a href="/category/politics" className="hover:text-white">રાજકારણ</a>
              <a href="/category/sports" className="hover:text-white">રમત-ગમત</a>
              <a href="/category/entertainment" className="hover:text-white">મનોરંજન</a>
           </div>
        </div>
        <div>
           <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-gray-500">Contact</h4>
           <p className="text-gray-400 text-sm">Email: contact@gujaratnews.com</p>
           <p className="text-gray-400 text-sm">Phone: +91 98765 43210</p>
           <div className="mt-4 flex gap-4">
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors">X</div>
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors">f</div>
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors">in</div>
           </div>
        </div>
     </div>
     <div className="text-center text-gray-600 text-xs mt-10 border-t border-gray-800 pt-6 flex items-center justify-center gap-4">
        <span>© 2024 The Gujarat News. All rights reserved.</span>
        <Link to="/admin" className="text-gray-700 hover:text-gray-500 transition-colors">Admin Login</Link>
     </div>
  </footer>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col font-['Noto_Sans_Gujarati'] bg-gray-50 text-gray-900">
      <ScrollToTop />
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/news/:id" element={<ArticleView />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/category/:cat" element={<div className="p-20 text-center font-bold text-gray-400">સમાચાર આવી રહ્યા છે...</div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
