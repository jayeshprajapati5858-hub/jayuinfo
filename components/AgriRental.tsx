import React, { useState, useEffect } from 'react';

interface Equipment {
  id: number;
  name: string; // Tractor, Thresher, etc.
  owner: string;
  mobile: string;
  rate: string; // Price per hour/bigha
  details: string; // HP, Model, Implements available
}

const initialEquipment: Equipment[] = [
  { id: 1, name: "જોન ડીયર ટ્રેક્ટર (55 HP)", owner: "પટેલ કાનજીભાઈ", mobile: "9988770011", rate: "₹600 / કલાક", details: "રોટાવેટર અને પલટી સાથે ઉપલબ્ધ." },
  { id: 2, name: "મીની ટ્રેક્ટર", owner: "ઠાકોર વિનુભાઈ", mobile: "9900011222", rate: "₹400 / કલાક", details: "નિંદામણ અને દવા છાંટવા માટે." },
  { id: 3, name: "થ્રેશર (મગફળી/ચણા)", owner: "ભરવાડ ગોગાભાઈ", mobile: "9876543210", rate: "ચર્ચા મુજબ", details: "નવું મોડલ, ચોખ્ખો માલ નીકળશે." },
];

const AgriRental: React.FC = () => {
  const [items, setItems] = useState<Equipment[]>(() => {
    const saved = localStorage.getItem('agriRentals');
    return saved ? JSON.parse(saved) : initialEquipment;
  });
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [newName, setNewName] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [newMobile, setNewMobile] = useState('');
  const [newRate, setNewRate] = useState('');
  const [newDetails, setNewDetails] = useState('');

  useEffect(() => {
    localStorage.setItem('agriRentals', JSON.stringify(items));
  }, [items]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: Equipment = {
      id: Date.now(),
      name: newName,
      owner: newOwner,
      mobile: newMobile,
      rate: newRate,
      details: newDetails
    };
    setItems([newItem, ...items]);
    setShowForm(false);
    setNewName(''); setNewOwner(''); setNewMobile(''); setNewRate(''); setNewDetails('');
    alert('તમારું સાધન ભાડે આપવા માટે લિસ્ટમાં મુકાયું છે.');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-8 animate-fade-in pb-20">
      
      {/* Header */}
      <div className="bg-green-700 rounded-2xl p-6 text-white shadow-lg mb-6 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold">ખેતી સાધનો ભાડે (Rental)</h2>
                <p className="text-green-100 text-sm">ટ્રેક્ટર, થ્રેશર અને ઓજારો</p>
            </div>
            <button 
               onClick={() => setShowForm(true)}
               className="bg-white text-green-800 px-4 py-2 rounded-lg text-xs font-bold shadow hover:bg-green-50"
            >
               + જાહેરાત આપો
            </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
         {items.length === 0 ? (
             <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl">કોઈ સાધનો ઉપલબ્ધ નથી.</div>
         ) : (
             items.map(item => (
                 <div key={item.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                     <div className="flex justify-between items-start mb-2">
                         <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                         <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-bold">{item.rate}</span>
                     </div>
                     <p className="text-sm text-gray-600 mb-3">{item.details}</p>
                     
                     <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                         <div className="text-xs text-gray-500">
                             માલિક: <span className="font-bold text-gray-700">{item.owner}</span>
                         </div>
                         <a href={`tel:${item.mobile}`} className="bg-green-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-green-700 flex items-center gap-2">
                             <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                             Call
                         </a>
                     </div>
                 </div>
             ))
         )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
           <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
               <div className="flex justify-between items-center mb-4">
                   <h3 className="font-bold text-gray-800">સાધન ભાડે આપવા માટે</h3>
                   <button onClick={() => setShowForm(false)} className="text-gray-400">✕</button>
               </div>
               <form onSubmit={handleSubmit} className="space-y-4">
                   <input type="text" placeholder="સાધનનું નામ (દા.ત. ટ્રેક્ટર)" value={newName} onChange={e => setNewName(e.target.value)} className="w-full p-2 border rounded" required />
                   <input type="text" placeholder="ભાડું (દા.ત. 500/કલાક)" value={newRate} onChange={e => setNewRate(e.target.value)} className="w-full p-2 border rounded" required />
                   <textarea placeholder="વધુ વિગત (HP, મોડલ વગેરે)" value={newDetails} onChange={e => setNewDetails(e.target.value)} className="w-full p-2 border rounded" />
                   <input type="text" placeholder="તમારું નામ" value={newOwner} onChange={e => setNewOwner(e.target.value)} className="w-full p-2 border rounded" required />
                   <input type="tel" placeholder="મોબાઈલ નંબર" value={newMobile} onChange={e => setNewMobile(e.target.value)} className="w-full p-2 border rounded" required />
                   <button type="submit" className="w-full bg-green-700 text-white py-2 rounded font-bold">જાહેરાત મૂકો</button>
               </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default AgriRental;