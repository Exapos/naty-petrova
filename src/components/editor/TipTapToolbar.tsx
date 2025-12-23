'use client';

import React from 'react';
import { Editor } from '@tiptap/react';
import {
  BoldIcon,
  ItalicIcon,
  Bars3Icon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  LinkIcon,
  PhotoIcon,
  TableCellsIcon,
  ListBulletIcon,
  NumberedListIcon,
  ArrowLeftIcon,
  SparklesIcon,
  ArrowRightIcon,
  MinusIcon,
  SwatchIcon,
  EyeIcon,
  CodeBracketIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import './Toolbar.css';

interface ToolbarProps {
  editor: Editor;
}

const FONT_FAMILIES = [
  { value: 'system-ui, sans-serif', label: 'Sans Serif' },
  { value: '"Merriweather", serif', label: 'Serif' },
  { value: '"Courier New", monospace', label: 'Monospace' },
  { value: '"Georgia", serif', label: 'Georgia' },
];

const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32];

const TEXT_COLORS = [
  '#000000',
  '#374151',
  '#6B7280',
  '#EF4444',
  '#F97316',
  '#EAB308',
  '#22C55E',
  '#06B6D4',
  '#3B82F6',
  '#8B5CF6',
];

const HIGHLIGHT_COLORS = [
  '#FBBF24',
  '#86EFAC',
  '#93C5FD',
  '#F472B6',
  '#DDD6FE',
  '#FED7AA',
];

