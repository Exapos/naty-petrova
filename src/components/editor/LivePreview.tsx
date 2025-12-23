'use client';

import React from 'react';
import DOMPurify from 'isomorphic-dompurify';
import './editor.css';

interface LivePreviewProps {
  content: string;
  className?: string;
}

export function LivePreview({ content, className = '' }: LivePreviewProps) {
  // Sanitize HTML content for safe rendering
  const sanitizedContent = React.useMemo(() => {
    return DOMPurify.sanitize(content, {
      ADD_TAGS: ['iframe'],
      ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'target'],
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
        className="ProseMirror prose prose-gray max-w-none"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    </div>
  );
}

export default LivePreview;
