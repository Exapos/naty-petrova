'use client';

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Block } from '@/types/editor';
import { useEditorStore } from '@/stores/editorStore';
import { motion } from 'framer-motion';
import { AnimatedBlock } from './AnimatedBlock';
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
  LayoutBlock,
} from './blocks';

interface BlockRendererProps {
  block: Block;
  columnSpan?: number;
  onColumnSpanChange?: (span: number) => void;
  onUpdate?: (block: Block) => void;
  isEditing?: boolean;
}

export function BlockRenderer({ block, onUpdate, isEditing: propIsEditing }: BlockRendererProps) {
  const { selectedBlock, selectBlock, isPreviewMode } = useEditorStore();

  const isSelected = selectedBlock === block.id;
  const isEditing = propIsEditing !== undefined ? propIsEditing : (!isPreviewMode && isSelected);

  // Only use drag functionality for top-level blocks, not for subBlocks
  const shouldUseDrag = propIsEditing === undefined;

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

  const style = transform && shouldUseDrag ? {
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
        return <HeadingBlock block={block} isEditing={isEditing} onUpdate={onUpdate} />;
      case 'text':
        return <TextBlock block={block} isEditing={isEditing} onUpdate={onUpdate} />;
      case 'image':
        return <ImageBlock block={block} isEditing={isEditing} onUpdate={onUpdate} />;
      case 'gallery':
        return <GalleryBlock block={block} isEditing={isEditing} />;
      case 'video':
        return <VideoBlock block={block} isEditing={isEditing} />;
      case 'button':
        return <ButtonBlock block={block} isEditing={isEditing} onUpdate={onUpdate} />;
      case 'contact':
        return <ContactBlock block={block} isEditing={isEditing} />;
      case 'reference':
        return <ReferenceBlock block={block} isEditing={isEditing} />;
      case 'map':
        return <MapBlock block={block} isEditing={isEditing} />;
      case 'divider':
        return <DividerBlock block={block} isEditing={isEditing} />;
      case 'icon':
        return <IconBlock block={block} isEditing={isEditing} />;
      case 'table':
        return <TableBlock block={block} isEditing={isEditing} />;
      case 'layout':
        return <LayoutBlock block={block} isEditing={isEditing} onUpdate={onUpdate} />;
      default:
        return <div>Neznámý typ bloku: {block.type}</div>;
    }
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
      className={`relative cursor-move group rounded-lg border-2 transition-all duration-200 ${
        isSelected
          ? 'border-blue-500 shadow-lg ring-2 ring-blue-200'
          : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
      } ${isDragging ? 'shadow-2xl z-50' : ''}`}
      onClick={shouldUseDrag ? handleClick : undefined}
      {...(shouldUseDrag ? { ...listeners, ...attributes } : {})}
      layout
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Block Content - bez toolbaru */}
      <AnimatedBlock
        animation={block.styles.animation}
        animationDuration={block.styles.animationDuration}
        animationDelay={block.styles.animationDelay}
        hoverEffect={block.styles.hoverEffect}
        className="w-full p-4 bg-white rounded-lg"
        style={{
          display: block.styles.display || 'block',
          flexDirection: block.styles.flexDirection as any,
          flexWrap: block.styles.flexWrap as any,
          justifyContent: block.styles.justifyContent,
          alignItems: block.styles.alignItems,
          gridTemplateColumns: block.styles.gridTemplateColumns,
          gridTemplateRows: block.styles.gridTemplateRows,
          gap: block.styles.gap,
        }}
      >
        {renderBlockContent()}
      </AnimatedBlock>

      {/* Drag Handle Indicator */}
      {shouldUseDrag && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-6 h-6 bg-white rounded border border-gray-300 shadow-sm flex items-center justify-center">
            <div className="flex flex-col space-y-0.5">
              <div className="w-3 h-0.5 bg-gray-400 rounded"></div>
              <div className="w-3 h-0.5 bg-gray-400 rounded"></div>
              <div className="w-3 h-0.5 bg-gray-400 rounded"></div>
            </div>
          </div>
        </div>
      )}

      {/* Selection Indicator */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-blue-50/30 rounded-lg pointer-events-none"
        />
      )}
    </motion.div>
  );
}