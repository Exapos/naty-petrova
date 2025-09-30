'use client';

import React from 'react';
import { useEditorStore } from '@/stores/editorStore';
import { ArrowUturnLeftIcon, ArrowUturnRightIcon } from '@heroicons/react/24/outline';

export function HistoryPanel() {
  const { undo, redo, history, historyIndex } = useEditorStore();

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <div className="p-4 border-b border-gray-200">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Historie změn</h3>

      <div className="flex space-x-2">
        <button
          onClick={undo}
          disabled={!canUndo}
          className={`
            flex items-center space-x-1 px-3 py-2 rounded text-sm transition-colors
            ${canUndo
              ? 'bg-blue-100 hover:bg-blue-200 text-blue-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }
          `}
          title="Vrátit zpět (Ctrl+Z)"
        >
          <ArrowUturnLeftIcon className="w-4 h-4" />
          <span>Zpět</span>
        </button>

        <button
          onClick={redo}
          disabled={!canRedo}
          className={`
            flex items-center space-x-1 px-3 py-2 rounded text-sm transition-colors
            ${canRedo
              ? 'bg-blue-100 hover:bg-blue-200 text-blue-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }
          `}
          title="Znovu (Ctrl+Y)"
        >
          <ArrowUturnRightIcon className="w-4 h-4" />
          <span>Znovu</span>
        </button>
      </div>

      <div className="mt-3 text-xs text-gray-500">
        Krok: {historyIndex + 1} / {history.length}
      </div>
    </div>
  );
}