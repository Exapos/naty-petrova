'use client';

import React from 'react';
import { Block } from '@/types/editor';
import { useEditorStore } from '@/stores/editorStore';

interface ButtonBlockProps {
  block: Block;
  isEditing: boolean;
}

export function ButtonBlock({ block, isEditing }: ButtonBlockProps) {
  const { updateBlock } = useEditorStore();

  const handleTextChange = (newText: string) => {
    updateBlock(block.id, {
      content: { ...block.content, text: newText },
    });
  };

  const handleUrlChange = (newUrl: string) => {
    updateBlock(block.id, {
      content: { ...block.content, url: newUrl },
    });
  };

  const handleStyleChange = (newStyle: string) => {
    updateBlock(block.id, {
      content: { ...block.content, style: newStyle },
    });
  };

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
    <div className="w-full h-full flex items-center justify-center">
      <button
        style={styles}
        className="hover:opacity-90 transition-opacity w-full h-full"
        onClick={() => isEditing && handleTextChange(prompt('Nový text tlačítka:', block.content.text || 'Tlačítko') || block.content.text || 'Tlačítko')}
      >
        {block.content.text || 'Tlačítko'}
      </button>

      {/* Edit Controls */}
      {isEditing && (
        <div className="absolute -top-16 left-0 bg-white border border-gray-200 rounded shadow-md p-2">
          <div className="space-y-2">
            <input
              type="text"
              value={block.content.text || ''}
              onChange={(e) => handleTextChange(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              placeholder="Text tlačítka"
            />
            <input
              type="url"
              value={block.content.url || ''}
              onChange={(e) => handleUrlChange(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              placeholder="URL odkazu"
            />
            <select
              value={block.content.style || 'primary'}
              onChange={(e) => handleStyleChange(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="primary">Primární</option>
              <option value="secondary">Sekundární</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}