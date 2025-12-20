import React from 'react';

const StudentCorner: React.FC = () => {
  const toppers = [
    { std: "૧૦ (SSC)", year: "2023", name: "પટેલ રિયાબેન રાજેશભાઈ", pr: "92.50%", rank: "1st in Village", img: "https://ui-avatars.com/api/?name=Riya+Patel&background=fce7f3&color=db2777" },
    { std: "૧૦ (SSC)", year: "2023", name: "ઠાકોર અજય વિરમજી", pr: "89.00%", rank: "2nd in Village", img: "https://ui-avatars.com/api/?name=Ajay+Thakor&background=e0f2fe&color=0284c7" },
    { std: "૧૨ (HSC)", year: "2023", name: "શાહ મિહિર સંજયભાઈ", pr: "94.00%", rank: "Science Topper", img: "https://ui-avatars.com/api/?name=Mihir+Shah&background=dcfce7&color=16a34a" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-8 animate-fade-in pb-20">
      
      <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">વિદ્યાર્થી કોર્નર 🎓</h2>
          <p className="text-gray-500 text-sm">ગામનું ગૌરવ વધારનાર તેજસ્વી તારલાઓ</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {toppers.map((student, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex flex-col items-center text-center relative overflow-hidden group hover:-translate-y-1 transition-all">
                  <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-xl z-10">
                      🏆 {student.rank}
                  </div>
                  
                  <div className="w-24 h-24 rounded-full p-1 border-2 border-dashed border-indigo-200 mb-4 group-hover:border-indigo-500 transition-colors">
                      <img src={student.img} alt={student.name} className="w-full h-full rounded-full object-cover" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">{student.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">ધોરણ: {student.std} | વર્ષ: {student.year}</p>
                  
                  <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-2xl font-black tracking-tighter">
                      {student.pr}
                  </div>
              </div>
          ))}
      </div>

      <div className="mt-8 bg-blue-50 p-6 rounded-2xl text-center border border-blue-100">
          <h3 className="font-bold text-blue-900 mb-2">તમારું પરિણામ મોકલો</h3>
          <p className="text-sm text-blue-700 mb-4">જો તમે અથવા તમારા બાળકએ બોર્ડની પરીક્ષામાં સારું પરિણામ મેળવ્યું હોય તો ફોટો અને માર્કશીટ વોટ્સએપ કરો.</p>
          <a href="https://wa.me/919988776655" className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-green-200 hover:bg-green-600 transition-all">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.506-.669-.514-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.084 1.758-.717 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
              વોટ્સએપ કરો
          </a>
      </div>

    </div>
  );
};

export default StudentCorner;