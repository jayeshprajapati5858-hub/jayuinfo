import React, { useState } from 'react';

const SchemeInfo: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'certs' | 'schemes'>('certs');

  const certificates = [
    {
      title: "આવકનો દાખલો (Income Certificate)",
      icon: "💰",
      docs: [
        "અરજદારનો આધાર કાર્ડ / ચૂંટણી કાર્ડ",
        "રેશન કાર્ડની નકલ",
        "છેલ્લું લાઈટ બિલ / વેરા પહોંચ",
        "તલાટીશ્રીનો આવકનો રિપોર્ટ",
        "પાસપોર્ટ સાઈઝ ફોટો - ૧"
      ]
    },
    {
      title: "જાતિનો દાખલો (Caste Certificate)",
      icon: "📝",
      docs: [
        "શાળા છોડ્યાનું પ્રમાણપત્ર (L.C.)",
        "પિતા/કાકા/ભાઈનું જાતિનું પ્રમાણપત્ર",
        "રહેઠાણનો પુરાવો (લાઈટ બિલ/રેશન કાર્ડ)",
        "આધાર કાર્ડ",
        "પેઢીનામું (જો જરૂરી હોય તો)"
      ]
    },
    {
      title: "નોન-ક્રિમીલેયર (Non-Creamy Layer)",
      icon: "📜",
      docs: [
        "જૂનો નોન-ક્રિમીલેયર દાખલો (જો હોય તો)",
        "આવકનો દાખલો (ચાલુ વર્ષનો)",
        "જાતિનો દાખલો",
        "રેશન કાર્ડ અને આધાર કાર્ડ",
        "L.C. (શાળા છોડ્યાનું પ્રમાણપત્ર)"
      ]
    },
    {
      title: "વિધવા સહાય (Widow Pension)",
      icon: "👵",
      docs: [
        "પતિના મરણનો દાખલો",
        "અરજદારનું આધાર કાર્ડ અને રેશન કાર્ડ",
        "બેંક પાસબુકની નકલ",
        "આવકનો દાખલો (મામલતદારશ્રીનો)",
        "ઉંમરનો પુરાવો (L.C. અથવા જન્મનો દાખલો)"
      ]
    },
    {
      title: "આયુષ્માન કાર્ડ (Ayushman Card)",
      icon: "🏥",
      docs: [
        "પીળું અથવા અંત્યોદય રેશન કાર્ડ",
        "આધાર કાર્ડ (દરેક સભ્યોના)",
        "આવકનો દાખલો (પીએમ જય યોજના માટે)",
        "મોબાઈલ નંબર (આધાર લિંક)"
      ]
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-8 animate-fade-in pb-20">
      
      <div className="flex items-center gap-2 mb-6">
         <span className="h-8 w-1.5 bg-purple-600 rounded-full"></span>
         <div>
            <h2 className="text-xl font-bold text-gray-800">યોજના અને દસ્તાવેજ</h2>
            <p className="text-xs text-gray-500">દાખલા કઢાવવા માટે જરૂરી પુરાવાની યાદી</p>
         </div>
      </div>

      <div className="grid gap-4">
        {certificates.map((item, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
             <div className="bg-gray-50 p-4 border-b border-gray-100 flex items-center gap-3">
                <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-sm border border-gray-100">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
             </div>
             <div className="p-5">
                <p className="text-xs font-bold text-gray-400 uppercase mb-3">જરૂરી પુરાવાઓ:</p>
                <ul className="space-y-2">
                   {item.docs.map((doc, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                         <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                         {doc}
                      </li>
                   ))}
                </ul>
             </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-purple-50 p-4 rounded-xl border border-purple-100 text-center">
         <p className="text-sm text-purple-800 font-medium">
            વધુ માહિતી માટે અથવા ફોર્મ ભરવા માટે ગ્રામ પંચાયત VCE ઓપરેટરનો સંપર્ક કરવો.
         </p>
      </div>

    </div>
  );
};

export default SchemeInfo;