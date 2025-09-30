'use client';

import React from 'react';
import { Block } from '../../../types/editor';

interface IconBlockProps {
  block: Block;
  isEditing: boolean;
}

export function IconBlock({ block }: IconBlockProps) {
  const { icon = 'star', size = '48px', color = '#1f2937' } = block.content;

  // Simple icon mapping - in real app you'd use a proper icon library
  const getIconSvg = (iconName: string) => {
    switch (iconName) {
      case 'star':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        );
      case 'heart':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        );
      case 'check':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        );
      case 'arrow-right':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10" />
          </svg>
        );
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div
        style={{
          width: size,
          height: size,
          color: color,
        }}
        className="flex items-center justify-center"
      >
        {getIconSvg(icon)}
      </div>
    </div>
  );
}