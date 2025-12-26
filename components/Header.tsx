
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const date = new Date().toLocaleDateString('gu-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const navLinks = [
    { path: '/', label: 'હોમ' },
    { path: '/category/gujarat', label: 'ગુજરાત' },
    { path: '/category/politics', label: 'રાજકારણ' },
    { path: '/category/sports', label: 'રમત-ગમત' },
    { path: '/category/entertainment', label: 'મનોરંજન' },
    { path: '/category/technology', label: 'ટેકનોલોજી' },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gray-900 text-gray-400 text-[10px] py-1.5 px-4 flex justify-between items-center border-b border-gray-800">
         <span>{date}</span>
         <div className="flex gap-4 items-center">
            <Link to="/admin" className="hover:text-white font-bold text-red-500 transition-colors flex items-center gap-1">
               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
               Admin Login
            </Link>
            <div className="w-[1px] h-3 bg-gray-700"></div>
            <div className="flex gap-3">
                <span className="hover:text-white cursor-pointer transition-colors">Twitter</span>
                <span className="hover:text-white cursor-pointer transition-colors">Facebook</span>
            </div>
         </div>
      </div>

      <header className="sticky top-0 left-0 right-0 bg-white border-b-4 border-red-600 z-50 shadow-md">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
               <div className="bg-red-600 text-white p-2 rounded-lg transform group-hover:rotate-3 transition-transform duration-300">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
               </div>
               <div className="flex flex-col">
                 <h1 className="text-2xl font-black text-gray-900 leading-none tracking-tight">THE GUJARAT<span className="text-red-600">NEWS</span></h1>
                 <p className="text-[9px] font-bold text-gray-400 tracking-[0.2em] uppercase">સત્ય અને સચોટ</p>
               </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex gap-6">
              {navLinks.map(link => (
                <Link 
                  key={link.path} 
                  to={link.path}
                  className={`text-sm font-bold uppercase tracking-wide transition-colors ${location.pathname === link.path ? 'text-red-600' : 'text-gray-700 hover:text-red-600'}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-gray-700">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}/></svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 shadow-xl animate-fade-in">
            <div className="flex flex-col p-4 space-y-3">
              {navLinks.map(link => (
                <Link 
                  key={link.path} 
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-base font-bold p-2 rounded-lg ${location.pathname === link.path ? 'bg-red-50 text-red-600' : 'text-gray-800'}`}
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold text-red-500 pt-4 border-t flex items-center gap-2">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                 Admin Login
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
