import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClick?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onClick }) => {
  return (
    <div className="w-full max-w-3xl mx-auto -mt-6 px-4 mb-8 z-10 relative">
      <div className="bg-white rounded-lg shadow-xl flex items-center p-2 border border-gray-100">
        <div className="pl-4 pr-2 text-gray-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <input
          type="text"
          className="w-full py-3 px-2 text-lg text-gray-700 placeholder-gray-400 focus:outline-none"
          placeholder="Search by Name, Application No, or Account No..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onClick={onClick}
        />
        {value && (
          <button 
            onClick={() => onChange('')}
            className="p-2 mr-2 text-gray-300 hover:text-red-500 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        )}
      </div>
      <p className="mt-2 text-center text-xs text-gray-500">
        તમારું નામ, અરજી નંબર અથવા ખાતા નંબર લખો (Type your Name, Application No. or Account No.)
      </p>
    </div>
  );
};

export default SearchBar;