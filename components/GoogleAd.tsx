import React, { useEffect, useRef } from 'react';

const GoogleAd: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentWindow?.document;
    if (!doc) return;

    // Ad Configuration
    const adContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background-color: #f8fafc; }
        </style>
      </head>
      <body>
        <script type="text/javascript">
          atOptions = {
            'key' : '97fc9278d2d7f7a9983b963c24c16fc8',
            'format' : 'iframe',
            'height' : 90,
            'width' : 728,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://www.highperformanceformat.com/97fc9278d2d7f7a9983b963c24c16fc8/invoke.js"></script>
      </body>
      </html>
    `;

    try {
      doc.open();
      doc.write(adContent);
      doc.close();
    } catch (e) {
      console.error("Error loading ad script", e);
    }
  }, []);

  return (
    <div className="w-full bg-slate-50 border border-slate-100 rounded-lg overflow-hidden flex items-center justify-center min-h-[100px]">
       {/* 
         We use an iframe to isolate the ad script. 
         The width is set to 728px to match the ad config.
         On mobile, the parent container in App.tsx handles scrolling.
       */}
       <iframe 
         ref={iframeRef} 
         title="Sponsored Content"
         width="728" 
         height="100" 
         style={{ border: 'none', overflow: 'hidden' }}
         scrolling="no"
       />
    </div>
  );
};

export default GoogleAd;