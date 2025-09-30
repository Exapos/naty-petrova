'use client';

import React, { useState } from 'react';
import { Block } from '@/types/editor';
import { useEditorStore } from '@/stores/editorStore';

interface TextBlockProps {
  block: Block;
  isEditing: boolean;
}

export function TextBlock({ block, isEditing }: TextBlockProps) {
  const { updateBlock } = useEditorStore();
  const [isEditingText, setIsEditingText] = useState(false);
  const [tempText, setTempText] = useState(block.content.text || 'Zde zadejte text...');

  const handleTextChange = (newText: string) => {
    updateBlock(block.id, {
      content: { ...block.content, text: newText },
    });
  };

  const handleSaveText = () => {
    handleTextChange(tempText);
    setIsEditingText(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleSaveText();
    } else if (e.key === 'Escape') {
      setTempText(block.content.text || 'Zde zadejte text...');
      setIsEditingText(false);
    }
  };

  const styles = {
    color: block.styles.textColor || '#374151',
    fontSize: block.styles.fontSize || '1rem',
    fontWeight: block.styles.fontWeight || 'normal',
    textAlign: block.styles.textAlign || 'left',
    padding: block.styles.padding || '0.5rem',
    margin: block.styles.margin || '0',
    backgroundColor: block.styles.backgroundColor || 'transparent',
    borderRadius: block.styles.borderRadius || '0.25rem',
    lineHeight: '1.6',
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
          placeholder="Zde zadejte text..."
          autoFocus
        />
        <div className="text-xs text-gray-500 mt-1">
          Ctrl+Enter pro uložení, Escape pro zrušení
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full cursor-pointer"
      style={styles}
      onClick={() => isEditing && setIsEditingText(true)}
    >
      {block.content.text || 'Zde zadejte text...'}
    </div>
  );
}