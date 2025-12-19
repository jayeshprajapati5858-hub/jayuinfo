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

// Helper to handle WhatsApp sharing
const handleShare = (item: Beneficiary) => {
  const text = `*Krushi Sahay Beneficiary Details* \n\nName: ${item.name}\nApp No: ${item.applicationNo}\nAccount No: ${item.accountNo}\nVillage: ${item.village}\n\nCheck status here: ${window.location.href}`;
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
};

// Helper to handle Print Receipt
const handlePrint = (item: Beneficiary) => {
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Krushi Sahay Receipt - ${item.applicationNo}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
            body { font-family: 'Inter', sans-serif; padding: 40px; background: #f9fafb; display: flex; justify-content: center; }
            .receipt { background: white; width: 100%; max-width: 500px; border: 2px solid #059669; border-radius: 12px; padding: 30px; position: relative; }
            .header { text-align: center; border-bottom: 2px dashed #e5e7eb; padding-bottom: 20px; margin-bottom: 20px; }
            .title { color: #059669; font-size: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin: 0; }
            .subtitle { color: #6b7280; font-size: 12px; margin-top: 5px; text-transform: uppercase; letter-spacing: 2px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 15px; align-items: baseline; }
            .label { font-size: 13px; color: #6b7280; font-weight: 500; text-transform: uppercase; }
            .value { font-size: 16px; color: #111827; font-weight: 600; text-align: right; width: 60%; }
            .footer { margin-top: 30px; border-top: 2px dashed #e5e7eb; padding-top: 20px; text-align: center; font-size: 11px; color: #9ca3af; }
            .stamp { margin-top: 20px; border: 2px solid #059669; color: #059669; display: inline-block; padding: 5px 15px; border-radius: 4px; font-weight: bold; transform: rotate(-5deg); opacity: 0.8; }
            @media print {
              body { background: white; padding: 0; }
              .receipt { border: 1px solid #000; box-shadow: none; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <h1 class="title">Krushi Sahay</h1>
              <div class="subtitle">Beneficiary Status Slip</div>
            </div>
            
            <div class="row">
              <span class="label">Beneficiary Name</span>
              <span class="value">${item.name}</span>
            </div>
            
            <div class="row">
              <span class="label">Application No</span>
              <span class="value" style="font-family: monospace;">${item.applicationNo}</span>
            </div>
            
            <div class="row">
              <span class="label">Account No</span>
              <span class="value">${item.accountNo}</span>
            </div>
            
            <div class="row">
              <span class="label">Village</span>
              <span class="value">${item.village}</span>
            </div>

            <div class="row" style="margin-top: 25px;">
              <span class="label">Status</span>
              <span class="value" style="color: #059669;">✔ VERIFIED</span>
            </div>

            <div style="text-align: center;">
              <div class="stamp">APPROVED</div>
            </div>

            <div class="footer">
              Generated on ${new Date().toLocaleDateString()} via Krushi Sahay Portal<br/>
              This is a computer generated receipt.
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }
};

const BeneficiaryList: React.FC<BeneficiaryListProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-gray-100 mt-6 mx-4">
        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h3 className="text-lg font-medium text-gray-900">No beneficiaries found</h3>
        <p className="text-gray-500 mt-1">Try adjusting your search terms or use Voice Search.</p>
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Application No</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account / Village</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-col">
                      <span>Ac: {item.accountNo}</span>
                      <span className="text-xs text-emerald-600">{item.village}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <div className="flex justify-center space-x-2">
                      <button 
                        onClick={() => handlePrint(item)}
                        title="Print Receipt"
                        className="inline-flex items-center p-1.5 border border-gray-200 rounded-full text-gray-600 bg-white hover:bg-gray-50 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleShare(item)}
                        className="inline-flex items-center px-3 py-1 border border-emerald-200 text-xs font-medium rounded-full text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        Share
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Cards */}
        <div className="md:hidden space-y-4">
          {data.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow p-4 border-l-4 border-emerald-500 relative">
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
              <div className="text-sm text-gray-500 mb-3">
                <span className="font-medium">Village:</span> {item.village}
              </div>
              
              <div className="flex space-x-2 mt-2">
                <button 
                  onClick={() => handlePrint(item)}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-50 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
                  </svg>
                  Print Slip
                </button>
                <button 
                  onClick={() => handleShare(item)}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-green-50 text-green-700 text-sm font-medium rounded-md hover:bg-green-100 transition-colors border border-green-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Share
                </button>
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