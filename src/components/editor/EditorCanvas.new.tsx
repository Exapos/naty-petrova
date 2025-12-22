'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DocumentTextIcon,
  PhotoIcon,
  RectangleStackIcon,
  VideoCameraIcon,
  TableCellsIcon,
  MinusIcon,
  MapIcon,
  PhoneIcon,
  StarIcon,
  CursorArrowRaysIcon,
} from '@heroicons/react/24/outline';
import { BlockType, LayoutType } from '@/types/editor';

interface BlockTemplate {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  blockType: BlockType;
  layoutType?: LayoutType;
  category: 'basic' | 'media' | 'layout' | 'advanced';
}

const blockTemplates: BlockTemplate[] = [
  // Basic blocks
  {
    id: 'text',
    name: 'Text',
    icon: DocumentTextIcon,
    description: 'Prostý odstavec textu',
    blockType: 'text',
    category: 'basic',
  },
  {
    id: 'heading',
    name: 'Nadpis',
    icon: DocumentTextIcon,
    description: 'H1, H2 nebo H3 nadpis',
    blockType: 'heading',
    category: 'basic',
  },
  {
    id: 'divider',
    name: 'Oddělovač',
    icon: MinusIcon,
    description: 'Vizuální oddělení sekcí',
    blockType: 'divider',
    category: 'basic',
  },

  // Media blocks
  {
    id: 'image',
    name: 'Obrázek',
    icon: PhotoIcon,
    description: 'Jeden obrázek s popiskem',
    blockType: 'image',
    category: 'media',
  },
  {
    id: 'gallery',
    name: 'Galerie',
    icon: RectangleStackIcon,
    description: 'Více obrázků v galerii',
    blockType: 'gallery',
    category: 'media',
  },
  {
    id: 'video',
    name: 'Video',
    icon: VideoCameraIcon,
    description: 'YouTube nebo Vimeo video',
    blockType: 'video',
    category: 'media',
  },

  // Layout blocks
  {
    id: 'layout-50-50',
    name: 'Obrázek + Text (50/50)',
    icon: PhotoIcon,
    description: 'Dva sloupce stejné šířky',
    blockType: 'layout',
    layoutType: 'two-column-equal',
    category: 'layout',
  },
  {
    id: 'layout-30-70',
    name: 'Obrázek vlevo + Text',
    icon: PhotoIcon,
    description: 'Malý obrázek, velký text (30/70)',
    blockType: 'layout',
    layoutType: 'two-column-right',
    category: 'layout',
  },
  {
    id: 'layout-70-30',
    name: 'Text + Obrázek vpravo',
    icon: PhotoIcon,
    description: 'Velký text, malý obrázek (70/30)',
    blockType: 'layout',
    layoutType: 'two-column-left',
    category: 'layout',
  },
  {
    id: 'layout-33-33-33',
    name: '3 sloupce',
    icon: TableCellsIcon,
    description: 'Tři stejné sloupce (33/33/33)',
    blockType: 'layout',
    layoutType: 'three-column',
    category: 'layout',
  },

  // Advanced blocks
  {
    id: 'table',
    name: 'Tabulka',
    icon: TableCellsIcon,
    description: 'Datová tabulka',
    blockType: 'table',
    category: 'advanced',
  },
  {
    id: 'map',
    name: 'Mapa',
    icon: MapIcon,
    description: 'Interaktivní mapa',
    blockType: 'map',
    category: 'advanced',
  },
  {
    id: 'contact',
    name: 'Kontakt',
    icon: PhoneIcon,
    description: 'Kontaktní formulář',
    blockType: 'contact',
    category: 'advanced',
  },
  {
    id: 'button',
    name: 'Tlačítko',
    icon: CursorArrowRaysIcon,
    description: 'Klikatelné tlačítko',
    blockType: 'button',
    category: 'advanced',
  },
  {
    id: 'reference',
    name: 'Reference',
    icon: StarIcon,
    description: 'Naše reference/projekty',
    blockType: 'reference',
    category: 'advanced',
  },
];

const categories = [
  { id: 'basic', name: 'Základní' },
  { id: 'media', name: 'Média' },
  { id: 'layout', name: 'Layouty' },
  { id: 'advanced', name: 'Pokročilé' },
];

interface TempProps {
  onSelectBlock: (blockType: BlockType, layoutType?: LayoutType) => void;
  onClose?: () => void;
}

export function Temp({ onSelectBlock, onClose }: TempProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('basic');

  const filteredBlocks = blockTemplates.filter(
    (block) => block.category === selectedCategory
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <h3 className="text-lg font-semibold text-gray-900">
          Vyberte typ bloku
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Přidejte obsah do vašeho článku
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50 px-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              selectedCategory === category.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Block grid */}
      <div className="p-6 max-h-96 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
          {filteredBlocks.map((block) => {
            const Icon = block.icon;
            return (
              <motion.button
                key={block.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onSelectBlock(block.blockType, block.layoutType);
                  onClose?.();
                }}
                className="flex flex-col items-start p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all text-left group"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <div className="font-medium text-gray-900 mb-1">
                  {block.name}
                </div>
                <div className="text-xs text-gray-500">
                  {block.description}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          💡 Tip: Klikněte na [+] mezi bloky pro rychlé přidání
        </p>
      </div>
    </motion.div>
  );
}