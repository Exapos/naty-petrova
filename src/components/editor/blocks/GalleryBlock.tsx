'use client';

import React from 'react';
import { Block } from '@/types/editor';

interface GalleryBlockProps {
  block: Block;
  isEditing: boolean;
}

export function GalleryBlock({ block }: GalleryBlockProps) {
  const images = block.content.images || [];

  if (images.length === 0) {
    return (
      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">🖼️</div>
          <p>Žádné obrázky v galerii</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full grid grid-cols-2 gap-2 p-2">
      {images.slice(0, 4).map((image: any, index: number) => (
        <div key={index} className="relative aspect-square">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.src || image}
            alt={image.alt || `Obrázek ${index + 1}`}
            className="w-full h-full object-cover rounded"
          />
        </div>
      ))}
      {images.length > 4 && (
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
          +{images.length - 4}
        </div>
      )}
    </div>
  );
}