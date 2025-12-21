import React, { useEffect, useRef } from 'react';

interface AdSenseSlotProps {
  slotId?: string; // Optional: specific slot ID if using manual units
  format?: 'auto' | 'fluid' | 'rectangle';
}

const AdSenseSlot: React.FC<AdSenseSlotProps> = ({ slotId, format = 'auto' }) => {
  const adRef = useRef<HTMLModElement>(null);
  const isPushed = useRef(false);

  useEffect(() => {
    // Delay the push slightly to ensure the DOM element has been rendered and has width
    const timer = setTimeout(() => {
      try {
        // Check if the element exists and is visible (offsetParent is null if display: none)
        // Also checks if we haven't pushed to this slot yet
        if (adRef.current && adRef.current.offsetParent !== null && !isPushed.current) {
          // Check if ad is already loaded (has children usually indicates it was filled)
          if (adRef.current.innerHTML === "") {
             // @ts-ignore
             (window.adsbygoogle = window.adsbygoogle || []).push({});
             isPushed.current = true;
          }
        }
      } catch (e) {
        console.error("AdSense Error:", e);
      }
    }, 500); // 500ms delay to allow layout transitions to complete

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full my-4 overflow-hidden flex justify-center items-center bg-gray-50 border border-gray-100 rounded-lg min-h-[100px] relative">
      {/* 
         NOTE: Replace data-ad-client with your actual Publisher ID (e.g., ca-pub-1234567890)
         and data-ad-slot with your specific Ad Unit ID.
      */}
      <ins className="adsbygoogle"
           ref={adRef}
           style={{ display: 'block', width: '100%', minWidth: '250px' }} 
           data-ad-client="ca-pub-YOUR_PUBLISHER_ID_HERE"
           data-ad-slot={slotId || "YOUR_AD_SLOT_ID"}
           data-ad-format={format}
           data-full-width-responsive="true"></ins>
      
      {/* Placeholder Text for Development (Remove in Production if desired) */}
      <span className="text-[10px] text-gray-300 font-mono absolute pointer-events-none">Advertisement</span>
    </div>
  );
};

export default AdSenseSlot;