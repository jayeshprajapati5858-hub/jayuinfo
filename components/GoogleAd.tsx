import React, { useEffect, useRef } from 'react';

// Extend window interface to support adsbygoogle
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const GoogleAd: React.FC = () => {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    // Only execute if the ad hasn't been loaded in this slot yet
    try {
      if (adRef.current && window.adsbygoogle) {
        // Push the ad
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.error("AdSense Error:", e);
    }
  }, []);

  return (
    <div className="w-full my-4 flex justify-center items-center bg-gray-50 border border-gray-100 rounded-lg overflow-hidden min-h-[100px] relative">
      <div className="absolute top-0 right-0 bg-gray-200 text-[9px] px-1 text-gray-500 z-10">Advertisement</div>
      
      {/* 
         GOOGLE ADSENSE UNIT
         Replace 'data-ad-client' with your Publisher ID (e.g., ca-pub-xxxxxxxxxxx)
         Replace 'data-ad-slot' with your Ad Unit ID created in AdSense dashboard
      */}
      <ins 
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', textAlign: 'center' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" 
        data-ad-slot="1234567890"
        data-ad-format="auto"
        data-full-width-responsive="true"
        ref={adRef}
      ></ins>
    </div>
  );
};

export default GoogleAd;