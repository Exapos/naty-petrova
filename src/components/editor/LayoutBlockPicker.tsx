'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface LayoutBlockPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBlock: (blockType: string, layoutType?: string) => void;
  columnIndex: number;
}

const blockTypes = [
  { type: 'text', name: 'Text', icon: '📝' },
  { type: 'heading', name: 'Nadpis', icon: '📋' },
  { type: 'image', name: 'Obrázek', icon: '🖼️' },
  { type: 'gallery', name: 'Galerie', icon: '🖼️' },
  { type: 'video', name: 'Video', icon: '🎥' },
  { type: 'button', name: 'Tlačítko', icon: '🔘' },
  { type: 'contact', name: 'Kontakt', icon: '📞' },
  { type: 'reference', name: 'Reference', icon: '⭐' },
  { type: 'map', name: 'Mapa', icon: '🗺️' },
  { type: 'divider', name: 'Oddělovač', icon: '➖' },
  { type: 'icon', name: 'Ikona', icon: '🔸' },
  { type: 'table', name: 'Tabulka', icon: '📊' },
];

export function LayoutBlockPicker({ isOpen, onClose, onAddBlock, columnIndex }: LayoutBlockPickerProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-2xl m-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Přidat blok do sloupce {columnIndex + 1}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Block Types Grid */}
          <div className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {blockTypes.map((blockType) => (
                <motion.button
                  key={blockType.type}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onAddBlock(blockType.type);
                    onClose();
                  }}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                >
                  <span className="text-2xl">{blockType.icon}</span>
                  <span className="font-medium text-gray-900">{blockType.name}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              Zrušit
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

