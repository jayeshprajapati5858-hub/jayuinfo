import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="relative max-w-2xl mx-auto -mt-6 px-4">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
        <div className="relative bg-white rounded-lg shadow-xl flex items-center p-2 border border-gray-100">
          <svg className="w-6 h-6 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input
            type="text"
            className="w-full p-3 text-lg text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent"
            placeholder="Search by Name, Application No, or Account No..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          {value && (
            <button 
              onClick={() => onChange('')}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          )}
        </div>
      </div>
      <p className="mt-2 text-center text-sm text-gray-500">
        તમારું નામ, અરજી નંબર અથવા ખાતા નંબર લખો (Type your Name, Application No. or Account No.)
      </p>
    </div>
  );
};

export default SearchBar;