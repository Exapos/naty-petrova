'use client';

import React from 'react';
import { Editor } from '@tiptap/react';
import {
  BoldIcon,
  ItalicIcon,
  TrashIcon,
  ClipboardDocumentIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface BubbleMenuContentProps {
  editor: Editor;
}

export const BubbleMenuContent: React.FC<BubbleMenuContentProps> = ({ editor }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.15 }}
      className="bubble-menu flex gap-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2"
    >
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded-md transition-colors ${
          editor.isActive('bold')
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        title="Tučné"
      >
        <BoldIcon className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded-md transition-colors ${
          editor.isActive('italic')
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        title="Kurzíva"
      >
        <ItalicIcon className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-gray-200" />

      <button
        onClick={() => {
          const { state } = editor;
          const { from, to } = state.selection;
          const text = state.doc.textBetween(from, to);
          
          // Try modern Clipboard API first
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text)
              .then(() => {
                alert('Zkopírováno do schránky');
              })
              .catch((err) => {
                console.error('Clipboard writeText failed:', err);
                // Fallback to execCommand for browsers without Clipboard API support
                fallbackCopyToClipboard(text);
              });
          } else {
            // Fallback for older browsers
            fallbackCopyToClipboard(text);
          }
        }}
        className="p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
        title="Kopírovat"
      >
        <ClipboardDocumentIcon className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().deleteSelection().run()}
        className="p-2 rounded-md text-red-700 hover:bg-red-50 transition-colors"
        title="Smazat"
      >
        <TrashIcon className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

// Fallback copy function for browsers without Clipboard API
function fallbackCopyToClipboard(text: string): void {
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    if (successful) {
      alert('Zkopírováno do schránky');
    } else {
      console.error('execCommand copy failed');
      alert('Kopírování se nepodařilo');
    }
  } catch (err) {
    console.error('Fallback copy failed:', err);
    alert('Kopírování se nepodařilo');
  }
}
