'use client';

import React, { useState } from 'react';
import { Block } from '@/types/editor';
import { useEditorStore } from '@/stores/editorStore';

interface HeadingBlockProps {
  block: Block;
  isEditing: boolean;
}

export function HeadingBlock({ block, isEditing }: HeadingBlockProps) {
  const { updateBlock } = useEditorStore();
  const [isEditingText, setIsEditingText] = useState(false);
  const [tempText, setTempText] = useState(block.content.text || 'Nový nadpis');

  const handleTextChange = (newText: string) => {
    updateBlock(block.id, {
      content: { ...block.content, text: newText },
    });
  };

  const handleLevelChange = (level: number) => {
    updateBlock(block.id, {
      content: { ...block.content, level },
    });
  };

  const handleSaveText = () => {
    handleTextChange(tempText);
    setIsEditingText(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveText();
    } else if (e.key === 'Escape') {
      setTempText(block.content.text || 'Nový nadpis');
      setIsEditingText(false);
    }
  };

  const level = block.content.level || 1;
  const HeadingTag = level === 1 ? 'h1' : level === 2 ? 'h2' : 'h3';

  const styles = {
    color: block.styles.textColor || '#1f2937',
    fontSize: level === 1 ? '2.25rem' : level === 2 ? '1.875rem' : '1.5rem',
    fontWeight: level === 1 ? 'bold' : level === 2 ? 'semibold' : 'medium',
    textAlign: block.styles.textAlign || 'left',
    padding: block.styles.padding || '0.5rem',
    margin: block.styles.margin || '0',
    backgroundColor: block.styles.backgroundColor || 'transparent',
    borderRadius: block.styles.borderRadius || '0.25rem',
  };

  if (isEditing && isEditingText) {
    return (
      <div className="w-full h-full">
        <textarea
          value={tempText}
          onChange={(e) => setTempText(e.target.value)}
          onBlur={handleSaveText}
          onKeyDown={handleKeyDown}
          className="w-full h-full p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full relative group">
      {React.createElement(
        HeadingTag,
        {
          style: styles,
          className: "w-full h-full cursor-pointer",
          onClick: () => isEditing && setIsEditingText(true)
        },
        block.content.text || 'Nový nadpis'
      )}

      {/* Level Selector */}
      {isEditing && (
        <div className="absolute -top-8 left-0 bg-white border border-gray-200 rounded shadow-md p-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex space-x-1">
            {[1, 2, 3].map((lvl) => (
              <button
                key={lvl}
                onClick={() => handleLevelChange(lvl)}
                className={`px-2 py-1 text-xs rounded ${
                  level === lvl
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                H{lvl}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}