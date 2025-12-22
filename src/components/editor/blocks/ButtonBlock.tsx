'use client';

import React from 'react';
import { Block } from '@/types/editor';

interface ButtonBlockProps {
  block: Block;
  isEditing: boolean;
  onUpdate?: (block: Block) => void;
}

export function ButtonBlock({ block }: ButtonBlockProps) {

  const styles = {
    padding: block.styles.padding || '0.75rem 1.5rem',
    margin: block.styles.margin || '0',
    backgroundColor: block.content.style === 'secondary' ? '#6b7280' : '#3b82f6',
    color: 'white',
    borderRadius: block.styles.borderRadius || '0.5rem',
    fontSize: block.styles.fontSize || '1rem',
    fontWeight: 'medium',
    textAlign: 'center' as const,
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.2s',
  };

  return (
    <div className="w-full flex items-center justify-center py-4">
      <button
        style={styles}
        className="hover:opacity-90 transition-opacity min-w-[120px]"
      >
        {block.content.text || 'Tlačítko'}
      </button>
    </div>
  );
}