const ToolbarButton: React.FC<{
  onClick: () => void;
  active?: boolean;
  title?: string;
  icon: React.ReactNode;
  disabled?: boolean;
}> = ({ onClick, active, title, icon, disabled }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-2 rounded-md transition-colors ${
      active
        ? 'bg-blue-100 text-blue-700'
        : 'text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
    }`}
  >
    {icon}
  </motion.button>
);

const ColorPicker: React.FC<{
  colors: string[];
  value?: string;
  onChange: (color: string) => void;
}> = ({ colors, onChange }) => (
  <div className="flex gap-1 p-2 bg-white border border-gray-200 rounded-lg shadow-lg flex-wrap w-48">
    {colors.map((color) => (
      <motion.button
        key={color}
        whileHover={{ scale: 1.15 }}
        onClick={() => onChange(color)}
        className="w-6 h-6 rounded-md border-2 border-gray-300 hover:border-gray-500 transition-colors"
        style={{ backgroundColor: color }}
        title={color}
      />
    ))}
  </div>
);

export const Toolbar: React.FC<ToolbarProps> = ({ editor }) => {
  const [showColorPicker, setShowColorPicker] = React.useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = React.useState(false);
  const [showFontFamily, setShowFontFamily] = React.useState(false);
  const [showFontSize, setShowFontSize] = React.useState(false);

  if (!editor) {
    return (
      <div className="toolbar bg-white">
        <div className="toolbar-row p-3">
          <div className="text-sm text-gray-500">Načítám editor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="toolbar bg-white relative z-20">
      {/* Main toolbar - single row with scroll */}
      <div className="toolbar-row overflow-x-auto">
        <div className="flex items-center gap-1 min-w-min">
          {/* Formatting */}
          <div className="toolbar-group">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              active={editor.isActive('bold')}
              icon={<BoldIcon className="w-4 h-4" />}
              title="Tučné (Ctrl+B)"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              active={editor.isActive('italic')}
              icon={<ItalicIcon className="w-4 h-4" />}
              title="Kurzíva (Ctrl+I)"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              active={editor.isActive('underline')}
              icon={<Bars3Icon className="w-4 h-4" />}
              title="Podtržení"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCode().run()}
              active={editor.isActive('code')}
              icon={<CodeBracketIcon className="w-4 h-4" />}
              title="Kód"
            />
          </div>

          <div className="toolbar-divider" />

          {/* Undo/Redo */}
          <div className="toolbar-group">
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              icon={<ArrowUturnLeftIcon className="w-4 h-4" />}
              title="Vrátit zpět"
              disabled={!editor.can().undo()}
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              icon={<ArrowUturnRightIcon className="w-4 h-4" />}
              title="Znovu"
              disabled={!editor.can().redo()}
            />
          </div>

          <div className="toolbar-divider" />

          {/* Lists */}
          <div className="toolbar-group">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              active={editor.isActive('bulletList')}
              icon={<ListBulletIcon className="w-4 h-4" />}
              title="Odrážky"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              active={editor.isActive('orderedList')}
              icon={<NumberedListIcon className="w-4 h-4" />}
              title="Číslování"
            />
          </div>

          <div className="toolbar-divider" />

          {/* Headings */}
          <div className="toolbar-group">
            {[1, 2, 3].map((level) => (
              <ToolbarButton
                key={level}
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .setHeading({ level: level as any })
                    .run()
                }
                active={editor.isActive('heading', { level: level as any })}
                icon={<span className="font-bold text-xs">H{level}</span>}
                title={`Nadpis ${level}`}
              />
            ))}
          </div>

          <div className="toolbar-divider" />

          {/* Colors */}
          <div className="toolbar-group relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              title="Barva"
            >
              <SwatchIcon className="w-4 h-4" />
            </button>
            {showColorPicker && (
              <div className="absolute top-full left-0 mt-1 z-1000">
                <ColorPicker
                  colors={TEXT_COLORS}
                  onChange={(color) => {
                    editor.chain().focus().setColor(color).run();
                    setShowColorPicker(false);
                  }}
                />
              </div>
            )}
          </div>

          {/* Highlight */}
          <div className="toolbar-group relative">
            <button
              onClick={() => setShowHighlightPicker(!showHighlightPicker)}
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              title="Zvýraznění"
            >
              <div className="w-4 h-4 rounded bg-yellow-300" />
            </button>
            {showHighlightPicker && (
              <div className="absolute top-full left-0 mt-1 z-1000">
                <ColorPicker
                  colors={HIGHLIGHT_COLORS}
                  onChange={(color) => {
                    editor.chain().focus().setHighlight({ color }).run();
                    setShowHighlightPicker(false);
                  }}
                />
              </div>
            )}
          </div>

          <div className="toolbar-divider" />

          {/* Text Align */}
          <div className="toolbar-group">
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              active={editor.isActive({ textAlign: 'left' })}
              icon={<ArrowLeftIcon className="w-4 h-4" />}
              title="Vlevo"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              active={editor.isActive({ textAlign: 'center' })}
              icon={<SparklesIcon className="w-4 h-4" />}
              title="Střed"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              active={editor.isActive({ textAlign: 'right' })}
              icon={<ArrowRightIcon className="w-4 h-4" />}
              title="Vpravo"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              active={editor.isActive({ textAlign: 'justify' })}
              icon={<MinusIcon className="w-4 h-4" />}
              title="Do bloku"
            />
          </div>

          <div className="toolbar-divider" />

          {/* Links */}
          <div className="toolbar-group">
            <ToolbarButton
              onClick={() => {
                const url = prompt('Zadejte URL:');
                if (url) {
                  editor.chain().focus().setLink({ href: url }).run();
                }
              }}
              active={editor.isActive('link')}
              icon={<LinkIcon className="w-4 h-4" />}
              title="Odkaz"
            />
          </div>

          <div className="toolbar-divider" />

          {/* Media & Tables */}
          <div className="toolbar-group">
            <ToolbarButton
              onClick={() => {
                const url = prompt('Zadejte URL obrázku:');
                if (url) {
                  editor.chain().focus().setImage({ src: url }).run();
                }
              }}
              icon={<PhotoIcon className="w-4 h-4" />}
              title="Obrázek"
            />
            <ToolbarButton
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                  .run()
              }
              icon={<TableCellsIcon className="w-4 h-4" />}
              title="Tabulka"
            />
          </div>

          <div className="toolbar-divider" />

          {/* Code Block */}
          <div className="toolbar-group">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              active={editor.isActive('codeBlock')}
              icon={<CodeBracketIcon className="w-4 h-4" />}
              title="Kód"
            />
          </div>

          <div className="toolbar-divider" />

          {/* Blockquote */}
          <div className="toolbar-group">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              active={editor.isActive('blockquote')}
              icon={<span className="font-bold text-xs">&quot;</span>}
              title="Citace"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
