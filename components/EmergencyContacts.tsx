import React from 'react';

const EmergencyContacts: React.FC = () => {
  const contacts = [
    { name: "એમ્બ્યુલન્સ", sub: "(Ambulance)", number: "108", color: "bg-red-500", icon: "M19 14l-7 7m0 0l-7-7m7 7V3" },
    { name: "પોલીસ", sub: "(Police)", number: "100", color: "bg-blue-700", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
    { name: "પશુ હેલ્પલાઇન", sub: "(Animal)", number: "1962", color: "bg-green-600", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
    { name: "વીજળી ફરિયાદ", sub: "(PGVCL)", number: "1800233155335", displayNum: "1800 233 1553", color: "bg-yellow-600", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
    { name: "આપત્તિ સહાય", sub: "(Disaster)", number: "1077", color: "bg-gray-600", icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" },
    { name: "ચાઈલ્ડ લાઈન", sub: "(Kids)", number: "1098", color: "bg-purple-500", icon: "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="h-8 w-1.5 bg-red-500 rounded-full"></span>
        <h3 className="text-xl font-bold text-gray-800">ઈમરજન્સી નંબર્સ (Emergency Contacts)</h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {contacts.map((contact, idx) => (
          <a key={idx} href={`tel:${contact.number}`} className="bg-white border border-gray-100 shadow-sm rounded-xl p-3 flex flex-col items-center text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
            <div className={`w-10 h-10 rounded-full ${contact.color} text-white flex items-center justify-center mb-2 shadow-md group-hover:scale-110 transition-transform`}>
               {contact.name === "એમ્બ્યુલન્સ" ? (
                   <span className="font-bold text-xs">108</span>
               ) : (
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={contact.icon}></path></svg>
               )}
            </div>
            <span className="text-xs font-bold text-gray-700">{contact.name}</span>
            <span className="text-sm font-black text-gray-900 bg-gray-50 px-2 rounded w-full">{contact.displayNum || contact.number}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default EmergencyContacts;