'use client';

import React from 'react';
import { Block } from '../../../types/editor';

interface DividerBlockProps {
  block: Block;
  isEditing: boolean;
}

export function DividerBlock({ block }: DividerBlockProps) {
  const { style = 'solid', thickness = '1px', color = '#e5e7eb', width = '100%' } = block.content;

  return (
    <div className="w-full flex items-center justify-center py-4">
      <div
        className="flex-1 h-0 border-t"
        style={{
          borderTopStyle: style,
          borderTopWidth: thickness,
          borderTopColor: color,
          maxWidth: width,
        }}
      />
    </div>
  );
}