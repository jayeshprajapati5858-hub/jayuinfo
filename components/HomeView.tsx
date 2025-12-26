
import React from 'react';

const HomeView: React.FC = () => {
  return (
    <div className="min-h-[80vh] bg-black text-white flex flex-col items-center justify-center p-4">
      
      <div className="max-w-xl w-full text-center space-y-8 animate-fade-in border border-gray-900 bg-gray-950 p-10 rounded-3xl shadow-2xl">
        
        <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
           <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>

        <div>
           <h1 className="text-4xl font-black tracking-tight mb-2">Website Cleaned</h1>
           <p className="text-gray-500">All old databases and tables have been deleted.</p>
        </div>

        <div className="bg-gray-900/50 p-4 rounded-xl text-left border border-gray-800">
           <p className="text-xs font-mono text-gray-400 mb-2">> Status Check:</p>
           <ul className="space-y-1 text-sm font-mono">
              <li className="text-green-400">✓ Old Tables Dropped</li>
              <li className="text-green-400">✓ Routes Cleared</li>
              <li className="text-green-400">✓ UI Reset to Black Theme</li>
              <li className="text-blue-400 animate-pulse">> Waiting for new code...</li>
           </ul>
        </div>

        <button className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors w-full">
           Start Building
        </button>

      </div>

    </div>
  );
};

export default HomeView;
