'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useEditorStore } from '@/stores/editorStore';
import {
  PhotoIcon,
  DocumentTextIcon,
  Squares2X2Icon,
  BookmarkIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export function GlobalStylesPanel() {
  const {
    globalStyles,
    updateGlobalStyles,
    stylePresets,
    saveStylePreset,
    loadStylePreset,
    deleteStylePreset,
    gridSize,
    setGridSize,
    showGrid,
    toggleGrid,
  } = useEditorStore();

  const [newPresetName, setNewPresetName] = useState('');
  const [activeTab, setActiveTab] = useState<'design' | 'presets' | 'grid'>('design');

  const handleStyleChange = (key: keyof typeof globalStyles, value: string | number) => {
    updateGlobalStyles({ [key]: value });
  };

  const handleSavePreset = () => {
    if (newPresetName.trim()) {
      saveStylePreset({
        name: newPresetName.trim(),
        colors: {
          primary: globalStyles.primaryColor,
          secondary: globalStyles.secondaryColor,
        },
        typography: {
          fontFamily: globalStyles.fontFamily,
          fontSize: globalStyles.fontSize,
        },
        spacing: globalStyles.spacingUnit,
        borderRadius: globalStyles.borderRadius,
      });
      setNewPresetName('');
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleStyleChange('logo', e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFontUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In real app, you'd upload to server and get font URL
      console.log('Font upload:', file.name);
    }
  };

  const tabs = [
    { id: 'design', label: 'Design', icon: Squares2X2Icon },
    { id: 'presets', label: 'Presety', icon: BookmarkIcon },
    { id: 'grid', label: 'Grid', icon: DocumentTextIcon },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4"
    >
      <h3 className="text-sm font-medium text-gray-900 mb-3">Globální styly</h3>

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
        {activeTab === 'design' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* Colors */}
            <div className="space-y-3">
              <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide">Barvy</h4>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-700">
                  Primární barva
                </label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    value={globalStyles.primaryColor}
                    onChange={(e) => handleStyleChange('primaryColor', e.target.value)}
                    className="w-8 h-8 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={globalStyles.primaryColor}
                    onChange={(e) => handleStyleChange('primaryColor', e.target.value)}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-700">
                  Sekundární barva
                </label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    value={globalStyles.secondaryColor}
                    onChange={(e) => handleStyleChange('secondaryColor', e.target.value)}
                    className="w-8 h-8 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={globalStyles.secondaryColor}
                    onChange={(e) => handleStyleChange('secondaryColor', e.target.value)}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Typography */}
            <div className="space-y-3">
              <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide">Typografie</h4>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-700">
                  Písmo
                </label>
                <select
                  value={globalStyles.fontFamily}
                  onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="Inter, sans-serif">Inter</option>
                  <option value="Roboto, sans-serif">Roboto</option>
                  <option value="Open Sans, sans-serif">Open Sans</option>
                  <option value="Lato, sans-serif">Lato</option>
                  <option value="Poppins, sans-serif">Poppins</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-700">
                  Velikost písma
                </label>
                <select
                  value={globalStyles.fontSize}
                  onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="14px">Malé (14px)</option>
                  <option value="16px">Střední (16px)</option>
                  <option value="18px">Velké (18px)</option>
                  <option value="20px">Extra velké (20px)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-700">
                  Brand font
                </label>
                <input
                  type="file"
                  accept=".ttf,.woff,.woff2"
                  onChange={handleFontUpload}
                  className="w-full text-xs file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>

            {/* Spacing & Layout */}
            <div className="space-y-3">
              <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide">Rozměry</h4>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-700">
                  Základní jednotka ({globalStyles.spacingUnit}px)
                </label>
                <input
                  type="range"
                  min="4"
                  max="16"
                  value={globalStyles.spacingUnit}
                  onChange={(e) => handleStyleChange('spacingUnit', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>4px</span>
                  <span>{globalStyles.spacingUnit}px</span>
                  <span>16px</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-700">
                  Border radius
                </label>
                <select
                  value={globalStyles.borderRadius}
                  onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="0">Žádný</option>
                  <option value="0.25rem">Malý (4px)</option>
                  <option value="0.5rem">Střední (8px)</option>
                  <option value="0.75rem">Velký (12px)</option>
                  <option value="1rem">Extra velký (16px)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-700">
                  Logo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="w-full text-xs file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {globalStyles.logo && (
                  <div className="mt-2">
                    <Image
                      src={globalStyles.logo}
                      alt="Logo"
                      width={64}
                      height={64}
                      className="object-contain border border-gray-200 rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'presets' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Nový preset
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  placeholder="Název presetu"
                  className="flex-1 px-2 py-1 border border-gray-300 rounded-lg text-sm"
                />
                <button
                  onClick={handleSavePreset}
                  disabled={!newPresetName.trim()}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Uložit
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Uložené presety
              </label>
              <div className="space-y-2">
                {stylePresets.map((preset) => (
                  <div key={preset.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div
                          className="w-4 h-4 rounded border border-gray-300"
                          style={{ backgroundColor: preset.colors.primary }}
                        />
                        <div
                          className="w-4 h-4 rounded border border-gray-300"
                          style={{ backgroundColor: preset.colors.secondary }}
                        />
                      </div>
                      <span className="text-sm font-medium">{preset.name}</span>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => loadStylePreset(preset.id)}
                        className="p-1 text-gray-600 hover:text-blue-600"
                        title="Načíst preset"
                      >
                        <PhotoIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteStylePreset(preset.id)}
                        className="p-1 text-gray-600 hover:text-red-600"
                        title="Smazat preset"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'grid' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="space-y-3">
              <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide">Grid systém</h4>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-700">
                  Velikost gridu
                </label>
                <div className="flex space-x-2">
                  {[8, 16, 32].map((size) => (
                    <button
                      key={size}
                      onClick={() => setGridSize(size as 8 | 16 | 32)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        gridSize === size
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {size}px
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showGrid}
                    onChange={toggleGrid}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs font-medium text-gray-700">Zobrazit grid</span>
                </label>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600">
                  <strong>Snap-to-grid:</strong> Bloky se automaticky přichytávají k gridu při přetahování.
                  Aktuální velikost: <strong>{gridSize}px</strong>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}