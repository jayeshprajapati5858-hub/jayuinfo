import React from 'react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 bg-white rounded-xl shadow-sm border border-gray-200 my-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-4 border-b pb-2">Privacy Policy (ગોપનીયતા નીતિ)</h1>
      <div className="space-y-4 text-sm text-gray-700">
        <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
        <p>ભરાડા ગ્રામ પંચાયત પોર્ટલ ("અમે", "અમારું") પર આપનું સ્વાગત છે. અમે તમારી ગોપનીયતાનો આદર કરીએ છીએ.</p>
        
        <h3 className="font-bold text-lg mt-4">1. માહિતીનો સંગ્રહ</h3>
        <p>અમે વપરાશકર્તાઓ પાસેથી વ્યક્તિગત ઓળખ માહિતી (જેમ કે નામ, ફોન નંબર) ત્યારે જ એકત્રિત કરીએ છીએ જ્યારે તેઓ સ્વૈચ્છિક રીતે અમને તે આપે છે (જેમ કે ફરિયાદ ફોર્મ અથવા બિઝનેસ ડિરેક્ટરીમાં).</p>

        <h3 className="font-bold text-lg mt-4">2. કુકીઝ (Cookies)</h3>
        <p>અમારી વેબસાઇટ વપરાશકર્તાના અનુભવને સુધારવા માટે "કુકીઝ" નો ઉપયોગ કરી શકે છે. Google AdSense જેવી તૃતીય-પક્ષ સેવાઓ જાહેરાતો બતાવવા માટે કુકીઝનો ઉપયોગ કરી શકે છે.</p>

        <h3 className="font-bold text-lg mt-4">3. જાહેરાતો (Ads)</h3>
        <p>અમે અમારી સાઈટ પર જાહેરાતો બતાવવા માટે Google AdSense જેવી તૃતીય-પક્ષ જાહેરાત કંપનીઓનો ઉપયોગ કરી શકીએ છીએ. આ કંપનીઓ તમારી મુલાકાતો વિશેની માહિતીનો ઉપયોગ કરી શકે છે.</p>

        <h3 className="font-bold text-lg mt-4">4. સંપર્ક</h3>
        <p>જો તમને આ ગોપનીયતા નીતિ વિશે કોઈ પ્રશ્નો હોય, તો તમે અમારો સંપર્ક કરી શકો છો: bharadagrampanchayat@gmail.com</p>
      </div>
    </div>
  );
};

export const TermsConditions: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 bg-white rounded-xl shadow-sm border border-gray-200 my-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-4 border-b pb-2">Terms & Conditions (નિયમો અને શરતો)</h1>
      <div className="space-y-4 text-sm text-gray-700">
        <p>આ વેબસાઇટનો ઉપયોગ કરીને, તમે નીચેના નિયમો અને શરતો સાથે સંમત થાઓ છો:</p>
        
        <h3 className="font-bold text-lg mt-4">1. ડિસ્ક્લેમર (Disclaimer)</h3>
        <p className="bg-yellow-50 p-2 border border-yellow-200 rounded text-yellow-800">
          <strong>મહત્વપૂર્ણ:</strong> આ વેબસાઇટ કોઈ સરકારી સંસ્થા નથી. અહીં આપેલી માહિતી માત્ર સામાન્ય જાણકારી માટે છે. સત્તાવાર માહિતી માટે કૃપા કરીને સંબંધિત સરકારી કચેરીનો સંપર્ક કરો.
        </p>

        <h3 className="font-bold text-lg mt-4">2. સામગ્રીનો ઉપયોગ</h3>
        <p>આ વેબસાઇટ પરની સામગ્રી (જેમ કે ડેટા, ફોટા) નો ઉપયોગ તમે માત્ર અંગત માહિતી માટે કરી શકો છો. તેનો વ્યાપારી ઉપયોગ પ્રતિબંધિત છે.</p>

        <h3 className="font-bold text-lg mt-4">3. ફેરફારો</h3>
        <p>અમે કોઈપણ સમયે આ શરતોમાં ફેરફાર કરવાનો અધિકાર અનામત રાખીએ છીએ.</p>
      </div>
    </div>
  );
};