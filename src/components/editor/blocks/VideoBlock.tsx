'use client';

import React from 'react';
import { Block } from '@/types/editor';

interface VideoBlockProps {
  block: Block;
  isEditing: boolean;
}

export function VideoBlock({ block }: VideoBlockProps) {
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.split('v=')[1] || url.split('/').pop();
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('vimeo.com')) {
      const videoId = url.split('/').pop();
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  if (!block.content.src) {
    return (
      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">🎥</div>
          <p>Žádné video</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <iframe
        src={getEmbedUrl(block.content.src)}
        className="w-full h-full rounded-lg"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}