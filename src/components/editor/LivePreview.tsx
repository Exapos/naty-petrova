'use client';

import React from 'react';
import DOMPurify from 'isomorphic-dompurify';
import './editor.css';
import './tiptap-content.css';

interface LivePreviewProps {
  content: string;
  className?: string;
}

export function LivePreview({ content, className = '' }: LivePreviewProps) {
  // Sanitize HTML content for safe rendering with YouTube support
  const sanitizedContent = React.useMemo(() => {
    return DOMPurify.sanitize(content, {
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
      ],
      ALLOW_DATA_ATTR: true,
    });
  }, [content]);

  if (!content || content === '<p></p>') {
    return (
      <div className={`prose prose-gray max-w-none p-6 ${className}`}>
        <p className="text-gray-400 italic">
          Náhled se zobrazí zde jakmile začnete psát...
        </p>
      </div>
    );
  }

  return (
    <div className={`editor-preview ${className}`}>
      <div 
        className="tiptap-content prose prose-gray max-w-none"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    </div>
  );
}

export default LivePreview;
