'use client';

import React from 'react';
import { useEditorStore } from '@/stores/editorStore';
import { EyeIcon, PencilIcon } from '@heroicons/react/24/outline';

export function PreviewToggle() {
  const { isPreviewMode, setPreviewMode } = useEditorStore();

  return (
    <button
      onClick={() => setPreviewMode(!isPreviewMode)}
      className={`
        flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors
        ${isPreviewMode
          ? 'bg-blue-600 text-white hover:bg-blue-700'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }
      `}
      title={isPreviewMode ? 'Přepnout do režimu úprav' : 'Přepnout do náhledu'}
    >
      {isPreviewMode ? (
        <>
          <PencilIcon className="w-4 h-4" />
          <span>Upravit</span>
        </>
      ) : (
        <>
          <EyeIcon className="w-4 h-4" />
          <span>Náhled</span>
        </>
      )}
    </button>
  );
}