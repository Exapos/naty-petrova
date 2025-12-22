'use client';

import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEditorStore } from '@/stores/editorStore';
import { BlockRenderer } from './BlockRenderer';
import { BlockPicker } from './BlockPicker';
import { motion, AnimatePresence } from 'framer-motion';
import { Block, BlockType, LayoutType } from '@/types/editor';
import {
  PlusIcon,
} from '@heroicons/react/24/outline';
import { MediaManager } from './MediaManager';

// Helper functions for default content
function getDefaultContent(blockType: BlockType) {
  switch (blockType) {
    case 'heading':
      return { text: 'Nový nadpis', level: 2 };
    case 'text':
      return { text: 'Začněte psát...' };
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
      return { style: 'solid', thickness: '1px', color: '#e5e7eb' };
    case 'table':
      return {
        rows: [
          ['Nadpis 1', 'Nadpis 2'],
          ['Řádek 1', 'Data 1'],
        ],
        hasHeader: true,
      };
    case 'layout':
      return {};
    default:
      return {};
  }
}

function createSubBlocks(layoutType: LayoutType) {
  // Vytvoří prázdné sloty pro layout - uživatel si vybere bloky sám
  const timestamp = Date.now();
  switch (layoutType) {
    case 'two-column-equal':
    case 'two-column-left':
    case 'two-column-right':
      return [
        {
          id: `sub-${timestamp}-1`,
          type: 'text' as const,
          content: { text: '' },
          styles: {
            backgroundColor: 'transparent',
            textColor: '#1f2937',
            padding: '1rem',
            margin: '0',
          }
        },
        {
          id: `sub-${timestamp}-2`,
          type: 'text' as const,
          content: { text: '' },
          styles: {
            backgroundColor: 'transparent',
            textColor: '#1f2937',
            padding: '1rem',
            margin: '0',
          }
        },
      ];
    case 'three-column':
      return [
        {
          id: `sub-${timestamp}-1`,
          type: 'text' as const,
          content: { text: '' },
          styles: {
            backgroundColor: 'transparent',
            textColor: '#1f2937',
            padding: '1rem',
            margin: '0',
          }
        },
        {
          id: `sub-${timestamp}-2`,
          type: 'text' as const,
          content: { text: '' },
          styles: {
            backgroundColor: 'transparent',
            textColor: '#1f2937',
            padding: '1rem',
            margin: '0',
          }
        },
        {
          id: `sub-${timestamp}-3`,
          type: 'text' as const,
          content: { text: '' },
          styles: {
            backgroundColor: 'transparent',
            textColor: '#1f2937',
            padding: '1rem',
            margin: '0',
          }
        },
      ];
    default:
      return [];
  }
}

