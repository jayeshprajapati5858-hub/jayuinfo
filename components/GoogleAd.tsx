import React, { useEffect, useRef } from 'react';

const GoogleAd: React.FC = () => {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    // This pushes the ad request to Google's queue when the component mounts.
    // The try-catch block prevents application crashes if AdBlockers block the script.
    try {
      const adsbygoogle = (window as any).adsbygoogle || [];
      adsbygoogle.push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <div className="w-full bg-slate-50 border border-slate-100 rounded-lg overflow-hidden min-h-[250px] flex items-center justify-center relative">
        {/* AdSense Unit */}
        {/* 
            TODO: Replace data-ad-slot="1234567890" with your actual Ad Slot ID 
            generated from the Google AdSense Dashboard.
        */}
        <ins className="adsbygoogle"
            style={{ display: 'block', width: '100%' }}
            data-ad-client="ca-pub-8835318705253846"
            data-ad-slot="1234567890"
            data-ad-format="auto"
            data-full-width-responsive="true"
            ref={adRef}
        />
        
        {/* Fallback background/text if ad is empty or loading */}
        <div className="absolute inset-0 -z-10 flex flex-col items-center justify-center bg-gray-50 text-gray-300">
           <span className="text-xs uppercase tracking-widest font-semibold">Advertisement</span>
        </div>
    </div>
  );
};

export default GoogleAd;