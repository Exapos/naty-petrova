'use client';
import { useEffect } from 'react';
import Script from 'next/script';

interface FacebookPixelProps {
  pixelId?: string;
}

declare global {
  interface Window {
    fbq: any;
  }
}

export default function FacebookPixel({ pixelId }: FacebookPixelProps) {
  useEffect(() => {
    if (pixelId && typeof window !== 'undefined') {
      // Initialize Facebook Pixel
      window.fbq = function fbq(...args: any[]) {
        if (window.fbq.callMethod) {
          window.fbq.callMethod(...args);
        } else {
          window.fbq.queue.push(args);
        }
      };

      window.fbq.push = window.fbq;
      window.fbq.loaded = true;
      window.fbq.version = '2.0';
      window.fbq.queue = [];

      window.fbq('init', pixelId);
      window.fbq('track', 'PageView');
    }
  }, [pixelId]);

  if (!pixelId) {
    return null;
  }

  return (
    <Script
      id="facebook-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
        `,
      }}
    />
  );
}