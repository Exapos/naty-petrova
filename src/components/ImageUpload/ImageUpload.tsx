'use client';

import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import Image from 'next/image';
import {
  CloudArrowUpIcon,
  PhotoIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  maxSize?: number; // in MB
  accept?: string[];
  disabled?: boolean;
}

export default function ImageUpload({
  value,
  onChange,
  onRemove,
  maxSize = 5,
  accept = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  disabled = false,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const validateFile = (file: File): string | null => {
    // Kontrola typu souboru
    if (!accept.includes(file.type)) {
      return `Nepodporovaný typ souboru. Povolené typy: ${accept.join(', ')}`;
    }

    // Kontrola velikosti
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `Soubor je příliš velký. Maximální velikost je ${maxSize}MB`;
    }

    return null;
  };

  const handleFileUpload = async (file: File) => {
    setError(null);

    // Validace souboru
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Chyba při nahrávání obrázku');
      }

      const result = await response.json();
      onChange(result.url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!value || !onRemove) return;

    try {
      // Pokud je to náš nahraný obrázek, pokusíme se ho smazat ze serveru
      if (value.startsWith('/uploads/references/')) {
        const fileName = value.split('/').pop();
        if (fileName) {
          await fetch(`/api/upload/image?fileName=${fileName}`, {
            method: 'DELETE',
          });
        }
      }
      
      onRemove();
    } catch (error) {
      console.error('Error removing image:', error);
      // I když se nepodaří smazat ze serveru, odebereme z formuláře
      onRemove();
    }
  };

  const openFileDialog = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-4">
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
          {error}
          <button 
            onClick={() => setError(null)}
            className="float-right text-red-700 hover:text-red-900 ml-2"
          >
            ×
          </button>
        </div>
      )}

      {/* Current image preview */}
      {value && (
        <div className="relative">
          <div className="relative w-full h-48 rounded-lg border border-gray-200 overflow-hidden">
            <Image
              src={value}
              alt="Náhled obrázku"
              fill
              className="object-cover"
              unoptimized={value.startsWith('http')} // Pro externí URL použij unoptimized
            />
          </div>
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            title="Odebrat obrázek"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Upload area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragging 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${isUploading ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept.join(',')}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />

        <div className="space-y-3">
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-600">Nahrávání obrázku...</p>
            </>
          ) : (
            <>
              <div className="mx-auto h-12 w-12 text-gray-400">
                {isDragging ? (
                  <CloudArrowUpIcon />
                ) : (
                  <PhotoIcon />
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-blue-600 hover:text-blue-500">
                    Klikněte pro výběr
                  </span>
                  {' nebo přetáhněte obrázek sem'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Podporované formáty: {accept.map(type => type.split('/')[1].toUpperCase()).join(', ')}
                </p>
                <p className="text-xs text-gray-500">
                  Maximální velikost: {maxSize}MB
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}