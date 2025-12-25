
import React, { useEffect, useRef } from 'react';

const AdsterraAd: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create an iframe to isolate the document.write call from the React app
    const iframe = document.createElement('iframe');
    iframe.title = "Advertisement";
    iframe.width = "728";
    iframe.height = "90";
    iframe.style.border = "none";
    iframe.scrolling = "no";
    iframe.style.display = "block";
    iframe.style.margin = "0 auto";

    // Clear previous content and append new iframe
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(iframe);

    // Write the Adsterra script into the iframe
    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <style>body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; }</style>
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
      `);
      doc.close();
    }
  }, []);

  return (
    <div className="w-full my-6 flex justify-center bg-gray-50/50 rounded-xl border border-gray-100 py-2 overflow-x-auto no-scrollbar">
      {/* Container for the ad with scroll support for mobile since 728px is wide */}
      <div ref={containerRef} className="min-w-[728px] min-h-[90px]" />
    </div>
  );
};

export default AdsterraAd;
