'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  EyeIcon,
  CloudArrowUpIcon,
  ShareIcon,
  Cog6ToothIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  DeviceTabletIcon,
} from '@heroicons/react/24/outline';
import { EditorCanvas } from '@/components/editor/EditorCanvas';
import { OutlinePanel } from '@/components/editor/OutlinePanel';
import { InspectorPanel } from '@/components/editor/InspectorPanel';
import { useEditorStore } from '@/stores/editorStore';

export default function BlogEditorPage() {
  const searchParams = useSearchParams();
  const postId = searchParams.get('id');
  const [loadingPost, setLoadingPost] = useState(!!postId);
  const {
    undo,
    redo,
    saveDraft,
    publishArticle,
    exportToJSON,
    reorderBlocks,
    isPreviewMode,
    setPreviewMode,
    responsiveMode,
    setResponsiveMode,
    isSaving,
    lastSavedAt,
    lastError,
  } = useEditorStore();
  const [showSettings, setShowSettings] = useState(false);

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
        case 'd':
          event.preventDefault();
          const { selectedBlock, duplicateBlock } = useEditorStore.getState();
          if (selectedBlock) {
            duplicateBlock(selectedBlock);
          }
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

    // Arrow key navigation
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      const { blocks, selectedBlock, selectBlock } = useEditorStore.getState();
      if (selectedBlock) {
        const currentIndex = blocks.findIndex(block => block.id === selectedBlock);
        if (currentIndex !== -1) {
          const nextIndex = event.key === 'ArrowUp' 
            ? Math.max(0, currentIndex - 1)
            : Math.min(blocks.length - 1, currentIndex + 1);
          if (nextIndex !== currentIndex) {
            selectBlock(blocks[nextIndex].id);
          }
        }
      }
    }

    // Escape to clear selection
    if (event.key === 'Escape') {
      const { selectBlock } = useEditorStore.getState();
      selectBlock(null);
    }
  }, [undo, redo]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Načtení existujícího blogu
  useEffect(() => {
    if (postId) {
      const loadPost = async () => {
        try {
          const response = await fetch(`/api/blog/${postId}`);
          if (!response.ok) {
            throw new Error('Nepodařilo se načíst článek');
          }
          const post = await response.json();
          
          // Načíst data do store
          const { setTitle, setSlug, setFeaturedImage, setState } = useEditorStore.getState();
          setTitle(post.title || '');
          setSlug(post.slug || '');
          setFeaturedImage(post.featuredImage || null);
          
          // Načíst bloky pokud existují
          if (post.content) {
            try {
              const contentData = JSON.parse(post.content);
              if (contentData.blocks) {
                setState({
                  blocks: contentData.blocks,
                  globalStyles: contentData.globalStyles || useEditorStore.getState().globalStyles,
                  postId: post.id,
                });
              }
            } catch (e) {
              console.error('Chyba při parsování obsahu:', e);
            }
          }
        } catch (error) {
          console.error('Chyba při načítání článku:', error);
          alert('Nepodařilo se načíst článek');
        } finally {
          setLoadingPost(false);
        }
      };
      
      loadPost();
    }
  }, [postId]);

  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      const { blocks } = useEditorStore.getState();
      if (blocks.length > 0) {
        // Save to localStorage as backup
        localStorage.setItem('editor-auto-save', JSON.stringify({
          blocks,
          timestamp: Date.now(),
        }));
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, []);

  // Load auto-save on mount
  useEffect(() => {
    const autoSaveData = localStorage.getItem('editor-auto-save');
    if (autoSaveData) {
      try {
        const { blocks, timestamp } = JSON.parse(autoSaveData);
        // Only load if auto-save is less than 1 hour old
        if (Date.now() - timestamp < 3600000) {
          useEditorStore.setState({ blocks });
        }
      } catch (error) {
        console.error('Failed to load auto-save:', error);
      }
    }
  }, []);

  const handleDragStart = () => {
    // Handle drag start if needed
  };

  const handleDragOver = () => {
    // Handle drag over for snap-to-grid logic
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    // Handle reordering blocks
    if (active.data.current?.type === 'block' && over.data.current?.type === 'block') {
      const activeIndex = active.data.current.index;
      const overIndex = over.data.current.index;

      if (activeIndex !== overIndex) {
        reorderBlocks(activeIndex, overIndex);
      }
    }
  };

  if (loadingPost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Načítám článek...</p>
        </div>
      </div>
    );
  }

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
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium text-sm disabled:opacity-60"
                disabled={isSaving}
              >
                <CloudArrowUpIcon className="w-4 h-4 inline mr-2" />
                {isSaving ? 'Ukládám...' : 'Uložit'}
              </motion.button>

              {/* Publish */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={publishArticle}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all font-medium text-sm shadow-lg hover:shadow-xl disabled:opacity-60"
                disabled={isSaving}
              >
                <ShareIcon className="w-4 h-4 inline mr-2" />
                {isSaving ? 'Publikuji...' : 'Publikovat'}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {lastSavedAt && (
        <div className="text-xs text-center py-1">
          <span className="text-gray-500">
            Naposledy uloženo: {new Date(lastSavedAt).toLocaleTimeString('cs-CZ')}
          </span>
          {lastError && (
            <span className="ml-2 text-red-500">{lastError}</span>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">

        {/* Left Outline */}
        <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-24 self-start h-[calc(100vh-6rem)]">
          <OutlinePanel />
        </aside>

        {/* Canvas */}
        <div className="flex-1 min-w-0 overflow-y-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <EditorCanvas />
          </DndContext>
        </div>

        {/* Right Inspector */}
        <aside className="hidden lg:block w-80 flex-shrink-0 sticky top-24 self-start h-[calc(100vh-6rem)]">
          <InspectorPanel />
        </aside>
      </div>

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