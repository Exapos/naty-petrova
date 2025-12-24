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

const QUICK_COLORS = [
  '#dc2626', '#ea580c', '#ca8a04', '#16a34a', '#0d9488', '#0891b2',
  '#2563eb', '#7c3aed', '#c026d3', '#e11d48', '#000000', '#6b7280',
];

export function InlineBubbleMenu({ editor }: InlineBubbleMenuProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customColor, setCustomColor] = useState('#000000');
  const menuRef = useRef<HTMLDivElement>(null);
  const isInteracting = useRef(false);

  const updatePosition = useCallback(() => {
    const { from, to, empty } = editor.state.selection;
    
    // Only show when there's a selection (not just cursor)
    if (empty) {
      if (!isInteracting.current) {
        setIsVisible(false);
        setShowColorPicker(false);
      }
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
      if (!isInteracting.current) {
        updatePosition();
      }
    };

    const handleBlur = () => {
      // Delay hiding to allow clicking menu buttons
      setTimeout(() => {
        if (!isInteracting.current && !menuRef.current?.contains(document.activeElement)) {
          setIsVisible(false);
          setShowColorPicker(false);
        }
      }, 200);
    };

    editor.on('selectionUpdate', handleSelectionUpdate);
    editor.on('blur', handleBlur);

    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate);
      editor.off('blur', handleBlur);
    };
  }, [editor, updatePosition]);

  // Handle clicks outside to close color picker
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowColorPicker(false);
        isInteracting.current = false;
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isVisible) return null;

  const ToolbarButton = ({
    onAction,
    isActive,
    children,
    title,
  }: {
    onAction: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    title?: string;
  }) => (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        isInteracting.current = true;
        onAction();
        // Re-focus editor after action
        setTimeout(() => {
          isInteracting.current = false;
        }, 100);
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
      onMouseDown={(e) => {
        e.preventDefault();
        isInteracting.current = true;
      }}
      onMouseUp={() => {
        setTimeout(() => {
          isInteracting.current = false;
        }, 100);
      }}
    >
      <div className="flex items-center gap-0.5 bg-gray-900 rounded-lg px-1 py-0.5 shadow-xl">
        <ToolbarButton
          onAction={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Tučné"
        >
          <Bold size={16} />
        </ToolbarButton>
        
        <ToolbarButton
          onAction={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Kurzíva"
        >
          <Italic size={16} />
        </ToolbarButton>
        
        <ToolbarButton
          onAction={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          title="Podtržení"
        >
          <Underline size={16} />
        </ToolbarButton>
        
        <ToolbarButton
          onAction={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          title="Přeškrtnutí"
        >
          <Strikethrough size={16} />
        </ToolbarButton>
        
        <ToolbarButton
          onAction={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive('code')}
          title="Kód"
        >
          <Code size={16} />
        </ToolbarButton>

        <div className="w-px h-4 bg-gray-600 mx-1" />

        <ToolbarButton
          onAction={() => editor.chain().focus().toggleHighlight().run()}
          isActive={editor.isActive('highlight')}
          title="Zvýraznění"
        >
          <Highlighter size={16} />
        </ToolbarButton>

        {/* Color Picker */}
        <div className="relative">
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              isInteracting.current = true;
              setShowColorPicker(!showColorPicker);
            }}
            title="Barva textu"
            className="p-1.5 rounded transition-all text-gray-300 hover:bg-white/10 hover:text-white"
          >
            <Palette size={16} />
          </button>
          {showColorPicker && (
            <div 
              className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-gray-800 rounded-lg p-3 shadow-xl z-50 w-48"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                isInteracting.current = true;
              }}
            >
              <p className="text-xs text-gray-400 mb-2">Rychlé barvy</p>
              <div className="grid grid-cols-6 gap-1.5 mb-3">
                {QUICK_COLORS.map((color) => (
                  <button
                    key={color}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      editor.chain().focus().setColor(color).run();
                      setShowColorPicker(false);
                      setTimeout(() => { isInteracting.current = false; }, 100);
                    }}
                    className="w-6 h-6 rounded hover:scale-110 transition-transform border border-gray-600"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
              <div className="border-t border-gray-700 pt-3">
                <p className="text-xs text-gray-400 mb-2">Vlastní barva</p>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="flex-1 px-2 py-1 text-xs border border-gray-600 rounded bg-gray-700 text-white"
                    placeholder="#hex"
                  />
                  <button
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      editor.chain().focus().setColor(customColor).run();
                      setShowColorPicker(false);
                      setTimeout(() => { isInteracting.current = false; }, 100);
                    }}
                    className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    OK
                  </button>
                </div>
              </div>
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  editor.chain().focus().unsetColor().run();
                  setShowColorPicker(false);
                  setTimeout(() => { isInteracting.current = false; }, 100);
                }}
                className="mt-2 w-full py-1 text-xs text-gray-400 hover:text-white hover:bg-gray-700 rounded"
              >
                Odstranit barvu
              </button>
            </div>
          )}
        </div>

        <div className="w-px h-4 bg-gray-600 mx-1" />

        {editor.isActive('link') ? (
          <ToolbarButton
            onAction={() => editor.chain().focus().unsetLink().run()}
            title="Odstranit odkaz"
          >
            <Unlink size={16} />
          </ToolbarButton>
        ) : (
          <ToolbarButton
            onAction={() => {
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
