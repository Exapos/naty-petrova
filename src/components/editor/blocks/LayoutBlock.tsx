'use client';

import React, { useState } from 'react';
import { Block, SubBlock, BlockType } from '@/types/editor';
import { useEditorStore } from '@/stores/editorStore';
import { BlockRenderer } from '../BlockRenderer';
import { LayoutBlockPicker } from '../LayoutBlockPicker';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable SubBlock Component
function SortableSubBlock({ subBlock, onUpdate, onDelete, isEditing }: { 
  subBlock: any, 
  index: number, 
  onUpdate: (id: string, updates: any) => void,
  onDelete: (id: string) => void,
  isEditing: boolean
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: subBlock.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative ${isDragging ? 'opacity-50' : ''} group`}
    >
      {/* Drag handle */}
      <div className="absolute -left-6 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          {...attributes}
          {...listeners}
          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded cursor-grab active:cursor-grabbing"
          title="Přetáhnout blok"
        >
          ⋮⋮
        </button>
      </div>

      {/* Delete button */}
      {isEditing && (
        <div className="absolute -right-6 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onDelete(subBlock.id)}
            className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
            title="Smazat blok"
          >
            ×
          </button>
        </div>
      )}

      <BlockRenderer
        block={subBlock}
        columnSpan={1}
        onColumnSpanChange={() => {}}
        onUpdate={(updates) => onUpdate(subBlock.id, updates)}
        isEditing={isEditing}
      />
    </div>
  );
}

interface LayoutBlockProps {
  block: Block;
  isEditing: boolean;
  onUpdate?: (block: Block) => void;
}

export function LayoutBlock({ block, isEditing, onUpdate }: LayoutBlockProps) {
  const { updateBlock } = useEditorStore();
  const [showBlockPicker, setShowBlockPicker] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(0);

  const layoutType = block.layout || 'single';
  const subBlocks = block.subBlocks || [];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getGridClasses = () => {
    switch (layoutType) {
      case 'two-column-equal':
        return 'grid grid-cols-2';
      case 'two-column-left':
        return 'grid grid-cols-3'; // 2/3 pro první blok, 1/3 pro druhý
      case 'two-column-right':
        return 'grid grid-cols-3'; // 1/3 pro první blok, 2/3 pro druhý
      case 'three-column':
        return 'grid grid-cols-3';
      default:
        return 'space-y-4';
    }
  };

  const updateSubBlock = (subBlockId: string, updates: any) => {
    const updatedSubBlocks = subBlocks.map(subBlock =>
      subBlock.id === subBlockId ? { ...subBlock, ...updates } : subBlock
    );
    if (onUpdate) {
      onUpdate({ ...block, subBlocks: updatedSubBlocks });
    } else {
      updateBlock(block.id, { subBlocks: updatedSubBlocks });
    }
  };

  const deleteSubBlock = (subBlockId: string) => {
    const updatedSubBlocks = subBlocks.filter(subBlock => subBlock.id !== subBlockId);
    if (onUpdate) {
      onUpdate({ ...block, subBlocks: updatedSubBlocks });
    } else {
      updateBlock(block.id, { subBlocks: updatedSubBlocks });
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = subBlocks.findIndex((item) => item.id === active.id);
      const newIndex = subBlocks.findIndex((item) => item.id === over.id);

      const reorderedSubBlocks = arrayMove(subBlocks, oldIndex, newIndex);

      if (onUpdate) {
        onUpdate({ ...block, subBlocks: reorderedSubBlocks });
      } else {
        updateBlock(block.id, { subBlocks: reorderedSubBlocks });
      }
    }
  };

  const addBlockToColumn = (blockType: string, columnIndex: number) => {
    const newBlock: SubBlock = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: blockType as BlockType,
      content: getDefaultContent(blockType),
      styles: { backgroundColor: 'transparent', textColor: '#1f2937', padding: '1rem', margin: '0' },
    };

    // Jednoduché mapování: každý sloupec = jeden index v subBlocks array
    // Nahradíme blok na daném indexu nebo ho přidáme
    const newSubBlocks = [...subBlocks];
    newSubBlocks[columnIndex] = newBlock;
    
    if (onUpdate) {
      onUpdate({ ...block, subBlocks: newSubBlocks });
    } else {
      updateBlock(block.id, { subBlocks: newSubBlocks });
    }
    
    setShowBlockPicker(false);
  };

  const getDefaultContent = (blockType: string) => {
    switch (blockType) {
      case 'text':
        return { text: 'Začněte psát...' };
      case 'heading':
        return { text: 'Nadpis', level: 2 };
      case 'image':
        return { src: '', alt: '' };
      case 'gallery':
        return { images: [] };
      case 'video':
        return { src: '', title: '' };
      case 'button':
        return { text: 'Tlačítko', url: '' };
      case 'contact':
        return { title: 'Kontakt', email: '' };
      case 'reference':
        return { title: '', description: '', imageUrl: '', projectUrl: '', category: '' };
      case 'map':
        return { src: '', address: '' };
      case 'divider':
        return { style: 'solid' };
      case 'icon':
        return { name: 'star', size: '24px', color: '#000000' };
      case 'table':
        return { rows: 2, columns: 2, data: [['Buňka 1', 'Buňka 2'], ['Buňka 3', 'Buňka 4']] };
      default:
        return {};
    }
  };

  const renderSubBlocks = () => {
    const getColumnCount = () => {
      switch (layoutType) {
        case 'two-column-equal':
        case 'two-column-left':
        case 'two-column-right':
          return 2;
        case 'three-column':
          return 3;
        default:
          return 1;
      }
    };

    const renderColumn = (columnIndex: number) => {
      // Každý sloupec odpovídá jednomu bloku v subBlocks
      const subBlock = subBlocks[columnIndex];
      
      if (!subBlock) {
        // Prázdný sloupec - zobrazit tlačítko pro přidání bloku
        return (
          <div key={columnIndex} className="space-y-2">
            {isEditing && (
              <button
                onClick={() => {
                  setSelectedColumn(columnIndex);
                  setShowBlockPicker(true);
                }}
                className="w-full p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-gray-500 hover:text-blue-600"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <span className="text-3xl">+</span>
                  <span className="text-sm font-medium">Sloupec {columnIndex + 1}</span>
                  <span className="text-xs text-gray-400">Klikněte pro přidání bloku</span>
                </div>
              </button>
            )}
          </div>
        );
      }
      
      return (
        <div key={columnIndex} className="space-y-2">
          <div className="relative">
            <SortableSubBlock
              subBlock={subBlock}
              index={columnIndex}
              onUpdate={updateSubBlock}
              onDelete={deleteSubBlock}
              isEditing={isEditing}
            />
          </div>
        </div>
      );
    };

    if (subBlocks.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
          <p>Tento layout blok nemá žádný obsah.</p>
          <p className="text-sm mt-1">Přidejte bloky do tohoto layoutu.</p>
          {isEditing && (
            <button
              onClick={() => {
                setSelectedColumn(0);
                setShowBlockPicker(true);
              }}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Přidat první blok
            </button>
          )}
        </div>
      );
    }

    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={subBlocks.map(sb => sb.id)} strategy={verticalListSortingStrategy}>
          <div
            className={`${getGridClasses()} group`}
            style={layoutType === 'single' ? undefined : { gap: (block.styles as any)?.gap || '1rem' }}
          >
            {Array.from({ length: getColumnCount() }, (_, index) => renderColumn(index))}
          </div>
        </SortableContext>
      </DndContext>
    );
  };

  const getLayoutLabel = () => {
    switch (layoutType) {
      case 'two-column-equal':
        return '2 sloupce (50/50)';
      case 'two-column-left':
        return '2 sloupce (70/30)';
      case 'two-column-right':
        return '2 sloupce (30/70)';
      case 'three-column':
        return '3 sloupce (33/33/33)';
      default:
        return 'Layout';
    }
  };

  return (
    <div className="w-full">
      {isEditing && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-800">
              Layout: {getLayoutLabel()}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  // Přidat textový subBlock do tohoto layoutu
                  const newSubBlock: any = {
                    id: `subblock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    type: 'text',
                    content: { text: 'Nový blok v layoutu' },
                    styles: {
                      backgroundColor: 'transparent',
                      textColor: '#1f2937',
                      padding: '1rem',
                      margin: '0',
                      borderRadius: '0.5rem',
                    },
                  };

                  if (onUpdate) {
                    onUpdate({
                      ...block,
                      subBlocks: [...subBlocks, newSubBlock],
                    });
                  } else {
                    updateBlock(block.id, {
                      subBlocks: [...subBlocks, newSubBlock],
                    });
                  }
                }}
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Přidat text
              </button>
              <button
                onClick={() => {
                  // Přidat obrázkový subBlock do tohoto layoutu
                  const newSubBlock: any = {
                    id: `subblock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    type: 'image',
                    content: { src: '', alt: '', caption: '' },
                    styles: {
                      backgroundColor: 'transparent',
                      textColor: '#1f2937',
                      padding: '1rem',
                      margin: '0',
                      borderRadius: '0.5rem',
                    },
                  };

                  if (onUpdate) {
                    onUpdate({
                      ...block,
                      subBlocks: [...subBlocks, newSubBlock],
                    });
                  } else {
                    updateBlock(block.id, {
                      subBlocks: [...subBlocks, newSubBlock],
                    });
                  }
                }}
                className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
              >
                Přidat obrázek
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="border border-gray-200 rounded-lg p-4 bg-white">
        {renderSubBlocks()}
      </div>

      {/* Layout Block Picker Modal */}
      <LayoutBlockPicker
        isOpen={showBlockPicker}
        onClose={() => setShowBlockPicker(false)}
        onAddBlock={(blockType) => addBlockToColumn(blockType, selectedColumn)}
        columnIndex={selectedColumn}
      />
    </div>
  );
}