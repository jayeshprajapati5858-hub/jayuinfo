
import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import HomeView from './components/HomeView';

// Minimal Footer
const Footer = () => (
  <footer className="bg-black border-t border-gray-900 text-gray-500 py-6 mt-auto">
     <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-xs">© 2024 New Project. Database Cleaned.</p>
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
    <div className="min-h-screen flex flex-col font-['Inter'] bg-black text-gray-200">
      <ScrollToTop />
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomeView />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
