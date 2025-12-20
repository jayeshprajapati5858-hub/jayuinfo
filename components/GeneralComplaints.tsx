import React, { useState } from 'react';

const GeneralComplaints: React.FC = () => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [type, setType] = useState('Street Light');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct email content
    const subject = `E-Complaint: ${type} - ${name}`;
    const body = `નમસ્કાર સરપંચશ્રી / તલાટીશ્રી,\n\nનીચે મુજબની ફરિયાદ મળેલ છે:\n\n1. અરજદારનું નામ: ${name}\n2. મોબાઈલ નંબર: ${mobile}\n3. સમસ્યાનો પ્રકાર: ${type}\n4. વિગતવાર વર્ણન: ${details}\n\nતારીખ: ${new Date().toLocaleDateString('gu-IN')}\n\n(આ મેઈલ ગ્રામ પંચાયત એપ દ્વારા મોકલવામાં આવ્યો છે.)`;

    // Open email client
    window.location.href = `mailto:bharadagrampanchayat@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setSubmitted(true);
    setTimeout(() => {
        setSubmitted(false);
        setName(''); setMobile(''); setDetails('');
    }, 3000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-8 animate-fade-in pb-20">
      
      <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200 mb-6">
         <h2 className="text-xl font-bold text-yellow-800 mb-2">ઈ-ફરિયાદ પેટી</h2>
         <p className="text-sm text-yellow-700">તમારા વિસ્તારની સમસ્યાઓ ગ્રામ પંચાયતને સીધી જણાવો.</p>
      </div>

      {submitted ? (
          <div className="bg-green-100 p-8 rounded-2xl text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-4">✓</div>
              <h3 className="text-xl font-bold text-green-800">ફરિયાદ ઈમેલ દ્વારા મોકલાઈ રહી છે!</h3>
              <p className="text-green-700 mt-2">તમારા ફોનમાં ઈમેલ એપ ખૂલશે, ત્યાં Send બટન દબાવો.</p>
          </div>
      ) : (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">સમસ્યાનો પ્રકાર</label>
                  <div className="grid grid-cols-2 gap-2">
                      {['Street Light', 'Gutter / Safai', 'Water', 'Road', 'Other'].map(t => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setType(t)}
                            className={`p-3 rounded-lg text-sm font-bold border ${type === t ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-200'}`}
                          >
                              {t === 'Street Light' && '💡 સ્ટ્રીટ લાઈટ'}
                              {t === 'Gutter / Safai' && '🧹 ગટર/સફાઈ'}
                              {t === 'Water' && '💧 પાણી'}
                              {t === 'Road' && '🚧 રસ્તા'}
                              {t === 'Other' && '❓ અન્ય'}
                          </button>
                      ))}
                  </div>
              </div>

              <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">વિગતવાર વર્ણન</label>
                  <textarea 
                    required
                    rows={4}
                    placeholder="દા.ત. વોર્ડ નં. ૨ માં થાંભલા નં. ૫ ની લાઈટ બંધ છે..."
                    value={details}
                    onChange={e => setDetails(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-50"
                  />
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">તમારું નામ</label>
                      <input 
                        type="text" required
                        value={name} onChange={e => setName(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-xl outline-none bg-gray-50"
                      />
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">મોબાઈલ</label>
                      <input 
                        type="tel" required
                        value={mobile} onChange={e => setMobile(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-xl outline-none bg-gray-50"
                      />
                  </div>
              </div>

              <button type="submit" className="w-full bg-yellow-500 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-yellow-600">
                  ફરિયાદ ઈમેલ કરો
              </button>
              <p className="text-[10px] text-gray-400 text-center mt-2">નોંધ: આ બટન દબાવવાથી તમારા ફોનની ઈમેલ એપ ખૂલશે.</p>
          </form>
      )}
    </div>
  );
};

export default GeneralComplaints;