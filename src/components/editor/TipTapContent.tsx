'use client';

import React, { useEffect, useState } from 'react';
import './tiptap-content.css';

interface TipTapContentProps {
  content: string;
  className?: string;
}

export function TipTapContent({ content, className = '' }: TipTapContentProps) {
  const [sanitizedContent, setSanitizedContent] = useState<string>('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Import DOMPurify dynamically on client side
    import('dompurify').then((DOMPurify) => {
      const purify = DOMPurify.default;
      
      // Add hook to allow YouTube iframes specifically and remove non-YouTube iframes
      purify.addHook('uponSanitizeElement', (node, data) => {
        if (data.tagName === 'iframe') {
          const src = (node as HTMLElement).getAttribute('src') || '';
          // Allow YouTube and YouTube no-cookie domains
          if (src.includes('youtube.com') || src.includes('youtu.be') || src.includes('youtube-nocookie.com')) {
            return; // Allow this iframe
          }
          // Remove non-YouTube iframes
          node.parentNode?.removeChild(node);
        }
      });
      
      // Configure DOMPurify to allow iframes and all necessary attributes
      const clean = purify.sanitize(content, {
        ADD_TAGS: ['iframe'],
        ADD_ATTR: [
          'allow', 
          'allowfullscreen', 
          'frameborder', 
          'scrolling', 
          'target',
          'src',
          'width',
          'height',
          'style',
          'class',
          'data-youtube-video',
          'loading',
          'referrerpolicy',
          'title',
          'autoplay',
          'disablekbcontrols',
          'enableiframeapi',
          'endtime',
          'ivloadpolicy',
          'loop',
          'modestbranding',
          'origin',
          'playlist',
          'progressbarcolor',
          'rel',
          'start',
          'cclanguage',
          'ccloadpolicy',
          'interfacelanguage',
        ],
        ALLOW_DATA_ATTR: true,
      });
      
      // Remove the hook after use to prevent memory leaks
      purify.removeHook('uponSanitizeElement');
      
      setSanitizedContent(clean);
    });
  }, [content]);

  // During SSR or before hydration, render empty to avoid mismatch
  if (!isClient) {
    return <div className={`tiptap-content ${className}`} />;
  }

  return (
    <div 
      className={`tiptap-content ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}

export default TipTapContent;
