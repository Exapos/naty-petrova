'use client';

import React, { useState } from 'react';
import { Block } from '@/types/editor';
import { useEditorStore } from '@/stores/editorStore';
import { RichTextEditor } from '../RichTextEditor';

interface TextBlockProps {
  block: Block;
  isEditing: boolean;
  onUpdate?: (block: Block) => void;
}

export function TextBlock({ block, isEditing, onUpdate }: TextBlockProps) {
  const { updateBlock: storeUpdateBlock } = useEditorStore();
  const [isEditingText, setIsEditingText] = useState(false);
  const [tempText, setTempText] = useState(block.content.text || 'Zde zadejte text...');

  const updateBlock = (id: string, updates: Partial<Block>) => {
    if (onUpdate) {
      onUpdate({ ...block, ...updates });
    } else {
      storeUpdateBlock(id, updates);
    }
  };

  const handleTextChange = (newText: string) => {
    updateBlock(block.id, {
      content: { ...block.content, text: newText },
    });
  };

  const handleSaveText = () => {
    handleTextChange(tempText);
    setIsEditingText(false);
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
      <div className="w-full h-full p-4 bg-white border border-gray-200 rounded-lg shadow-lg">
        <RichTextEditor
          value={tempText}
          onChange={setTempText}
          placeholder="Zde zadejte text..."
          className="w-full h-full"
        />
        <div className="flex justify-between items-center mt-2">
          <div className="text-xs text-gray-500">
            Ctrl+Enter pro uložení, Escape pro zrušení
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleSaveText}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
            >
              Uložit
            </button>
            <button
              onClick={() => {
                setTempText(block.content.text || 'Zde zadejte text...');
                setIsEditingText(false);
              }}
              className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
            >
              Zrušit
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full cursor-pointer"
      style={styles}
      onClick={() => {
        console.log('TextBlock clicked, isEditing:', isEditing);
        if (isEditing) {
          setIsEditingText(true);
        }
      }}
      dangerouslySetInnerHTML={{ 
        __html: block.content.text || '<p class="text-gray-400">Zde zadejte text...</p>' 
      }}
    />
  );
}