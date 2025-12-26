
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const date = new Date().toLocaleDateString('gu-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  // API Compatible Categories
  const navLinks = [
    { path: '/', label: 'મુખ્ય સમાચાર' },
    { path: '/category/world', label: 'વિદેશ' },
    { path: '/category/nation', label: 'દેશ' },
    { path: '/category/business', label: 'વ્યાપાર' },
    { path: '/category/technology', label: 'ટેકનોલોજી' },
    { path: '/category/entertainment', label: 'મનોરંજન' },
    { path: '/category/sports', label: 'રમત-ગમત' },
    { path: '/category/health', label: 'આરોગ્ય' },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gray-900 text-gray-400 text-[10px] py-1.5 px-4 flex justify-between items-center border-b border-gray-800">
         <span>{date}</span>
         <div className="flex gap-4 items-center">
            <span className="text-red-500 font-bold animate-pulse">● LIVE NEWS</span>
         </div>
      </div>

      <header className="sticky top-0 left-0 right-0 bg-white border-b-4 border-red-600 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
               <div className="bg-red-600 text-white p-2 rounded-lg transform group-hover:rotate-3 transition-transform duration-300">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
               </div>
               <div className="flex flex-col">
                 <h1 className="text-2xl font-black text-gray-900 leading-none tracking-tight">GUJARAT<span className="text-red-600">NEWS</span></h1>
                 <p className="text-[9px] font-bold text-gray-400 tracking-[0.2em] uppercase">Powered by GNews</p>
               </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex gap-6 overflow-x-auto no-scrollbar">
              {navLinks.map(link => (
                <Link 
                  key={link.path} 
                  to={link.path}
                  className={`text-sm font-bold uppercase tracking-wide transition-colors whitespace-nowrap ${location.pathname === link.path ? 'text-red-600' : 'text-gray-700 hover:text-red-600'}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-gray-700">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}/></svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 absolute w-full left-0 shadow-xl animate-fade-in z-50">
            <div className="grid grid-cols-2 p-4 gap-2">
              {navLinks.map(link => (
                <Link 
                  key={link.path} 
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-sm font-bold p-3 rounded-lg text-center ${location.pathname === link.path ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-800'}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
