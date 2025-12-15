import React from 'react';
import { Beneficiary } from '../types';

interface BeneficiaryListProps {
  data: Beneficiary[];
}

// Helper to mask application number (e.g., 252620000758042 -> ••••••8042)
const formatAppNumber = (appNo: string) => {
  if (!appNo || appNo.length <= 4) return appNo;
  const last4 = appNo.slice(-4);
  return (
    <span className="font-mono">
      <span className="text-gray-300 tracking-widest text-xs align-middle">•••••••••••</span>
      <span className="text-emerald-700 font-bold ml-1">{last4}</span>
    </span>
  );
};

const BeneficiaryList: React.FC<BeneficiaryListProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-gray-100 mt-6 mx-4">
        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h3 className="text-lg font-medium text-gray-900">No beneficiaries found</h3>
        <p className="text-gray-500 mt-1">Try adjusting your search terms.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Desktop View: Table */}
        <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr No</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Application No (અરજી નં)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name (લાભાર્થીનું નામ)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account No (ખાતા નં)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Village (ગામ)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-emerald-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {formatAppNumber(item.applicationNo)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.accountNo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.village}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Cards */}
        <div className="md:hidden space-y-4">
          {data.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow p-4 border-l-4 border-emerald-500">
              <div className="flex justify-between items-start mb-2">
                <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-emerald-100 bg-emerald-700 rounded">
                  #{item.id}
                </span>
                <span className="text-xs text-gray-400">Acc: {item.accountNo}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.name}</h3>
              <div className="text-sm text-gray-600 mb-1 flex items-center">
                <span className="font-medium mr-2">App No:</span> 
                {formatAppNumber(item.applicationNo)}
              </div>
              <div className="text-sm text-gray-500">
                <span className="font-medium">Village:</span> {item.village}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-400">
          Showing {data.length} results
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryList;