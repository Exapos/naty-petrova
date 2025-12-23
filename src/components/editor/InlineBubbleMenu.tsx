'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Link as LinkIcon,
  Unlink,
  Highlighter,
  Palette,
} from 'lucide-react';

interface InlineBubbleMenuProps {
  editor: Editor;
}

const QUICK_COLORS = ['#dc2626', '#2563eb', '#16a34a', '#ca8a04', '#9333ea'];

export function InlineBubbleMenu({ editor }: InlineBubbleMenuProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [showColorPicker, setShowColorPicker] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    const { from, to, empty } = editor.state.selection;
    
    // Only show when there's a selection (not just cursor)
    if (empty) {
      setIsVisible(false);
      return;
    }

    // Get the selection coordinates
    const view = editor.view;
    const start = view.coordsAtPos(from);
    const end = view.coordsAtPos(to);
    
    // Calculate position above the selection
    const menuWidth = 320; // approximate menu width
    const left = Math.max(10, (start.left + end.left) / 2 - menuWidth / 2);
    const top = start.top - 50;

    setPosition({ top, left });
    setIsVisible(true);
  }, [editor]);

  useEffect(() => {
    const handleSelectionUpdate = () => {
      updatePosition();
    };

    const handleBlur = () => {
      // Delay hiding to allow clicking menu buttons
      setTimeout(() => {
        if (!menuRef.current?.contains(document.activeElement)) {
          setIsVisible(false);
        }
      }, 150);
    };

    editor.on('selectionUpdate', handleSelectionUpdate);
    editor.on('blur', handleBlur);

    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate);
      editor.off('blur', handleBlur);
    };
  }, [editor, updatePosition]);

  if (!isVisible) return null;

  const ToolbarButton = ({
    onClick,
    isActive,
    children,
    title,
  }: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    title?: string;
  }) => (
    <button
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      title={title}
      className={`p-1.5 rounded transition-all ${
        isActive
          ? 'bg-white/20 text-white'
          : 'text-gray-300 hover:bg-white/10 hover:text-white'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div
      ref={menuRef}
      className="fixed z-50 animate-in fade-in duration-150"
      style={{ top: position.top, left: position.left }}
    >
      <div className="flex items-center gap-0.5 bg-gray-900 rounded-lg px-1 py-0.5 shadow-xl">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Tučné"
        >
          <Bold size={16} />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Kurzíva"
        >
          <Italic size={16} />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          title="Podtržení"
        >
          <Underline size={16} />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          title="Přeškrtnutí"
        >
          <Strikethrough size={16} />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive('code')}
          title="Kód"
        >
          <Code size={16} />
        </ToolbarButton>

        <div className="w-px h-4 bg-gray-600 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          isActive={editor.isActive('highlight')}
          title="Zvýraznění"
        >
          <Highlighter size={16} />
        </ToolbarButton>

        <div className="relative">
          <ToolbarButton
            onClick={() => setShowColorPicker(!showColorPicker)}
            title="Barva textu"
          >
            <Palette size={16} />
          </ToolbarButton>
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 bg-gray-800 rounded-lg p-1 flex gap-1 shadow-xl z-50">
              {QUICK_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    editor.chain().focus().setColor(color).run();
                    setShowColorPicker(false);
                  }}
                  className="w-5 h-5 rounded hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-4 bg-gray-600 mx-1" />

        {editor.isActive('link') ? (
          <ToolbarButton
            onClick={() => editor.chain().focus().unsetLink().run()}
            title="Odstranit odkaz"
          >
            <Unlink size={16} />
          </ToolbarButton>
        ) : (
          <ToolbarButton
            onClick={() => {
              const url = window.prompt('URL odkazu:');
              if (url) {
                editor.chain().focus().setLink({ href: url }).run();
              }
            }}
            title="Vložit odkaz"
          >
            <LinkIcon size={16} />
          </ToolbarButton>
        )}
      </div>
    </div>
  );
}

export default InlineBubbleMenu;
