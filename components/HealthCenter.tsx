import React from 'react';

const HealthCenter: React.FC = () => {
  const staff = [
    { name: "ડૉ. અજયભાઈ મેહતા", role: "M.B.B.S. (Medical Officer)", phone: "+919876543210", status: "Available" },
    { name: "શ્રીમતી હંસાબેન પરમાર", role: "F.H.W. (NURSE)", phone: "+919876543211", status: "On Duty" },
    { name: "રમેશભાઈ સોલંકી", role: "M.P.H.W. (Health Worker)", phone: "+919876543212", status: "Field Work" },
  ];

  const schedule = [
    { day: "સોમવાર", activity: "સામાન્ય OPD / તપાસ", time: "09:00 - 01:00" },
    { day: "બુધવાર", activity: "મમતા દિવસ (રસીકરણ)", time: "09:00 - 12:00" },
    { day: "શુક્રવાર", activity: "સગર્ભા બહેનોની તપાસ", time: "10:00 - 01:00" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-8 animate-fade-in pb-20">
      
      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-teal-100 overflow-hidden mb-6 relative">
        <div className="bg-teal-600 p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                પેટા આરોગ્ય કેન્દ્ર, ભરાડા
            </h2>
            <span className="bg-green-400 text-teal-900 text-xs font-bold px-2 py-1 rounded-full animate-pulse">OPEN</span>
        </div>
        <div className="p-4">
            <p className="text-gray-600 text-sm mb-2">
                <strong>સરનામું:</strong> ગ્રામ પંચાયતની બાજુમાં, ભરાડા.
            </p>
            <div className="flex gap-2">
                <a href="tel:108" className="flex-1 bg-red-500 text-white text-center py-2 rounded-lg font-bold shadow-md hover:bg-red-600 transition-colors">
                    🚑 108 એમ્બ્યુલન્સ
                </a>
                <a href="tel:104" className="flex-1 bg-teal-500 text-white text-center py-2 rounded-lg font-bold shadow-md hover:bg-teal-600 transition-colors">
                    📞 104 હેલ્પલાઇન
                </a>
            </div>
        </div>
      </div>

      {/* Staff Section */}
      <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-teal-500 rounded-full"></span>
        સ્ટાફ વિગત (Medical Staff)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {staff.map((member, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 text-xl font-bold">
                    {member.name[0]}
                </div>
                <div className="flex-1">
                    <h4 className="font-bold text-gray-900">{member.name}</h4>
                    <p className="text-xs text-teal-600 font-semibold mb-1">{member.role}</p>
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{member.status}</span>
                        <a href={`tel:${member.phone}`} className="text-teal-600 hover:bg-teal-50 p-1.5 rounded-full">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                        </a>
                    </div>
                </div>
            </div>
        ))}
      </div>

      {/* Schedule Section */}
      <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-yellow-500 rounded-full"></span>
        સાપ્તાહિક કાર્યક્રમ (Schedule)
      </h3>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">વાર</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">પ્રવૃત્તિ</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">સમય</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {schedule.map((row, idx) => (
                    <tr key={idx} className={row.day === 'બુધવાર' ? 'bg-yellow-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{row.day}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                            {row.day === 'બુધવાર' && <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>}
                            {row.activity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.time}</td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

      <div className="mt-4 bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800">
        <p><strong>નોંધ:</strong> ઈમરજન્સી કેસમાં પ્રાથમિક સારવાર માટે જ સંપર્ક કરવો. વધુ સારવાર માટે ધ્રાંગધ્રા સરકારી હોસ્પિટલ રીફર કરવામાં આવશે.</p>
      </div>

    </div>
  );
};

export default HealthCenter;