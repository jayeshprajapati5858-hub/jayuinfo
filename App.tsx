import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import HomeView from './components/HomeView';
import ServiceView from './components/ServiceView';

// Minimal Footer
const Footer = () => (
  <footer className="bg-white border-t border-gray-100 text-gray-400 py-8 mt-auto">
     <div className="max-w-7xl mx-auto px-4 text-center">
        <h3 className="text-lg font-black text-gray-300 mb-2">JAYU INFO</h3>
        <p className="text-xs">© 2024 Digital Village Portal. All Rights Reserved.</p>
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
          <Route path="/service/:type" element={<ServiceView />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;