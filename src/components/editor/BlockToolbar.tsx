'use client';

import React, { useState } from 'react';
import { useEditorStore } from '@/stores/editorStore';
import {
  TrashIcon,
  ArrowPathIcon,
  SwatchIcon,
  PaintBrushIcon,
  AdjustmentsHorizontalIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export function BlockToolbar() {
  const {
    selectedBlock,
    deleteBlock,
    duplicateBlock,
    isPreviewMode,
    updateBlock,
    getBlockById,
    customColors,
    addCustomColor
  } = useEditorStore();

  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'spacing' | 'alignment'>('colors');

  if (!selectedBlock || isPreviewMode) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 border-b border-gray-200"
      >
        <p className="text-sm text-gray-500">Vyberte blok pro úpravu</p>
      </motion.div>
    );
  }

  const block = getBlockById(selectedBlock);
  if (!block) return null;

  const handleStyleChange = (key: string, value: string) => {
    updateBlock(selectedBlock, {
      styles: { ...block.styles, [key]: value },
    });
  };

  const tabs = [
    { id: 'colors', label: 'Barvy', icon: SwatchIcon },
    { id: 'typography', label: 'Typografie', icon: PaintBrushIcon },
    { id: 'spacing', label: 'Rozměry', icon: AdjustmentsHorizontalIcon },
    { id: 'alignment', label: 'Zarovnání', icon: Bars3Icon },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-4 border-b border-gray-200"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-900">Vlastnosti bloku</h3>
      </div>

      {/* Quick Actions */}
      <div className="flex space-x-2 mb-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => duplicateBlock(selectedBlock)}
          className="flex items-center space-x-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors shadow-sm"
          title="Duplikovat blok"
        >
          <ArrowPathIcon className="w-4 h-4" />
          <span>Duplikovat</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => deleteBlock(selectedBlock)}
          className="flex items-center space-x-1 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm transition-colors shadow-sm"
          title="Smazat blok"
        >
          <TrashIcon className="w-4 h-4" />
          <span>Smazat</span>
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-4 bg-gray-100 p-1 rounded-xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === 'colors' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Barva pozadí
              </label>
              <div className="flex space-x-2">
                <input
                  type="color"
                  value={block.styles.backgroundColor || '#ffffff'}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                  className="w-8 h-8 border border-gray-300 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={block.styles.backgroundColor || '#ffffff'}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded-lg text-sm"
                  placeholder="#ffffff"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Barva textu
              </label>
              <div className="flex space-x-2">
                <input
                  type="color"
                  value={block.styles.textColor || '#1f2937'}
                  onChange={(e) => handleStyleChange('textColor', e.target.value)}
                  className="w-8 h-8 border border-gray-300 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={block.styles.textColor || '#1f2937'}
                  onChange={(e) => handleStyleChange('textColor', e.target.value)}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded-lg text-sm"
                  placeholder="#1f2937"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Vlastní paleta
              </label>
              <div className="grid grid-cols-6 gap-2">
                {customColors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => handleStyleChange('textColor', color)}
                    className="w-6 h-6 rounded-lg border-2 border-white shadow-sm"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
                <button
                  onClick={() => addCustomColor(block.styles.textColor || '#1f2937')}
                  className="w-6 h-6 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-gray-400"
                  title="Přidat barvu"
                >
                  +
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'typography' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Velikost písma
              </label>
              <input
                type="text"
                value={block.styles.fontSize || '16px'}
                onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded-lg text-sm"
                placeholder="16px"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Tloušťka písma
              </label>
              <select
                value={block.styles.fontWeight || 'normal'}
                onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded-lg text-sm"
              >
                <option value="normal">Normální</option>
                <option value="bold">Tučné</option>
                <option value="lighter">Lehčí</option>
                <option value="100">100</option>
                <option value="200">200</option>
                <option value="300">300</option>
                <option value="400">400</option>
                <option value="500">500</option>
                <option value="600">600</option>
                <option value="700">700</option>
                <option value="800">800</option>
                <option value="900">900</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Výška řádku
              </label>
              <input
                type="text"
                value={block.styles.lineHeight || '1.5'}
                onChange={(e) => handleStyleChange('lineHeight', e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded-lg text-sm"
                placeholder="1.5"
              />
            </div>
          </motion.div>
        )}

        {activeTab === 'spacing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Padding
              </label>
              <input
                type="text"
                value={block.styles.padding || '1rem'}
                onChange={(e) => handleStyleChange('padding', e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded-lg text-sm"
                placeholder="1rem"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Margin
              </label>
              <input
                type="text"
                value={block.styles.margin || '0'}
                onChange={(e) => handleStyleChange('margin', e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded-lg text-sm"
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Border Radius
              </label>
              <input
                type="text"
                value={block.styles.borderRadius || '0.5rem'}
                onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded-lg text-sm"
                placeholder="0.5rem"
              />
            </div>
          </motion.div>
        )}

        {activeTab === 'alignment' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Zarovnání textu
              </label>
              <div className="flex space-x-1">
                {[
                  { value: 'left', label: 'Vlevo', icon: '⬅️' },
                  { value: 'center', label: 'Na střed', icon: '⬌' },
                  { value: 'right', label: 'Vpravo', icon: '➡️' },
                ].map((align) => (
                  <button
                    key={align.value}
                    onClick={() => handleStyleChange('textAlign', align.value)}
                    className={`flex-1 px-2 py-2 rounded-lg text-xs transition-all ${
                      block.styles.textAlign === align.value
                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                    title={align.label}
                  >
                    {align.icon}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}