// Sortable Block Wrapper s Notion-style drag handle
function SortableBlock({ block, index }: { block: Block; index: number }) {
  const { selectedBlock, selectBlock, updateBlock } = useEditorStore();
  const [showAddButton, setShowAddButton] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const {
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: block.id,
    data: {
      type: 'block',
      block,
      index,
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isSelected = selectedBlock === block.id;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group"
      onMouseEnter={() => setShowAddButton(true)}
      onMouseLeave={() => setShowAddButton(false)}
    >
      {/* Add button above */}
      <AnimatePresence>
        {showAddButton && !showPicker && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center justify-center py-1"
          >
            <button
              onClick={() => setShowPicker(true)}
              className="flex items-center gap-1 px-3 py-1 text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              <PlusIcon className="w-3 h-3" />
              <span>Přidat blok</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Block Picker */}
      <AnimatePresence>
        {showPicker && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="my-2"
          >
            <BlockPicker
              onSelectBlock={(blockType, layoutType) => {
                const { addBlock } = useEditorStore.getState();
                addBlock(
                  {
                    type: blockType,
                    layout: layoutType,
                    content: getDefaultContent(blockType),
                    styles: {
                      backgroundColor: 'transparent',
                      textColor: '#1f2937',
                      padding: '1rem',
                      margin: '0.5rem 0',
                    },
                    subBlocks: layoutType ? createSubBlocks(layoutType) : undefined,
                  },
                  index
                );
                setShowPicker(false);
              }}
              onClose={() => setShowPicker(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main block */}
      <div
        className={`relative rounded-lg transition-all ${
          isSelected
            ? 'ring-2 ring-blue-400 bg-blue-50/30'
            : 'hover:bg-gray-50/50'
        }`}
        onClick={() => selectBlock(block.id)}
      >
        {/* Block content */}
        <div className="p-2">
          <BlockRenderer
            block={block}
            columnSpan={1}
            onColumnSpanChange={() => {}}
            onUpdate={(updatedBlock) => updateBlock(updatedBlock.id, updatedBlock)}
          />
        </div>
      </div>
    </div>
  );
}


// Main Editor Canvas
export function EditorCanvas() {
  const {
    blocks,
    isPreviewMode,
    addBlock,
    responsiveMode,
    title,
    slug,
    featuredImage,
    setTitle,
    setSlug,
    setFeaturedImage,
  } = useEditorStore();
  const [showInitialPicker, setShowInitialPicker] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [showFeaturedMedia, setShowFeaturedMedia] = useState(false);

  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas',
  });

  const blockIds = blocks.map(block => block.id);

  const frameConfig: Record<'desktop' | 'tablet' | 'mobile', { container: string; inner: string; title: string }> = {
    desktop: {
      container: 'max-w-5xl px-6',
      inner: 'bg-transparent rounded-none border-none shadow-none',
      title: 'Zadejte název článku...',
    },
    tablet: {
      container: 'max-w-3xl px-4',
      inner: 'bg-white rounded-2xl border border-gray-200 shadow-md',
      title: 'Název článku (tablet)',
    },
    mobile: {
      container: 'max-w-md px-3',
      inner: 'bg-white rounded-3xl border border-gray-200 shadow-lg',
      title: 'Název článku (mobil)',
    },
  };
  const { container, inner, title: frameTitle } = frameConfig[responsiveMode];

  if (isPreviewMode) {
    return (
      <div className={`mx-auto space-y-4 py-8 ${container}`}>
        {blocks.map((block) => (
          <BlockRenderer
            key={block.id}
            block={block}
            columnSpan={1}
            onColumnSpanChange={() => {}}
          />
        ))}
      </div>
    );
  }

  return (
    <div ref={setNodeRef} className="min-h-screen py-6 flex justify-center">
      <div className={`w-full ${container}`}>
        <div className="mb-8 space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
            <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="text-2xl">✍️</span>
              Název článku
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={frameTitle}
              className="w-full text-4xl font-bold border-none outline-none focus:ring-0 placeholder-gray-300 bg-transparent"
            />
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span>🔗</span>
              URL adresa článku
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value.replace(/[^a-z0-9-]/gi, '-'))}
              placeholder="napr-moderni-rekonstrukce-domu"
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <p className="mt-2 text-xs text-gray-500">
              Vytvoří se URL: <span className="font-mono text-blue-600">/blog/{slug || 'url-clanek'}</span>
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span>🖼️</span>
              Úvodní obrázek (hero)
            </label>
            {featuredImage ? (
              <div className="relative group">
                <img
                  src={featuredImage}
                  alt="Featured"
                  className="w-full h-56 object-cover rounded-xl border border-gray-200 shadow-sm"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
                  <button
                    onClick={() => setShowFeaturedMedia(true)}
                    className="px-4 py-2 text-sm bg-white hover:bg-gray-100 rounded-lg border border-gray-200 font-medium transition-colors"
                  >
                    Změnit obrázek
                  </button>
                  <button
                    onClick={() => setFeaturedImage(null)}
                    className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Odebrat
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowFeaturedMedia(true)}
                className="w-full h-40 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/50 transition-all group"
              >
                <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">📸</span>
                <span className="text-sm font-semibold">Klikněte pro výběr obrázku</span>
                <span className="text-xs mt-1">Doporučená velikost: 1600 × 900 px</span>
              </button>
            )}
          </div>
        </div>

        <div className={`${inner} ${responsiveMode === 'desktop' ? '' : 'p-4'} transition-all duration-300`}
        >
          {blocks.length === 0 ? (
            <div className="text-center py-20">
                       {showInitialPicker ? (
                         <BlockPicker
                           onSelectBlock={(blockType, layoutType) => {
                             addBlock({
                               type: blockType,
                               layout: layoutType,
                               content: getDefaultContent(blockType),
                               styles: {
                                 backgroundColor: 'transparent',
                                 textColor: '#1f2937',
                                 padding: '1rem',
                                 margin: '0.5rem 0',
                               },
                               subBlocks: layoutType ? createSubBlocks(layoutType) : undefined,
                             });
                             setShowInitialPicker(false);
                           }}
                           onSelectPreset={(preset) => {
                             preset.blocks.forEach((blockData, index) => {
                               addBlock({
                                 ...blockData,
                                 id: `block-${Date.now()}-${index}`,
                               }, index);
                             });
                             setShowInitialPicker(false);
                           }}
                           onClose={() => setShowInitialPicker(false)}
                         />
                       ) : (
                <button
                  onClick={() => setShowInitialPicker(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                >
                  <PlusIcon className="w-5 h-5" />
                  <span>Přidat první blok</span>
                </button>
              )}
            </div>
          ) : (
            <SortableContext items={blockIds} strategy={verticalListSortingStrategy}>
              <div className="space-y-1">
                {blocks.map((block, index) => (
                  <SortableBlock key={block.id} block={block} index={index} />
                ))}

                <div className="flex justify-center py-4">
                  <button
                    onClick={() => setShowPicker(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                  >
                    <PlusIcon className="w-5 h-5" />
                    <span>Přidat blok</span>
                  </button>
                </div>

                {showPicker && (
                  <div className="flex justify-center py-2">
                             <BlockPicker
                               onSelectBlock={(blockType, layoutType) => {
                                 addBlock({
                                   type: blockType,
                                   layout: layoutType,
                                   content: getDefaultContent(blockType),
                                   styles: {
                                     backgroundColor: 'transparent',
                                     textColor: '#1f2937',
                                     padding: '1rem',
                                     margin: '0.5rem 0',
                                   },
                                   subBlocks: layoutType ? createSubBlocks(layoutType) : undefined,
                                 }, blocks.length);
                                 setShowPicker(false);
                               }}
                               onSelectPreset={(preset) => {
                                 preset.blocks.forEach((blockData, index) => {
                                   addBlock({
                                     ...blockData,
                                     id: `block-${Date.now()}-${index}`,
                                   }, blocks.length + index);
                                 });
                                 setShowPicker(false);
                               }}
                               onClose={() => setShowPicker(false)}
                             />
                  </div>
                )}
              </div>
            </SortableContext>
          )}
        </div>
      </div>

      {isOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-8 rounded-lg shadow-xl">
            <h3 className="text-2xl font-bold mb-4">Přetáhněte blok</h3>
            <p>Sem přetáhněte blok, který chcete přidat.</p>
          </div>
        </div>
      )}
      <MediaManager
        isOpen={showFeaturedMedia}
        onClose={() => setShowFeaturedMedia(false)}
        onSelect={(asset) => {
          setFeaturedImage(asset.url);
          setShowFeaturedMedia(false);
        }}
      />
    </div>
  );
}
