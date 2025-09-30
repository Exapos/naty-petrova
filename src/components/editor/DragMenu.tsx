'use client';

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { BlockType } from '@/types/editor';
import {
  Bars3Icon as HeadingIcon,
  DocumentTextIcon as TextIcon,
  PhotoIcon,
  RectangleStackIcon,
  VideoCameraIcon,
  CursorArrowRaysIcon,
  PhoneIcon,
  DocumentTextIcon,
  MapIcon,
  MinusIcon,
  StarIcon,
  TableCellsIcon,
} from '@heroicons/react/24/outline';

interface BlockItem {
  type: BlockType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const blockItems: BlockItem[] = [
  {
    type: 'heading',
    label: 'Nadpis',
    icon: HeadingIcon,
    description: 'H1, H2, H3 nadpisy',
  },
  {
    type: 'text',
    label: 'Text',
    icon: TextIcon,
    description: 'Odstavec nebo text',
  },
  {
    type: 'image',
    label: 'Obrázek',
    icon: PhotoIcon,
    description: 'Jeden obrázek s popiskem',
  },
  {
    type: 'gallery',
    label: 'Galerie',
    icon: RectangleStackIcon,
    description: 'Více obrázků v galerii',
  },
  {
    type: 'video',
    label: 'Video',
    icon: VideoCameraIcon,
    description: 'YouTube nebo Vimeo video',
  },
  {
    type: 'button',
    label: 'Tlačítko',
    icon: CursorArrowRaysIcon,
    description: 'Klikatelné tlačítko',
  },
  {
    type: 'contact',
    label: 'Kontakt',
    icon: PhoneIcon,
    description: 'Kontaktní formulář',
  },
  {
    type: 'reference',
    label: 'Reference',
    icon: DocumentTextIcon,
    description: 'Naše reference/projekty',
  },
  {
    type: 'map',
    label: 'Mapa',
    icon: MapIcon,
    description: 'Interaktivní mapa',
  },
  {
    type: 'divider',
    label: 'Oddělovač',
    icon: MinusIcon,
    description: 'Vizuální oddělení sekcí',
  },
  {
    type: 'icon',
    label: 'Ikonka',
    icon: StarIcon,
    description: 'Dekorativní ikona',
  },
  {
    type: 'table',
    label: 'Tabulka',
    icon: TableCellsIcon,
    description: 'Datová tabulka',
  },
];

interface DragMenuProps {
  className?: string;
}

export function DragMenu({ className }: DragMenuProps) {
  return (
    <div className={`p-4 ${className}`}>
      <h3 className="text-sm font-medium text-gray-900 mb-4">Přetáhněte bloky</h3>

      <div className="space-y-2">
        {blockItems.map((item) => (
          <DraggableBlockItem key={item.type} item={item} />
        ))}
      </div>
    </div>
  );
}

interface DraggableBlockItemProps {
  item: BlockItem;
}

function DraggableBlockItem({ item }: DraggableBlockItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `new-${item.type}`,
    data: {
      type: 'new-block',
      blockType: item.type,
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const Icon = item.icon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-grab active:cursor-grabbing
        hover:bg-gray-100 hover:border-gray-300 transition-all duration-200
        ${isDragging ? 'shadow-lg scale-105 rotate-2 z-50' : ''}
      `}
    >
      <div className="flex items-center space-x-3">
        <Icon className="w-5 h-5 text-gray-600 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {item.label}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {item.description}
          </p>
        </div>
      </div>
    </div>
  );
}