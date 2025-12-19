import React, { useState } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Voice search is not supported in this browser. Please use Chrome.");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'gu-IN'; // Default to Gujarati
    recognition.continuous = false;
    recognition.interimResults = false;

    setIsListening(true);

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      // Remove trailing punctuation which voice input sometimes adds
      const cleanTranscript = transcript.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
      onChange(cleanTranscript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 mb-8 z-10 relative">
      <div className={`bg-white rounded-lg shadow-xl flex items-center p-2 border transition-colors duration-300 ${isListening ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-gray-100'}`}>
        <div className="pl-4 pr-2 text-gray-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <input
          type="text"
          className="w-full py-3 px-2 text-lg text-gray-700 placeholder-gray-400 focus:outline-none"
          placeholder={isListening ? "Listening... (બોલો...)" : "Search by Name, App No, or Account No..."}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        
        {/* Voice Search Button */}
        <button 
          onClick={startListening}
          className={`p-3 mr-2 rounded-full transition-all duration-300 ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-gray-400 hover:bg-emerald-50 hover:text-emerald-600'}`}
          title="Search by Voice"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
          </svg>
        </button>

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
        માઈક પર ક્લિક કરો અને નામ બોલો (Click Mic to Speak)
      </p>
    </div>
  );
};

export default SearchBar;