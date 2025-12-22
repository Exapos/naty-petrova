'use client';

import React, { useState, useRef } from 'react';
import { Block } from '@/types/editor';
import { useEditorStore } from '@/stores/editorStore';
import { PhotoIcon, CloudArrowUpIcon, LinkIcon } from '@heroicons/react/24/outline';

interface ImageBlockProps {
  block: Block;
  isEditing: boolean;
  onUpdate?: (block: Block) => void;
}

export function ImageBlock({ block, isEditing, onUpdate }: ImageBlockProps) {
  const { updateBlock: storeUpdateBlock } = useEditorStore();

  const updateBlock = (id: string, updates: Partial<Block>) => {
    if (onUpdate) {
      onUpdate({ ...block, ...updates });
    } else {
      storeUpdateBlock(id, updates);
    }
  };
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [tempUrl, setTempUrl] = useState(block.content.src || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUrlChange = (newUrl: string) => {
    updateBlock(block.id, {
      content: { ...block.content, src: newUrl },
    });
  };

  const handleSaveUrl = () => {
    handleUrlChange(tempUrl);
    setIsEditingUrl(false);
    setShowMenu(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/blog-image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        updateBlock(block.id, {
          content: { ...block.content, src: result.url },
        });
        setShowMenu(false);
      } else {
        alert(`Chyba při nahrávání: ${result.error}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Chyba při nahrávání souboru');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveUrl();
    } else if (e.key === 'Escape') {
      setTempUrl(block.content.src || '');
      setIsEditingUrl(false);
      setShowMenu(false);
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
      <div className="w-full h-full relative" style={styles}>
        <div
          className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
          onClick={() => isEditing && setShowMenu(true)}
        >
          <PhotoIcon className="w-12 h-12 text-gray-400 mb-2" />
          <p className="text-gray-500 text-sm">Klikněte pro přidání obrázku</p>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Menu for image selection */}
        {isEditing && showMenu && (
          <div className="absolute inset-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">Přidat obrázek</h3>
            </div>
            <div className="p-2 space-y-1">
              <button
                onClick={() => {
                  fileInputRef.current?.click();
                }}
                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <CloudArrowUpIcon className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Nahrát soubor</div>
                  <div className="text-xs text-gray-500">Vyberte obrázek z počítače</div>
                </div>
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  setIsEditingUrl(true);
                }}
                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <LinkIcon className="w-5 h-5 text-green-500" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Z URL adresy</div>
                  <div className="text-xs text-gray-500">Vložte odkaz na obrázek</div>
                </div>
              </button>
            </div>
            <div className="p-2 border-t border-gray-200">
              <button
                onClick={() => setShowMenu(false)}
                className="w-full p-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Zrušit
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (isEditing && isEditingUrl) {
    return (
      <div className="w-full h-full p-4 bg-white border border-gray-200 rounded-lg shadow-lg">
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL obrázku
          </label>
          <input
            type="url"
            value={tempUrl}
            onChange={(e) => setTempUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/image.jpg"
            autoFocus
          />
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleSaveUrl}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
          >
            Uložit
          </button>
          <button
            onClick={() => {
              setTempUrl(block.content.src || '');
              setIsEditingUrl(false);
            }}
            className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
          >
            Zrušit
          </button>
        </div>
      </div>
    );
  }

  const imageStyles = {
    width: block.styles.width || '100%',
    height: block.styles.height || 'auto',
    objectFit: (block.styles.objectFit || 'cover') as any,
    filter: block.styles.filter || 'none',
    transform: `rotate(${block.styles.rotate || '0deg'})`,
    opacity: block.styles.opacity || 1,
    borderRadius: block.styles.borderRadius || '0.25rem',
  };

  return (
    <div className="w-full h-full relative group" style={styles}>
      <div className="relative w-full h-full flex items-center justify-center">
        <img
          src={block.content.src}
          alt={block.content.alt || ''}
          style={imageStyles}
          className="max-w-full max-h-full object-cover transition-all duration-200"
        />
      </div>

      {block.content.caption && (
        <p className="mt-2 text-sm text-gray-600 text-center italic">
          {block.content.caption}
        </p>
      )}

      {/* Edit Overlay */}
      {isEditing && (
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditingUrl(true);
            }}
            className="opacity-0 group-hover:opacity-100 bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-medium shadow-lg transition-opacity hover:bg-gray-100"
          >
            Změnit obrázek
          </button>
        </div>
      )}
    </div>
  );
}