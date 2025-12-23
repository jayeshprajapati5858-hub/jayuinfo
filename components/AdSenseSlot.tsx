
import React, { useEffect } from 'react';

interface AdSenseSlotProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  style?: React.CSSProperties;
}

const AdSenseSlot: React.FC<AdSenseSlotProps> = ({ slot, format = 'auto', style }) => {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // AdSense might be blocked by browser extension
    }
  }, []);

  // Standard Pub ID - Replace with your actual ID
  const publisherId = "ca-pub-XXXXXXXXXXXXXXXX"; 

  return (
    <div className="my-6 overflow-hidden flex flex-col items-center justify-center bg-gray-50/30 rounded-2xl min-h-[100px] w-full border border-dashed border-gray-200/50">
      <p className="text-[8px] text-gray-300 font-bold uppercase tracking-widest mb-1">Advertisement</p>
      <ins
        className="adsbygoogle"
        style={style || { display: 'block', minWidth: '250px', minHeight: '90px' }}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default AdSenseSlot;
