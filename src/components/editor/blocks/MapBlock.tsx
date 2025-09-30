'use client';

import React from 'react';
import { Block } from '@/types/editor';

interface MapBlockProps {
  block: Block;
  isEditing: boolean;
}

export function MapBlock({ block }: MapBlockProps) {
  const { latitude = 50.0755, longitude = 14.4378, zoom = 12 } = block.content;

  // Simple map placeholder - in real app you'd use Google Maps or similar
  return (
    <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden">
      {/* Map Placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🗺️</div>
            <p className="text-gray-600 font-medium">Interaktivní mapa</p>
            <p className="text-sm text-gray-500 mt-1">
              {latitude.toFixed(4)}, {longitude.toFixed(4)} (zoom: {zoom})
            </p>
          </div>
        </div>

        {/* Simple map grid overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-repeat" style={{
            backgroundImage: `
              linear-gradient(to right, #000 1px, transparent 1px),
              linear-gradient(to bottom, #000 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Location pin */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
          <div className="w-1 h-6 bg-red-500 mx-auto" />
        </div>
      </div>
    </div>
  );
}