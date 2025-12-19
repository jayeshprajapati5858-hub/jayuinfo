import React from 'react';

const ImportantLinks: React.FC = () => {
  const links = [
    {
      title: "7/12 અને 8-અ",
      subtitle: "જમીન રેકોર્ડ (AnyROR)",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-.553-.894L15 7m0 13V7" />
        </svg>
      ),
      url: "https://anyror.gujarat.gov.in/",
      color: "bg-green-50 border-green-200 hover:bg-green-100"
    },
    {
      title: "i-ખેડૂત પોર્ટલ",
      subtitle: "સબસીડી અને યોજનાઓ",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      url: "https://ikhedut.gujarat.gov.in/",
      color: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100"
    },
    {
      title: "રેશન કાર્ડ",
      subtitle: "અન્ન વિતરણ (IPDS)",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      url: "https://ipds.gujarat.gov.in/",
      color: "bg-orange-50 border-orange-200 hover:bg-orange-100"
    },
    {
      title: "ઈ-નિર્માણ કાર્ડ",
      subtitle: "મજદૂરી / બાંધકામ",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      url: "https://enirman.gujarat.gov.in/",
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100"
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-8">
      <div className="flex items-center gap-2 mb-6">
        <span className="h-8 w-1.5 bg-emerald-500 rounded-full"></span>
        <h3 className="text-xl font-bold text-gray-800">કિસાન સુવિધા અને ઉપયોગી લિંક્સ (Quick Links)</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {links.map((link, index) => (
          <a 
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${link.color} border rounded-xl p-6 flex flex-col items-center text-center transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg group`}
          >
            <div className="p-4 bg-white rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform ring-4 ring-white/50">
              {link.icon}
            </div>
            <h4 className="font-bold text-gray-800 text-lg">{link.title}</h4>
            <p className="text-sm text-gray-500 mt-1 mb-4">{link.subtitle}</p>
            
            <div className="mt-auto flex items-center text-xs text-gray-500 font-bold uppercase tracking-wider group-hover:text-gray-800 bg-white/60 px-3 py-1 rounded-full">
              Visit Portal
              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ImportantLinks;