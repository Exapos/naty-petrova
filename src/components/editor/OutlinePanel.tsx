'use client';

import React from 'react';
import { useEditorStore } from '@/stores/editorStore';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  DocumentTextIcon,
  PhotoIcon,
  RectangleStackIcon,
  VideoCameraIcon,
  CursorArrowRaysIcon,
  MapIcon,
  MinusIcon,
  StarIcon,
  TableCellsIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';

const typeToIcon: Record<string, React.ComponentType<{ className?: string }>> = {
  text: DocumentTextIcon,
  heading: Bars3Icon,
  image: PhotoIcon,
  gallery: RectangleStackIcon,
  video: VideoCameraIcon,
  button: CursorArrowRaysIcon,
  contact: DocumentTextIcon,
  reference: StarIcon,
  map: MapIcon,
  divider: MinusIcon,
  icon: StarIcon,
  table: TableCellsIcon,
  layout: RectangleStackIcon,
};

function SortableOutlineItem({ block, index }: { block: any; index: number }) {
  const { selectedBlock, selectBlock } = useEditorStore();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: block.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const Icon = typeToIcon[block.type] || DocumentTextIcon;
  const isActive = selectedBlock === block.id;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`w-full flex items-center gap-2 px-2 py-2 rounded-md transition-colors ${
        isActive ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'hover:bg-gray-50'
      } ${isDragging ? 'opacity-50' : ''}`}
      title={`Blok ${index + 1}: ${block.type}`}
    >
      <button
        onClick={() => selectBlock(block.id)}
        className="flex-1 flex items-center gap-2 text-left"
      >
        <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-gray-100">
          <Icon className="w-4 h-4 text-gray-600" />
        </span>
        <span className="flex-1 text-sm text-gray-800 truncate">
          {block.type === 'heading' && block.content?.text
            ? block.content.text
            : block.type.charAt(0).toUpperCase() + block.type.slice(1)}
        </span>
        <span className="text-xs text-gray-400">#{index + 1}</span>
      </button>

      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
        title="Přetáhnout blok"
      >
        ⋮⋮
      </button>
    </div>
  );
}

export function OutlinePanel() {
  const { blocks, reorderBlocks } = useEditorStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = blocks.findIndex((item) => item.id === active.id);
      const newIndex = blocks.findIndex((item) => item.id === over.id);
      reorderBlocks(oldIndex, newIndex);
    }
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg p-3 h-full flex flex-col overflow-hidden">
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-gray-700">Struktura článku</h3>
        <p className="text-xs text-gray-500">Kliknutím vyberete, přetáhnutím přesuňte</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-1">
              {blocks.map((block, idx) => (
                <SortableOutlineItem key={block.id} block={block} index={idx} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}


