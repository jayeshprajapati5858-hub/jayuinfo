
import React from 'react';

export const AboutUs: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 my-6 animate-fade-in">
      <h1 className="text-3xl font-black mb-6 text-gray-900 border-l-8 border-emerald-500 pl-4">About Us (અમારા વિશે)</h1>
      <div className="space-y-6 text-base text-gray-700 leading-relaxed">
        <p><strong>Krushi Sahay & Digital Gram Panchayat Portal</strong> એ ભરાડા ગામના લોકો માટે બનાવવામાં આવેલું એક સ્વતંત્ર માહિતી પોર્ટલ છે.</p>
        <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
           <h3 className="font-bold text-emerald-800 mb-2">અમારો હેતુ:</h3>
           <p className="text-emerald-700">ગામડાના લોકોને સરકારી યોજનાઓ, કૃષિ સહાય અને ગ્રામ્ય સેવાઓની માહિતી આંગળીના ટેરવે મળી રહે તે અમારો મુખ્ય ઉદ્દેશ્ય છે. અમે ટેકનોલોજીના માધ્યમથી ગામને 'ડિજિટલ ભરાડા' બનાવવાની દિશામાં કામ કરી રહ્યા છીએ.</p>
        </div>
        <p>આ પોર્ટલ <strong>શ્રી જયેશભાઈ પ્રજાપતિ</strong> દ્વારા વિકસાવવામાં આવ્યું છે. અહીં અમે રોજેરોજ સરકારી ઠરાવો (GR), ખેતીવાડીના સમાચાર, બજાર ભાવ અને નોકરીની તકો વિશે માહિતી અપડેટ કરીએ છીએ.</p>
        <p className="font-bold italic">નોંધ: આ એક બિન-સત્તાવાર પોર્ટલ છે જે માત્ર સામાજિક સેવાની ભાવનાથી ચલાવવામાં આવે છે.</p>
      </div>
    </div>
  );
};

export const ContactUs: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 my-6 animate-fade-in">
      <h1 className="text-3xl font-black mb-6 text-gray-900 border-l-8 border-indigo-500 pl-4">Contact Us (સંપર્ક)</h1>
      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-6">
           <p className="text-gray-600">તમારી પાસે કોઈ પ્રશ્ન હોય અથવા તમે તમારી જાહેરાત અહીં મૂકવા માંગતા હોવ તો નીચેની વિગત પર સંપર્ક કરી શકો છો.</p>
           <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                 <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">📍</div>
                 <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase">સરનામું</p>
                    <p className="font-bold text-sm">મુ. ભરાડા, તા. ધ્રાંગધ્રા, જી. સુરેન્દ્રનગર</p>
                 </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                 <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">📧</div>
                 <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase">Email</p>
                    <p className="font-bold text-sm">bharadapanchayat@gmail.com</p>
                 </div>
              </div>
           </div>
        </div>
        <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
           <h3 className="font-black mb-4">Direct Message</h3>
           <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); alert('Message Sent!'); }}>
              <input type="text" placeholder="તમારું નામ" className="w-full p-3 bg-white rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-100" />
              <textarea placeholder="તમારી વાત..." className="w-full p-3 bg-white rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-100" rows={3}></textarea>
              <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-black">સંદેશ મોકલો</button>
           </form>
        </div>
      </div>
    </div>
  );
};

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 my-6 animate-fade-in">
      <h1 className="text-3xl font-black mb-6 text-gray-900 border-l-8 border-gray-800 pl-4">Privacy Policy</h1>
      <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
        <p><strong>Last Updated:</strong> {new Date().toLocaleDateString('gu-IN')}</p>
        <h3 className="font-black text-lg text-gray-900">1. Information Collection</h3>
        <p>અમે વપરાશકર્તાઓ પાસેથી કોઈ અજાણ્યા ડેટાનો સંગ્રહ કરતા નથી. જો તમે સ્વેચ્છાએ ફરિયાદ અથવા જાહેરાત આપો છો, તો જ તમારું નામ અને નંબર અમારી પાસે સેવ થાય છે.</p>
        <h3 className="font-black text-lg text-gray-900">2. Cookies and Ads</h3>
        <p>અમારી સાઇટ Google AdSense ની જાહેરાતો પ્રદર્શિત કરવા માટે કૂકીઝનો ઉપયોગ કરી શકે છે. Google કૂકીઝનો ઉપયોગ યુઝરની અગાઉની મુલાકાતોને આધારે જાહેરાતો બતાવવા માટે કરે છે.</p>
        <h3 className="font-black text-lg text-gray-900">3. Third Party Links</h3>
        <p>અમારી વેબસાઈટ પર સરકારી પોર્ટલની લિંક્સ હોય છે. તે વેબસાઈટની નીતિઓ અલગ હોઈ શકે છે જેની અમે ખાતરી આપતા નથી.</p>
      </div>
    </div>
  );
};

export const TermsConditions: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 my-6 animate-fade-in">
      <h1 className="text-3xl font-black mb-6 text-gray-900 border-l-8 border-gray-800 pl-4">Terms & Conditions</h1>
      <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
        <p>૧. આ પોર્ટલ પર આપેલી માહિતી માત્ર સામાન્ય જાણકારી માટે છે.</p>
        <p>૨. કોઈપણ આર્થિક વ્યવહાર કરતા પહેલા સામેવાળી વ્યક્તિ કે સંસ્થાની ખાતરી કરી લેવી. અમે કોઈ છેતરપિંડી માટે જવાબદાર નથી.</p>
        <p>૩. ખોટી માહિતી અથવા અફવાઓ ફેલાવતા યુઝરને બ્લોક કરવામાં આવશે.</p>
      </div>
    </div>
  );
};
