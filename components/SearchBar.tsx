import React, { useState } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("માફ કરશો, તમારા બ્રાઉઝરમાં વોઇસ સર્ચ સપોર્ટ નથી. કૃપા કરીને Chrome ઉપયોગ કરો.");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'gu-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    setIsListening(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      const cleanTranscript = transcript.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
      onChange(cleanTranscript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  return (
    <div className="relative">
      <div className={`
        relative flex items-center bg-white rounded-xl border transition-all duration-300
        ${isListening 
          ? 'border-red-400 ring-4 ring-red-50 shadow-lg' 
          : 'border-gray-200 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-50 focus-within:shadow-lg'
        }
      `}>
        {/* Search Icon */}
        <div className="pl-4 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>

        {/* Input Field */}
        <input
          type="text"
          className="w-full py-4 px-3 text-base text-gray-900 placeholder-gray-400 bg-transparent focus:outline-none"
          placeholder={isListening ? "સાંભળી રહ્યું છે... બોલો..." : "નામ અથવા નંબર..."}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        
        {/* Actions (Clear / Mic) */}
        <div className="pr-2 flex items-center gap-1">
          {value && (
            <button 
              onClick={() => onChange('')}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          )}

          <button 
            onClick={startListening}
            className={`p-2.5 rounded-full transition-all duration-200 ${
              isListening 
                ? 'bg-red-500 text-white animate-pulse shadow-md' 
                : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
            }`}
            title="Speak to Search"
          >
            {isListening ? (
              <div className="w-5 h-5 flex items-center justify-center space-x-0.5">
                 <div className="w-1 h-2 bg-white rounded-full animate-bounce"></div>
                 <div className="w-1 h-3 bg-white rounded-full animate-bounce delay-75"></div>
                 <div className="w-1 h-2 bg-white rounded-full animate-bounce delay-150"></div>
              </div>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;