
import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import Header from './components/Header';
import HomeView from './components/HomeView';
import CategoryView from './components/CategoryView';
import AdminPanel from './components/AdminPanel';
import ServiceView from './components/ServiceView';
import { AboutUs, ContactUs, PrivacyPolicy, TermsConditions } from './components/LegalPages';

// AdSense Optimized Footer
const Footer = () => (
  <footer className="bg-gray-900 text-white py-12 mt-auto">
     <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
           <h3 className="font-black text-xl mb-4">HYPER-LOCAL<span className="text-red-600">NEWS</span></h3>
           <p className="text-gray-400 text-xs leading-relaxed">
             ગ્રામીણ ભારતનું પોતાનું ડિજિટલ પ્લેટફોર્મ. લોકલ સમાચાર, સરકારી યોજના અને રોજગાર માહિતી.
           </p>
        </div>
        
        <div>
           <h4 className="font-bold mb-4 uppercase text-[10px] tracking-widest text-gray-500">Services</h4>
           <div className="flex flex-col gap-2 text-xs text-gray-300">
              <Link to="/service/news" className="hover:text-white">Local News</Link>
              <Link to="/service/water" className="hover:text-white">Water Supply</Link>
              <Link to="/service/rojgar" className="hover:text-white">Jobs (Rojgar)</Link>
           </div>
        </div>

        <div>
           <h4 className="font-bold mb-4 uppercase text-[10px] tracking-widest text-gray-500">Legal (AdSense)</h4>
           <div className="flex flex-col gap-2 text-xs text-gray-300">
              <Link to="/about-us" className="hover:text-white">About Us</Link>
              <Link to="/contact-us" className="hover:text-white">Contact Us</Link>
              <Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
              <Link to="/terms-conditions" className="hover:text-white">Terms & Conditions</Link>
           </div>
        </div>

        <div>
           <h4 className="font-bold mb-4 uppercase text-[10px] tracking-widest text-gray-500">Contact</h4>
           <p className="text-gray-400 text-xs">Email: news@hyperlocal.com</p>
           <div className="mt-4 flex gap-4">
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">T</div>
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-800 transition-colors">F</div>
           </div>
        </div>
     </div>
     <div className="text-center text-gray-600 text-[10px] mt-12 border-t border-gray-800 pt-6">
        <span>© 2024 Hyper-Local News Portal. All rights reserved.</span>
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
          <Route path="/category/:cat" element={<CategoryView />} />
          <Route path="/service/:type" element={<ServiceView />} />
          
          {/* Legal Pages Routes */}
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
