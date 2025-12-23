'use client';

import React from 'react';
import { Editor } from '@tiptap/react';
import {
  PlusIcon,
  Bars3Icon,
  PhotoIcon,
  TableCellsIcon,
  CodeBracketIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface FloatingMenuContentProps {
  editor: Editor;
}

export const FloatingMenuContent: React.FC<FloatingMenuContentProps> = ({ editor }) => {
  const [showMore, setShowMore] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="floating-menu flex flex-col gap-1 bg-white border border-gray-200 rounded-lg shadow-lg p-1"
    >
      {/* Main buttons */}
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded-md transition-colors flex items-center gap-2 text-sm ${
          editor.isActive('heading', { level: 1 })
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        title="Nadpis 1"
      >
        <span className="font-bold">H1</span>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded-md transition-colors flex items-center gap-2 text-sm ${
          editor.isActive('bulletList')
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        title="Odrážkový seznam"
      >
        <Bars3Icon className="w-4 h-4" />
      </button>

      <button
        onClick={() => {
          const url = prompt('Zadejte URL obrázku:');
          if (url) {
            editor.chain().focus().setImage({ src: url }).run();
          }
        }}
        className="p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm"
        title="Vložit obrázek"
      >
        <PhotoIcon className="w-4 h-4" />
      </button>

      {showMore && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="border-t border-gray-200 pt-1 flex flex-col gap-1"
        >
          <button
            onClick={() =>
              editor
                .chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run()
            }
            className="p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm"
            title="Vložit tabulku"
          >
            <TableCellsIcon className="w-4 h-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-2 rounded-md transition-colors flex items-center gap-2 text-sm ${
              editor.isActive('codeBlock')
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            title="Blok kódu"
          >
            <CodeBracketIcon className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      <button
        onClick={() => setShowMore(!showMore)}
        className="p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-center"
        title={showMore ? 'Skrýt' : 'Více'}
      >
        <PlusIcon className={`w-4 h-4 transition-transform ${showMore ? 'rotate-45' : ''}`} />
      </button>
    </motion.div>
  );
};
