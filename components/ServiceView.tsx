
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import WaterSupply from './WaterSupply';
import HealthCenter from './HealthCenter';
import SchoolInfo from './SchoolInfo';
import NoticeBoard from './NoticeBoard';
import SchemeInfo from './SchemeInfo';
import RojgarBoard from './RojgarBoard';
import BusinessDirectory from './BusinessDirectory';
import VillageProfile from './VillageProfile';
import AgriRental from './AgriRental';
import GeneralComplaints from './GeneralComplaints';
import StudentCorner from './StudentCorner';
import BloodDonors from './BloodDonors';
import VillageMarket from './VillageMarket';
import NewsSection from './NewsSection';

const ServiceView: React.FC = () => {
  const { type } = useParams<{ type: string }>();

  // Map of URL param to Component
  const renderService = () => {
    switch (type) {
      case 'water': return <WaterSupply />;
      case 'health': return <HealthCenter />;
      case 'school': return <SchoolInfo />;
      case 'notice': return <NoticeBoard />;
      case 'schemes': return <SchemeInfo />;
      case 'rojgar': return <RojgarBoard />;
      case 'business': return <BusinessDirectory />;
      case 'profile': return <VillageProfile />;
      case 'agri': return <AgriRental />;
      case 'complaint': return <GeneralComplaints />;
      case 'student': return <StudentCorner />;
      case 'blood': return <BloodDonors />;
      case 'marketplace': return <VillageMarket />;
      case 'news': return <NewsSection />;
      default: return <div className="text-center py-20 text-gray-400">સેવા ઉપલબ્ધ નથી.</div>;
    }
  };

  const servicesList = [
      { id: 'marketplace', label: 'ગ્રામ્ય હાટ', color: 'bg-amber-600' },
      { id: 'news', label: 'સમાચાર', color: 'bg-blue-600' },
      { id: 'notice', label: 'નોટિસ', color: 'bg-orange-600' },
      { id: 'rojgar', label: 'રોજગાર', color: 'bg-emerald-600' },
      { id: 'health', label: 'આરોગ્ય', color: 'bg-teal-600' },
      { id: 'water', label: 'પાણી', color: 'bg-blue-600' },
      { id: 'schemes', label: 'યોજના', color: 'bg-purple-600' },
      { id: 'agri', label: 'ખેતી સાધન', color: 'bg-green-600' },
      { id: 'business', label: 'દુકાનો', color: 'bg-gray-600' },
      { id: 'student', label: 'વિદ્યાર્થી', color: 'bg-pink-600' },
      { id: 'complaint', label: 'ફરિયાદ', color: 'bg-red-600' },
      { id: 'blood', label: 'રક્તદાન', color: 'bg-rose-600' },
  ];

  return (
    <div className="animate-fade-in">
       <div className="flex items-center gap-2 px-1 mb-4">
          <Link to="/" className="p-2 -ml-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          </Link>
          <h2 className="text-xl font-bold text-gray-800">ગ્રામ્ય સેવાઓ</h2>
       </div>
       
       <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-4 border-b">
          {servicesList.map(s => (
             <Link key={s.id} to={`/service/${s.id}`} className={`px-5 py-2.5 rounded-full whitespace-nowrap text-[10px] font-black tracking-widest uppercase transition-all border ${type === s.id ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white text-gray-500 border-gray-100'}`}>
                 {s.label}
             </Link>
          ))}
       </div>

       {renderService()}
    </div>
  );
};

export default ServiceView;
