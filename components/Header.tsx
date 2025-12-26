
import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 left-0 right-0 bg-black/80 backdrop-blur-md border-b border-gray-900 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
             <div className="bg-gray-900 text-white p-2 rounded border border-gray-800">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
             </div>
             <h1 className="text-xl font-black text-white tracking-tight">NEW<span className="text-gray-600">PROJECT</span></h1>
          </Link>

          <div className="flex items-center gap-4">
             <span className="text-xs font-mono text-green-500">● System Ready</span>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
