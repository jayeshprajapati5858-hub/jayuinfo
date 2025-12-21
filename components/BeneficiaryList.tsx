import React from 'react';
import { Beneficiary } from '../types';

interface BeneficiaryListProps {
  data: Beneficiary[];
}

// Helper to mask/format Application Number
const formatAppNumber = (appNo: string) => {
  if (!appNo || appNo.length <= 4) return appNo;
  const last4 = appNo.slice(-4);
  return (
    <span className="font-mono tracking-wide text-gray-600">
      •••• {last4}
    </span>
  );
};

// Helper to mask Account Number (Privacy Compliance)
const formatAccountNo = (accNo: string) => {
  if (!accNo || accNo.length <= 2) return accNo;
  // If it's short, just show it, otherwise mask start
  if (accNo.length < 4) return `*${accNo}`;
  const last3 = accNo.slice(-3);
  return `***${last3}`;
};

// WhatsApp Share Handler
const handleShare = (item: Beneficiary) => {
  const text = `*કૃષિ સહાય - મંજૂરી સ્ટેટસ*\n\n👤 નામ: ${item.name}\n📄 અરજી: ${item.applicationNo}\n🏡 ગામ: ${item.village}\n\n👉 વધુ માહિતી માટે: https://www.jayuinfo.in`;
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
};

// Print Handler (Generates a Government-style Receipt)
const handlePrint = (item: Beneficiary) => {
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>કૃષિ સહાય મંજૂરી પત્ર - ${item.applicationNo}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Gujarati:wght@400;700&display=swap');
            body { font-family: 'Noto Sans Gujarati', sans-serif; padding: 40px; background: #fff; color: #1f2937; }
            .receipt-box { border: 2px solid #10b981; border-radius: 16px; padding: 40px; max-width: 600px; margin: 0 auto; position: relative; overflow: hidden; }
            .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 80px; color: #10b981; opacity: 0.05; font-weight: bold; pointer-events: none; white-space: nowrap; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; }
            .gov-title { font-size: 24px; font-weight: 700; color: #064e3b; margin: 0; }
            .sub-title { font-size: 14px; color: #6b7280; text-transform: uppercase; letter-spacing: 2px; margin-top: 5px; }
            .data-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
            .field-label { font-size: 12px; color: #6b7280; font-weight: 600; text-transform: uppercase; margin-bottom: 4px; }
            .field-value { font-size: 16px; font-weight: 700; color: #111827; }
            .status-box { background: #ecfdf5; color: #065f46; padding: 15px; border-radius: 8px; text-align: center; font-weight: bold; border: 1px dashed #10b981; margin-top: 20px; }
            .footer { margin-top: 40px; text-align: center; font-size: 10px; color: #9ca3af; }
            .disclaimer { font-size: 9px; color: #999; margin-top: 10px; text-align: center; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="receipt-box">
            <div class="watermark">KRUSHI SAHAY APPROVED</div>
            <div class="header">
              <h1 class="gov-title">કૃષિ સહાય યોજના</h1>
              <div class="sub-title">લાભાર્થી સ્ટેટસ રિપોર્ટ</div>
            </div>
            
            <div class="data-grid">
              <div>
                <div class="field-label">લાભાર્થીનું નામ</div>
                <div class="field-value">${item.name}</div>
              </div>
              <div style="text-align: right;">
                <div class="field-label">અરજી ક્રમાંક</div>
                <div class="field-value" style="font-family: monospace;">${item.applicationNo}</div>
              </div>
              <div style="margin-top: 15px;">
                <div class="field-label">ખાતા નંબર</div>
                <div class="field-value">XXXX${item.accountNo.slice(-2)}</div>
              </div>
              <div style="text-align: right; margin-top: 15px;">
                <div class="field-label">ગામ</div>
                <div class="field-value">${item.village}</div>
              </div>
            </div>

            <div class="status-box">
              ✅ અરજી મંજૂર કરવામાં આવી છે (Verified)
            </div>

            <div class="footer">
              Generated on ${new Date().toLocaleDateString('gu-IN')} | ભરાડા ગ્રામ પંચાયત ડિજિટલ પોર્ટલ
              <div class="disclaimer">Note: This is an informational receipt generated by a third-party app. Not an official government document.</div>
            </div>
          </div>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }
};

export const BeneficiaryList: React.FC<BeneficiaryListProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <h3 className="text-gray-900 font-medium text-lg">કોઈ ડેટા મળ્યો નથી</h3>
        <p className="text-gray-500 text-sm mt-1 text-center">તમે સર્ચ કરેલ નામ અથવા નંબર યાદીમાં નથી.</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">પરિણામો ({data.length})</h3>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">અરજી / નામ</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ગામ / ખાતું</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-emerald-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900">{item.name}</span>
                    <span className="text-xs text-gray-500 font-mono mt-0.5">{item.applicationNo}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-900">{item.village}</span>
                    <span className="text-xs text-gray-500">ખાતા નં: {formatAccountNo(item.accountNo)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end items-center gap-4">
                    <button onClick={() => handlePrint(item)} className="text-gray-400 hover:text-emerald-600 transition-colors" title="Print Receipt">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                    </button>
                    <button onClick={() => handleShare(item)} className="text-emerald-600 hover:text-emerald-800 transition-colors flex items-center gap-1">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                      શેર
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Mobile Card View (Visible only on Mobile) */}
      <div className="md:hidden space-y-3">
        {data.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3">
             <div className="flex justify-between items-start">
                <div>
                   <h3 className="font-bold text-gray-900">{item.name}</h3>
                   <span className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-0.5 rounded">{item.applicationNo}</span>
                </div>
                <div className="text-right">
                   <p className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{item.village}</p>
                </div>
             </div>
             
             <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                 <p className="text-xs text-gray-400">ખાતા નં: {formatAccountNo(item.accountNo)}</p>
                 <div className="flex gap-3">
                    <button onClick={() => handlePrint(item)} className="text-gray-400 hover:text-gray-600">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                    </button>
                    <button onClick={() => handleShare(item)} className="text-emerald-600 font-bold text-xs flex items-center gap-1">
                       <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                       શેર
                    </button>
                 </div>
             </div>
             
             {/* Disclaimer for Mobile */}
             <p className="text-[9px] text-gray-300 text-center mt-2">
                This is a demo portal. Not an official government app.
             </p>
          </div>
        ))}
      </div>
      
      {/* Footer Disclaimer */}
      <div className="mt-8 text-center border-t border-gray-100 pt-4 pb-4">
        <p className="text-[10px] text-gray-400">
           ડિસ્ક્લેમર: આ વેબસાઇટ માત્ર માહિતી હેતુ માટે છે. આ કોઈ સરકારી વેબસાઇટ નથી. ડેટાની ચોકસાઈ માટે કૃપા કરીને ગ્રામ પંચાયતનો સંપર્ક કરો.
           <br/>
           Privacy Policy | Terms of Use
        </p>
      </div>
    </div>
  );
};