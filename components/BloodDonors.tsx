import React, { useState, useEffect } from 'react';

interface Donor {
  id: number;
  name: string;
  group: string;
  mobile: string;
  age: number;
  village: string;
}

const initialDonors: Donor[] = [
  { id: 1, name: "પટેલ રવિભાઈ", group: "A+", mobile: "9876543210", age: 25, village: "ભરાડા" },
  { id: 2, name: "ઠાકોર સંજયજી", group: "B+", mobile: "9988776655", age: 30, village: "ભરાડા" },
  { id: 3, name: "ભરવાડ લાલાભાઈ", group: "O+", mobile: "9123456789", age: 28, village: "ભરાડા" },
  { id: 4, name: "વ્યાસ અમિતભાઈ", group: "AB+", mobile: "8899001122", age: 35, village: "ભરાડા" },
  { id: 5, name: "પટેલ સુરેશભાઈ", group: "O-", mobile: "7766554433", age: 40, village: "ભરાડા" },
];

const BloodDonors: React.FC = () => {
  const [donors, setDonors] = useState<Donor[]>(() => {
    const saved = localStorage.getItem('bloodDonors');
    return saved ? JSON.parse(saved) : initialDonors;
  });
  
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [newName, setNewName] = useState('');
  const [newGroup, setNewGroup] = useState('A+');
  const [newMobile, setNewMobile] = useState('');
  const [newAge, setNewAge] = useState('');

  useEffect(() => {
    localStorage.setItem('bloodDonors', JSON.stringify(donors));
  }, [donors]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newDonor: Donor = {
      id: Date.now(),
      name: newName,
      group: newGroup,
      mobile: newMobile,
      age: parseInt(newAge) || 18,
      village: "ભરાડા"
    };
    setDonors([...donors, newDonor]);
    setShowForm(false);
    setNewName(''); setNewMobile(''); setNewAge('');
    alert('રક્તદાતા યાદીમાં ઉમેરાઈ ગયા છે! આભાર.');
  };

  const filteredDonors = selectedGroup === 'All' ? donors : donors.filter(d => d.group === selectedGroup);
  const groups = ['All', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-8 animate-fade-in pb-20">
      
      {/* Header */}
      <div className="bg-red-600 rounded-2xl p-6 text-white shadow-lg mb-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
        <div className="relative z-10 flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold">રક્તદાતા યાદી (Blood Donors)</h2>
                <p className="text-red-100 text-sm">ઈમરજન્સીમાં લોહીની જરૂરિયાત માટે</p>
            </div>
            <div className="bg-white/20 p-3 rounded-full animate-pulse">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
         {/* Group Filter */}
         <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 no-scrollbar">
            {groups.map(g => (
                <button
                   key={g}
                   onClick={() => setSelectedGroup(g)}
                   className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                       selectedGroup === g 
                       ? 'bg-red-600 text-white shadow-md' 
                       : 'bg-white text-gray-600 border border-gray-200'
                   }`}
                >
                    {g === 'All' ? 'બધા' : g}
                </button>
            ))}
         </div>

         <button 
           onClick={() => setShowForm(true)}
           className="w-full md:w-auto bg-gray-900 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg flex items-center justify-center gap-2 hover:bg-gray-800"
         >
            <span>+</span> હું રક્તદાન કરવા માંગુ છું
         </button>
      </div>

      {/* Donors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {filteredDonors.length === 0 ? (
             <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                 <p className="text-gray-400">આ બ્લડ ગ્રુપ માટે કોઈ દાતા ઉપલબ્ધ નથી.</p>
             </div>
         ) : (
             filteredDonors.map(donor => (
                 <div key={donor.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 font-black text-xl flex items-center justify-center border border-red-100">
                             {donor.group}
                         </div>
                         <div>
                             <h3 className="font-bold text-gray-800">{donor.name}</h3>
                             <p className="text-xs text-gray-500">ઉંમર: {donor.age} | ગામ: {donor.village}</p>
                         </div>
                     </div>
                     <a href={`tel:${donor.mobile}`} className="bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-red-200 shadow-lg">
                         Call
                     </a>
                 </div>
             ))
         )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
           <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
               <div className="flex justify-between items-center mb-4">
                   <h3 className="font-bold text-gray-800">રક્તદાતા નોંધણી</h3>
                   <button onClick={() => setShowForm(false)} className="text-gray-400">✕</button>
               </div>
               <form onSubmit={handleAdd} className="space-y-4">
                   <input 
                     type="text" placeholder="તમારું નામ" 
                     value={newName} onChange={e => setNewName(e.target.value)}
                     className="w-full p-2 border rounded" required 
                   />
                   <select 
                     value={newGroup} onChange={e => setNewGroup(e.target.value)}
                     className="w-full p-2 border rounded"
                   >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                   </select>
                   <input 
                     type="tel" placeholder="મોબાઈલ નંબર" 
                     value={newMobile} onChange={e => setNewMobile(e.target.value)}
                     className="w-full p-2 border rounded" required 
                   />
                   <input 
                     type="number" placeholder="ઉંમર" 
                     value={newAge} onChange={e => setNewAge(e.target.value)}
                     className="w-full p-2 border rounded" required 
                   />
                   <button type="submit" className="w-full bg-red-600 text-white py-2 rounded font-bold">રજીસ્ટર કરો</button>
               </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default BloodDonors;