
import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import Header from './components/Header';
import HomeView from './components/HomeView';
import CategoryView from './components/CategoryView';
import AdminPanel from './components/AdminPanel';

// Simple Footer Component
const Footer = () => (
  <footer className="bg-gray-900 text-white py-12 mt-auto">
     <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-10">
        <div>
           <h3 className="font-black text-2xl mb-4">GUJARAT<span className="text-red-600">NEWS</span></h3>
           <p className="text-gray-400 text-sm leading-relaxed">ગુજરાત અને દેશ-દુનિયાના તાજા સમાચાર, રમત-ગમત, ટેકનોલોજી અને મનોરંજન હવે એક જ ક્લિક પર. Powered by GNews API.</p>
        </div>
        <div>
           <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-gray-500">Top Categories</h4>
           <div className="grid grid-cols-2 gap-3 text-sm text-gray-300">
              <a href="/category/world" className="hover:text-white transition-colors">World News</a>
              <a href="/category/nation" className="hover:text-white transition-colors">India News</a>
              <a href="/category/technology" className="hover:text-white transition-colors">Technology</a>
              <a href="/category/sports" className="hover:text-white transition-colors">Cricket & Sports</a>
           </div>
        </div>
        <div>
           <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-gray-500">Contact</h4>
           <p className="text-gray-400 text-sm">Email: news@gujarat.com</p>
           <div className="mt-4 flex gap-4">
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">T</div>
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-800 transition-colors">F</div>
           </div>
        </div>
     </div>
     <div className="text-center text-gray-600 text-xs mt-12 border-t border-gray-800 pt-6">
        <span>© 2024 Gujarat News. All rights reserved. Data provided by GNews.io</span>
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
          <Route path="/admin" element={<AdminPanel />} />
          {/* Dynamic Category Route */}
          <Route path="/category/:cat" element={<CategoryView />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
