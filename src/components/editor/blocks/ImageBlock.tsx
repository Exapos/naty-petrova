'use client';

import React, { useState } from 'react';
import { Block } from '@/types/editor';
import { useEditorStore } from '@/stores/editorStore';
import { PhotoIcon } from '@heroicons/react/24/outline';

interface ImageBlockProps {
  block: Block;
  isEditing: boolean;
}

export function ImageBlock({ block, isEditing }: ImageBlockProps) {
  const { updateBlock } = useEditorStore();
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [tempUrl, setTempUrl] = useState(block.content.src || '');

  const handleUrlChange = (newUrl: string) => {
    updateBlock(block.id, {
      content: { ...block.content, src: newUrl },
    });
  };

  const handleSaveUrl = () => {
    handleUrlChange(tempUrl);
    setIsEditingUrl(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveUrl();
    } else if (e.key === 'Escape') {
      setTempUrl(block.content.src || '');
      setIsEditingUrl(false);
    }
  };

  const styles = {
    padding: block.styles.padding || '0.5rem',
    margin: block.styles.margin || '0',
    backgroundColor: block.styles.backgroundColor || 'transparent',
    borderRadius: block.styles.borderRadius || '0.25rem',
  };

  if (!block.content.src) {
    return (
      <div
        className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
        style={styles}
        onClick={() => isEditing && setIsEditingUrl(true)}
      >
        <PhotoIcon className="w-12 h-12 text-gray-400 mb-2" />
        <p className="text-gray-500 text-sm">Klikněte pro přidání obrázku</p>
        {isEditing && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditingUrl(true);
            }}
            className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
          >
            Přidat URL
          </button>
        )}
      </div>
    );
  }

  if (isEditing && isEditingUrl) {
    return (
      <div className="w-full h-full p-4">
        <input
          type="url"
          value={tempUrl}
          onChange={(e) => setTempUrl(e.target.value)}
          onBlur={handleSaveUrl}
          onKeyDown={handleKeyDown}
          className="w-full p-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Vložte URL obrázku..."
          autoFocus
        />
        <button
          onClick={handleSaveUrl}
          className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
        >
          Uložit
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative group" style={styles}>
      <img
        src={block.content.src}
        alt={block.content.alt || ''}
        className="w-full h-full object-cover rounded"
        onClick={() => isEditing && setIsEditingUrl(true)}
      />

      {block.content.caption && (
        <p className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-sm p-2 rounded-b">
          {block.content.caption}
        </p>
      )}

      {/* Edit Overlay */}
      {isEditing && (
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded flex items-center justify-center">
          <button
            onClick={() => setIsEditingUrl(true)}
            className="opacity-0 group-hover:opacity-100 bg-white text-gray-900 px-3 py-1 rounded text-sm transition-opacity"
          >
            Upravit obrázek
          </button>
        </div>
      )}
    </div>
  );
}