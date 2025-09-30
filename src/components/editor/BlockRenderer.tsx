'use client';

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Block } from '@/types/editor';
import { useEditorStore } from '@/stores/editorStore';
import { motion } from 'framer-motion';
import {
  HeadingBlock,
  TextBlock,
  ImageBlock,
  GalleryBlock,
  VideoBlock,
  ButtonBlock,
  ContactBlock,
  ReferenceBlock,
  MapBlock,
  DividerBlock,
  IconBlock,
  TableBlock,
} from './blocks';
import { TrashIcon, DocumentDuplicateIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

interface BlockRendererProps {
  block: Block;
  columnSpan?: number;
  onColumnSpanChange?: (span: number) => void;
}

export function BlockRenderer({ block, columnSpan = 1, onColumnSpanChange }: BlockRendererProps) {
  const { selectedBlock, selectBlock, isPreviewMode, deleteBlock, duplicateBlock } = useEditorStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: block.id,
    data: {
      type: 'block',
      block,
    },
  });

  const isSelected = selectedBlock === block.id;

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isPreviewMode) {
      selectBlock(block.id);
    }
  };

  const renderBlockContent = () => {
    switch (block.type) {
      case 'heading':
        return <HeadingBlock block={block} isEditing={!isPreviewMode && isSelected} />;
      case 'text':
        return <TextBlock block={block} isEditing={!isPreviewMode && isSelected} />;
      case 'image':
        return <ImageBlock block={block} isEditing={!isPreviewMode && isSelected} />;
      case 'gallery':
        return <GalleryBlock block={block} isEditing={!isPreviewMode && isSelected} />;
      case 'video':
        return <VideoBlock block={block} isEditing={!isPreviewMode && isSelected} />;
      case 'button':
        return <ButtonBlock block={block} isEditing={!isPreviewMode && isSelected} />;
      case 'contact':
        return <ContactBlock block={block} isEditing={!isPreviewMode && isSelected} />;
      case 'reference':
        return <ReferenceBlock block={block} isEditing={!isPreviewMode && isSelected} />;
      case 'map':
        return <MapBlock block={block} isEditing={!isPreviewMode && isSelected} />;
      case 'divider':
        return <DividerBlock block={block} isEditing={!isPreviewMode && isSelected} />;
      case 'icon':
        return <IconBlock block={block} isEditing={!isPreviewMode && isSelected} />;
      case 'table':
        return <TableBlock block={block} isEditing={!isPreviewMode && isSelected} />;
      default:
        return <div>Neznámý typ bloku: {block.type}</div>;
    }
  };

  const getBlockTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      heading: 'Nadpis',
      text: 'Text',
      image: 'Obrázek',
      gallery: 'Galerie',
      video: 'Video',
      button: 'Tlačítko',
      contact: 'Kontakt',
      reference: 'Reference',
      map: 'Mapa',
      divider: 'Oddělovač',
      icon: 'Ikona',
      table: 'Tabulka',
    };
    return labels[type] || type;
  };

  if (isPreviewMode) {
    return (
      <div className="w-full">
        {renderBlockContent()}
      </div>
    );
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={`relative cursor-move group rounded-xl border-2 transition-all duration-300 overflow-hidden ${
        isSelected
          ? 'border-indigo-400 bg-indigo-50/50 shadow-lg ring-2 ring-indigo-200'
          : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30 hover:shadow-md'
      } ${isDragging ? 'shadow-2xl rotate-1 z-50' : ''}`}
      onClick={handleClick}
      {...listeners}
      {...attributes}
      layout
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Block Header */}
      <div className={`px-4 py-2 border-b transition-colors flex items-center justify-between ${
        isSelected ? 'bg-indigo-100 border-indigo-200' : 'bg-gray-50 border-gray-100'
      }`}>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full transition-colors ${
            isSelected ? 'bg-indigo-500' : 'bg-gray-400'
          }`} />
          <span className="text-xs font-medium text-gray-700">
            {getBlockTypeLabel(block.type)}
          </span>
        </div>

        {/* Block Inline Toolbar */}
        {isSelected && (
          <div className="flex items-center space-x-1">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                duplicateBlock(block.id);
              }}
              className="p-1 text-gray-500 hover:text-indigo-600 hover:bg-indigo-100 rounded transition-colors"
              title="Duplikovat blok"
            >
              <DocumentDuplicateIcon className="w-3 h-3" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                // Cycle through column spans: 1 -> 2 -> 3 -> 1
                const newSpan = columnSpan >= 3 ? 1 : columnSpan + 1;
                onColumnSpanChange?.(newSpan);
              }}
              className="p-1 text-gray-500 hover:text-indigo-600 hover:bg-indigo-100 rounded transition-colors"
              title={`Rozprostřít přes ${columnSpan >= 3 ? 1 : columnSpan + 1} sloupec/sloupce`}
            >
              <div className="flex space-x-0.5">
                {Array.from({ length: columnSpan >= 3 ? 1 : columnSpan + 1 }).map((_, i) => (
                  <div key={i} className="w-1 h-3 bg-current rounded-sm"></div>
                ))}
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                // TODO: Open block settings (content, styling, etc.)
              }}
              className="p-1 text-gray-500 hover:text-indigo-600 hover:bg-indigo-100 rounded transition-colors"
              title="Nastavení bloku"
            >
              <Cog6ToothIcon className="w-3 h-3" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                deleteBlock(block.id);
              }}
              className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded transition-colors"
              title="Smazat blok"
            >
              <TrashIcon className="w-3 h-3" />
            </motion.button>
          </div>
        )}
      </div>

      {/* Block Content */}
      <div className="w-full p-4 bg-white">
        {renderBlockContent()}
      </div>

      {/* Drag Handle Indicator */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-6 h-6 bg-gray-100 rounded border flex items-center justify-center">
          <div className="flex flex-col space-y-0.5">
            <div className="w-3 h-0.5 bg-gray-400 rounded"></div>
            <div className="w-3 h-0.5 bg-gray-400 rounded"></div>
            <div className="w-3 h-0.5 bg-gray-400 rounded"></div>
          </div>
        </div>
      </div>

      {/* Selection Glow */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl pointer-events-none"
        />
      )}
    </motion.div>
  );
}