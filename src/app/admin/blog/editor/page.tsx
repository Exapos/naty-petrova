'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  EyeIcon,
  CloudArrowUpIcon,
  ShareIcon,
  PlusIcon,
  Cog6ToothIcon,
  Squares2X2Icon,
  PaintBrushIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  DeviceTabletIcon,
} from '@heroicons/react/24/outline';
import { EditorCanvas } from '@/components/editor/EditorCanvas';
import { DragMenu } from '@/components/editor/DragMenu';
import { useEditorStore } from '@/stores/editorStore';

export default function BlogEditorPage() {
  const { undo, redo, saveDraft, publishArticle, exportToJSON, addSection, addRow, addColumn, addBlock, moveBlock, sections, selectedColumn, selectedRow, selectedSection, isPreviewMode, setPreviewMode } = useEditorStore();
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [responsiveMode, setResponsiveMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Keyboard shortcuts
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case 'z':
          if (event.shiftKey) {
            event.preventDefault();
            redo();
          } else {
            event.preventDefault();
            undo();
          }
          break;
        case 'y':
          event.preventDefault();
          redo();
          break;
      }
    }

    if (event.key === 'Delete' || event.key === 'Backspace') {
      // Handle delete selected block
      const { selectedBlock, deleteBlock } = useEditorStore.getState();
      if (selectedBlock) {
        deleteBlock(selectedBlock);
      }
    }
  }, [undo, redo]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleDragStart = () => {
    // Handle drag start if needed
  };

  const handleDragOver = () => {
    // Handle drag over for snap-to-grid logic
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    // Handle dropping new blocks
    if (active.data.current?.type === 'new-block') {
      const blockType = active.data.current.blockType;

      // Get target from drop zone data
      let targetSectionId: string | null = null;
      let targetRowId: string | null = null;
      let targetColumnId: string | null = null;

      if (over.data.current?.type === 'column') {
        // Dropped directly on a column
        targetSectionId = over.data.current.sectionId;
        targetRowId = over.data.current.rowId;
        targetColumnId = over.data.current.columnId;
      } else if (over.id === 'canvas') {
        // Dropped on canvas - use selected or first available
        if (selectedColumn && selectedRow && selectedSection) {
          targetSectionId = selectedSection;
          targetRowId = selectedRow;
          targetColumnId = selectedColumn;
        } else if (sections.length > 0) {
          // Use last section's last row's last column
          const lastSection = sections[sections.length - 1];
          if (lastSection.rows.length > 0) {
            const lastRow = lastSection.rows[lastSection.rows.length - 1];
            if (lastRow.columns.length > 0) {
              targetSectionId = lastSection.id;
              targetRowId = lastRow.id;
              targetColumnId = lastRow.columns[lastRow.columns.length - 1].id;
            }
          }
        }
      }

      // If no valid target found, create new structure
      if (!targetSectionId || !targetRowId || !targetColumnId) {
        if (sections.length === 0) {
          // Create first section (this will automatically create row and column)
          addSection();
          // Don't add block yet - user can try dropping again
          return;
        } else {
          // Use the first available column from existing sections
          const firstSection = sections[0];
          if (firstSection.rows.length > 0) {
            const firstRow = firstSection.rows[0];
            if (firstRow.columns.length > 0) {
              targetSectionId = firstSection.id;
              targetRowId = firstRow.id;
              targetColumnId = firstRow.columns[0].id;
            }
          }
        }
      }

      if (targetSectionId && targetRowId && targetColumnId) {
        // Add new block to the target column
        addBlock(targetSectionId, targetRowId, targetColumnId, {
          type: blockType,
          content: getDefaultContent(blockType),
          styles: getDefaultStyles(),
          responsive: {
            desktop: getDefaultStyles(),
            tablet: getDefaultStyles(),
            mobile: getDefaultStyles(),
          },
        });
      }
    }

    // Handle moving existing blocks between columns
    if (active.data.current?.type === 'block') {
      if (over.data.current?.type === 'column') {
        const sourceBlockId = active.data.current.block.id;
        const targetSectionId = over.data.current.sectionId;
        const targetRowId = over.data.current.rowId;
        const targetColumnId = over.data.current.columnId;

        // Move block to new column
        moveBlock(sourceBlockId, targetSectionId, targetRowId, targetColumnId);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">N</span>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Nový článek</h1>
                  <p className="text-sm text-gray-500">Upravujete obsah</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Undo/Redo */}
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={undo}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-md transition-colors"
                  title="Vrátit zpět (Ctrl+Z)"
                >
                  <ArrowUturnLeftIcon className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={redo}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-md transition-colors"
                  title="Znovu (Ctrl+Y)"
                >
                  <ArrowUturnRightIcon className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Responsive Controls */}
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setResponsiveMode('desktop')}
                  className={`p-2 rounded-md transition-colors ${
                    responsiveMode === 'desktop'
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="Desktop"
                >
                  <ComputerDesktopIcon className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setResponsiveMode('tablet')}
                  className={`p-2 rounded-md transition-colors ${
                    responsiveMode === 'tablet'
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="Tablet"
                >
                  <DeviceTabletIcon className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setResponsiveMode('mobile')}
                  className={`p-2 rounded-md transition-colors ${
                    responsiveMode === 'mobile'
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="Mobil"
                >
                  <DevicePhoneMobileIcon className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Preview Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPreviewMode(!isPreviewMode)}
                className={`p-2 rounded-lg transition-colors ${
                  isPreviewMode
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                title={isPreviewMode ? 'Upravit' : 'Náhled'}
              >
                <EyeIcon className="w-4 h-4" />
              </motion.button>

              {/* Settings */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-lg transition-colors ${
                  showSettings
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                title="Nastavení"
              >
                <Cog6ToothIcon className="w-4 h-4" />
              </motion.button>

              {/* Export */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const data = exportToJSON();
                  const blob = new Blob([data], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'article.json';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Exportovat"
              >
                <ShareIcon className="w-4 h-4" />
              </motion.button>

              {/* Save Draft */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={saveDraft}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium text-sm"
              >
                <CloudArrowUpIcon className="w-4 h-4 inline mr-2" />
                Uložit
              </motion.button>

              {/* Publish */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={publishArticle}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all font-medium text-sm shadow-lg hover:shadow-xl"
              >
                <ShareIcon className="w-4 h-4 inline mr-2" />
                Publikovat
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-8">
            {/* Canvas */}
            <div className="flex-1">
              <EditorCanvas />
            </div>

            {/* Right Sidebar */}
            <AnimatePresence>
              {!isPreviewMode && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="w-80 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden"
                >
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Squares2X2Icon className="w-5 h-5 mr-2 text-blue-500" />
                      Bloky
                    </h3>
                    <DragMenu />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </DndContext>
      </div>

      {/* Floating Add Button */}
      <AnimatePresence>
        {!isPreviewMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-8 right-8 z-40"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl flex items-center justify-center"
            >
              <PlusIcon className="w-6 h-6" />
            </motion.button>

            {/* Add Menu */}
            <AnimatePresence>
              {showAddMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 10 }}
                  className="absolute bottom-16 right-0 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 min-w-48"
                >
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        addSection();
                        setShowAddMenu(false);
                      }}
                      className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <PlusIcon className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Sekce</div>
                        <div className="text-sm text-gray-500">Přidat novou sekci</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        const { sections, addRow } = useEditorStore.getState();
                        if (sections.length > 0) {
                          addRow(sections[0].id);
                          setShowAddMenu(false);
                        }
                      }}
                      className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <PaintBrushIcon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Řádek</div>
                        <div className="text-sm text-gray-500">Přidat řádek do sekce</div>
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-96 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Nastavení článku</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Název článku
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Zadejte název článku"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Popis
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                      placeholder="Zadejte popis článku"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Zrušit
                  </button>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Uložit
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper functions
function getDefaultContent(type: string) {
  switch (type) {
    case 'heading':
      return { text: 'Nový nadpis', level: 1 };
    case 'text':
      return { text: 'Zde zadejte text...' };
    case 'image':
      return { src: '', alt: '', caption: '' };
    case 'gallery':
      return { images: [] };
    case 'video':
      return { src: '', type: 'youtube' };
    case 'button':
      return { text: 'Tlačítko', url: '', style: 'primary' };
    case 'contact':
      return { title: 'Kontaktujte nás', showForm: true };
    case 'reference':
      return { title: 'Naše reference', projects: [] };
    case 'map':
      return { latitude: 50.0755, longitude: 14.4378, zoom: 12 };
    case 'divider':
      return { style: 'solid', thickness: '1px', color: '#e5e7eb', width: '100%' };
    case 'icon':
      return { icon: 'star', size: '48px', color: '#1f2937' };
    case 'table':
      return {
        rows: [
          ['Nadpis 1', 'Nadpis 2', 'Nadpis 3'],
          ['Řádek 1', 'Data 1', 'Data 2'],
          ['Řádek 2', 'Data 3', 'Data 4'],
        ],
        hasHeader: true,
        borderStyle: 'border',
        cellPadding: '8px',
      };
    default:
      return {};
  }
}

function getDefaultStyles() {
  return {
    backgroundColor: 'transparent',
    textColor: '#1f2937',
    padding: '1rem',
    margin: '0',
    borderRadius: '0.5rem',
  };
}