'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Editor } from '@tiptap/react';
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code2,
  Image,
  Minus,
  Table,
  Youtube,
  Plus,
} from 'lucide-react';

interface BlockFloatingMenuProps {
  editor: Editor;
}

export function BlockFloatingMenu({ editor }: BlockFloatingMenuProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    const { $from } = editor.state.selection;
    const isEmptyTextBlock = $from.parent.isBlock && $from.parent.childCount === 0;
    
    if (!isEmptyTextBlock || !editor.isFocused) {
      setIsVisible(false);
      setIsExpanded(false);
      return;
    }

    const view = editor.view;
    const coords = view.coordsAtPos($from.pos);
    
    setPosition({ top: coords.top - 5, left: coords.left - 45 });
    setIsVisible(true);
  }, [editor]);

  useEffect(() => {
    const handleUpdate = () => {
      updatePosition();
    };

    editor.on('selectionUpdate', handleUpdate);
    editor.on('focus', handleUpdate);
    editor.on('blur', () => {
      setTimeout(() => {
        if (!menuRef.current?.contains(document.activeElement)) {
          setIsVisible(false);
          setIsExpanded(false);
        }
      }, 150);
    });

    return () => {
      editor.off('selectionUpdate', handleUpdate);
      editor.off('focus', handleUpdate);
    };
  }, [editor, updatePosition]);

  if (!isVisible) return null;

  const items = [
    {
      icon: Heading1,
      title: 'Nadpis 1',
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      icon: Heading2,
      title: 'Nadpis 2',
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      icon: Heading3,
      title: 'Nadpis 3',
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      icon: List,
      title: 'Odrážky',
      action: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      icon: ListOrdered,
      title: 'Číslování',
      action: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      icon: CheckSquare,
      title: 'Úkoly',
      action: () => editor.chain().focus().toggleTaskList().run(),
    },
    {
      icon: Quote,
      title: 'Citace',
      action: () => editor.chain().focus().toggleBlockquote().run(),
    },
    {
      icon: Code2,
      title: 'Kód',
      action: () => editor.chain().focus().toggleCodeBlock().run(),
    },
    {
      icon: Minus,
      title: 'Čára',
      action: () => editor.chain().focus().setHorizontalRule().run(),
    },
    {
      icon: Table,
      title: 'Tabulka',
      action: () => editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run(),
    },
    {
      icon: Image,
      title: 'Obrázek',
      action: () => {
        const url = window.prompt('URL obrázku:');
        if (url) {
          editor.chain().focus().setImage({ src: url }).run();
        }
      },
    },
    {
      icon: Youtube,
      title: 'YouTube',
      action: () => {
        const url = window.prompt('YouTube URL:');
        if (url) {
          editor.chain().focus().setYoutubeVideo({ src: url }).run();
        }
      },
    },
  ];

  return (
    <div
      ref={menuRef}
      className="fixed z-50"
      style={{ top: position.top, left: position.left }}
      onMouseDown={(e) => e.preventDefault()}
    >
      {!isExpanded ? (
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsExpanded(true);
          }}
          className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-all"
          title="Přidat blok"
        >
          <Plus size={18} />
        </button>
      ) : (
        <div className="flex items-center gap-0.5 bg-white rounded-lg border border-gray-200 shadow-lg px-1 py-1 animate-in slide-in-from-left duration-150">
          {items.map((item, index) => (
            <button
              key={index}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                item.action();
                setIsExpanded(false);
              }}
              title={item.title}
              className="p-1.5 rounded text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all"
            >
              <item.icon size={16} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default BlockFloatingMenu;
