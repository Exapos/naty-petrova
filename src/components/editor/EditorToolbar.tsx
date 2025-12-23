'use client';

import React, { useCallback, useState } from 'react';
import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Minus,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  Subscript,
  Superscript,
  Youtube,
  Undo,
  Redo,
  Palette,
  Type,
  ChevronDown,
  MoreHorizontal,
  FileCode,
  Trash2,
  Plus,
  RowsIcon,
  ColumnsIcon,
} from 'lucide-react';

interface EditorToolbarProps {
  editor: Editor | null;
  onImageUpload?: (file: File) => Promise<string>;
}

const FONT_SIZES = ['12', '14', '16', '18', '20', '24', '28', '32', '36', '48'];
const FONT_FAMILIES = [
  { name: 'Sans Serif', value: 'Inter, sans-serif' },
  { name: 'Serif', value: 'Georgia, serif' },
  { name: 'Monospace', value: 'JetBrains Mono, monospace' },
];

const COLORS = [
  '#000000', '#374151', '#6b7280', '#9ca3af',
  '#dc2626', '#ea580c', '#d97706', '#ca8a04',
  '#16a34a', '#059669', '#0d9488', '#0891b2',
  '#2563eb', '#4f46e5', '#7c3aed', '#9333ea',
  '#c026d3', '#db2777', '#e11d48', '#f43f5e',
];

const HIGHLIGHT_COLORS = [
  '#fef08a', '#bbf7d0', '#bfdbfe', '#ddd6fe',
  '#fbcfe8', '#fecaca', '#fed7aa', '#fef3c7',
];

export function EditorToolbar({ editor, onImageUpload }: EditorToolbarProps) {
  const [showFontSize, setShowFontSize] = useState(false);
  const [showFontFamily, setShowFontFamily] = useState(false);
  const [showTextColor, setShowTextColor] = useState(false);
  const [showHighlightColor, setShowHighlightColor] = useState(false);
  const [showTableMenu, setShowTableMenu] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showYoutubeInput, setShowYoutubeInput] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');

  const handleImageUpload = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        if (onImageUpload) {
          const url = await onImageUpload(file);
          editor?.chain().focus().setImage({ src: url }).run();
        } else {
          // Fallback to base64
          const reader = new FileReader();
          reader.onload = () => {
            editor?.chain().focus().setImage({ src: reader.result as string }).run();
          };
          reader.readAsDataURL(file);
        }
      }
    };
    input.click();
  }, [editor, onImageUpload]);

  const setLink = useCallback(() => {
    if (linkUrl) {
      editor?.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
      setLinkUrl('');
    }
    setShowLinkInput(false);
  }, [editor, linkUrl]);

  const removeLink = useCallback(() => {
    editor?.chain().focus().unsetLink().run();
  }, [editor]);

  const insertYoutube = useCallback(() => {
    if (youtubeUrl) {
      editor?.chain().focus().setYoutubeVideo({ src: youtubeUrl }).run();
      setYoutubeUrl('');
    }
    setShowYoutubeInput(false);
  }, [editor, youtubeUrl]);

  if (!editor) return null;

  const ToolbarButton = ({
    onClick,
    isActive,
    disabled,
    children,
    title,
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title?: string;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded-lg transition-all duration-200 ${
        isActive
          ? 'bg-blue-100 text-blue-700'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );

  const Divider = () => <div className="w-px h-6 bg-gray-300 mx-1" />;

  return (
    <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-gray-200 bg-gray-50">
      {/* Undo/Redo */}
      <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Zpět (Ctrl+Z)">
        <Undo size={18} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Znovu (Ctrl+Y)">
        <Redo size={18} />
      </ToolbarButton>

      <Divider />

      {/* Font Family */}
      <div className="relative">
        <button
          onClick={() => setShowFontFamily(!showFontFamily)}
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-gray-600 hover:bg-gray-100"
        >
          <Type size={16} />
          <span className="text-sm">Font</span>
          <ChevronDown size={14} />
        </button>
        {showFontFamily && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-32">
            {FONT_FAMILIES.map((font) => (
              <button
                key={font.value}
                onClick={() => {
                  editor.chain().focus().setFontFamily(font.value).run();
                  setShowFontFamily(false);
                }}
                className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                style={{ fontFamily: font.value }}
              >
                {font.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Font Size */}
      <div className="relative">
        <button
          onClick={() => setShowFontSize(!showFontSize)}
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-gray-600 hover:bg-gray-100"
        >
          <span className="text-sm">16px</span>
          <ChevronDown size={14} />
        </button>
        {showFontSize && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
            {FONT_SIZES.map((size) => (
              <button
                key={size}
                onClick={() => {
                  editor.chain().focus().setFontSize(`${size}px`).run();
                  setShowFontSize(false);
                }}
                className="block w-full px-3 py-1.5 text-left text-sm hover:bg-gray-100"
              >
                {size}px
              </button>
            ))}
          </div>
        )}
      </div>

      <Divider />

      {/* Headings */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive('heading', { level: 1 })}
        title="Nadpis 1"
      >
        <Heading1 size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
        title="Nadpis 2"
      >
        <Heading2 size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive('heading', { level: 3 })}
        title="Nadpis 3"
      >
        <Heading3 size={18} />
      </ToolbarButton>

      <Divider />

      {/* Basic Formatting */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        title="Tučné (Ctrl+B)"
      >
        <Bold size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        title="Kurzíva (Ctrl+I)"
      >
        <Italic size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive('underline')}
        title="Podtržení (Ctrl+U)"
      >
        <Underline size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        title="Přeškrtnutí"
      >
        <Strikethrough size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive('code')}
        title="Kód"
      >
        <Code size={18} />
      </ToolbarButton>

      <Divider />

      {/* Text Color */}
      <div className="relative">
        <button
          onClick={() => setShowTextColor(!showTextColor)}
          className="flex items-center gap-0.5 p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          title="Barva textu"
        >
          <Palette size={18} />
          <ChevronDown size={12} />
        </button>
        {showTextColor && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-2">
            <div className="grid grid-cols-4 gap-1">
              {COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    editor.chain().focus().setColor(color).run();
                    setShowTextColor(false);
                  }}
                  className="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <button
              onClick={() => {
                editor.chain().focus().unsetColor().run();
                setShowTextColor(false);
              }}
              className="mt-2 w-full text-xs text-gray-600 hover:text-gray-900"
            >
              Odstranit barvu
            </button>
          </div>
        )}
      </div>

      {/* Highlight */}
      <div className="relative">
        <button
          onClick={() => setShowHighlightColor(!showHighlightColor)}
          className={`flex items-center gap-0.5 p-2 rounded-lg transition-all ${
            editor.isActive('highlight')
              ? 'bg-yellow-100 text-yellow-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          title="Zvýraznění"
        >
          <Highlighter size={18} />
          <ChevronDown size={12} />
        </button>
        {showHighlightColor && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-2">
            <div className="grid grid-cols-4 gap-1">
              {HIGHLIGHT_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    editor.chain().focus().toggleHighlight({ color }).run();
                    setShowHighlightColor(false);
                  }}
                  className="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <button
              onClick={() => {
                editor.chain().focus().unsetHighlight().run();
                setShowHighlightColor(false);
              }}
              className="mt-2 w-full text-xs text-gray-600 hover:text-gray-900"
            >
              Odstranit zvýraznění
            </button>
          </div>
        )}
      </div>

      <Divider />

      {/* Subscript/Superscript */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        isActive={editor.isActive('subscript')}
        title="Dolní index"
      >
        <Subscript size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        isActive={editor.isActive('superscript')}
        title="Horní index"
      >
        <Superscript size={18} />
      </ToolbarButton>

      <Divider />

      {/* Text Alignment */}
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        isActive={editor.isActive({ textAlign: 'left' })}
        title="Zarovnat vlevo"
      >
        <AlignLeft size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        isActive={editor.isActive({ textAlign: 'center' })}
        title="Zarovnat na střed"
      >
        <AlignCenter size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        isActive={editor.isActive({ textAlign: 'right' })}
        title="Zarovnat vpravo"
      >
        <AlignRight size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        isActive={editor.isActive({ textAlign: 'justify' })}
        title="Zarovnat do bloku"
      >
        <AlignJustify size={18} />
      </ToolbarButton>

      <Divider />

      {/* Lists */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        title="Odrážkový seznam"
      >
        <List size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        title="Číslovaný seznam"
      >
        <ListOrdered size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        isActive={editor.isActive('taskList')}
        title="Seznam úkolů"
      >
        <CheckSquare size={18} />
      </ToolbarButton>

      <Divider />

      {/* Blockquote & Code Block */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        title="Citace"
      >
        <Quote size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={editor.isActive('codeBlock')}
        title="Blok kódu"
      >
        <FileCode size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Horizontální čára"
      >
        <Minus size={18} />
      </ToolbarButton>

      <Divider />

      {/* Link */}
      <div className="relative">
        <ToolbarButton
          onClick={() => {
            if (editor.isActive('link')) {
              removeLink();
            } else {
              setShowLinkInput(!showLinkInput);
            }
          }}
          isActive={editor.isActive('link')}
          title="Odkaz"
        >
          <LinkIcon size={18} />
        </ToolbarButton>
        {showLinkInput && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-2 flex gap-2">
            <input
              type="url"
              placeholder="https://..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="px-2 py-1 text-sm border border-gray-300 rounded"
              onKeyDown={(e) => e.key === 'Enter' && setLink()}
            />
            <button
              onClick={setLink}
              className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        )}
      </div>

      {/* Image */}
      <ToolbarButton onClick={handleImageUpload} title="Vložit obrázek">
        <ImageIcon size={18} />
      </ToolbarButton>

      {/* YouTube */}
      <div className="relative">
        <ToolbarButton
          onClick={() => setShowYoutubeInput(!showYoutubeInput)}
          title="Vložit YouTube video"
        >
          <Youtube size={18} />
        </ToolbarButton>
        {showYoutubeInput && (
          <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-2 flex gap-2">
            <input
              type="url"
              placeholder="YouTube URL..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="px-2 py-1 text-sm border border-gray-300 rounded w-64"
              onKeyDown={(e) => e.key === 'Enter' && insertYoutube()}
            />
            <button
              onClick={insertYoutube}
              className="px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              Vložit
            </button>
          </div>
        )}
      </div>

      <Divider />

      {/* Table */}
      <div className="relative">
        <button
          onClick={() => setShowTableMenu(!showTableMenu)}
          className="flex items-center gap-0.5 p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          title="Tabulka"
        >
          <TableIcon size={18} />
          <ChevronDown size={12} />
        </button>
        {showTableMenu && (
          <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-2 min-w-48">
            <button
              onClick={() => {
                editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run();
                setShowTableMenu(false);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-gray-100 rounded"
            >
              <Plus size={16} /> Vložit tabulku (3x3)
            </button>
            <div className="border-t border-gray-200 my-1" />
            <button
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              disabled={!editor.can().addColumnAfter()}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-gray-100 rounded disabled:opacity-50"
            >
              <ColumnsIcon size={16} /> Přidat sloupec
            </button>
            <button
              onClick={() => editor.chain().focus().addRowAfter().run()}
              disabled={!editor.can().addRowAfter()}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-gray-100 rounded disabled:opacity-50"
            >
              <RowsIcon size={16} /> Přidat řádek
            </button>
            <div className="border-t border-gray-200 my-1" />
            <button
              onClick={() => editor.chain().focus().deleteColumn().run()}
              disabled={!editor.can().deleteColumn()}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-gray-100 rounded text-red-600 disabled:opacity-50"
            >
              <Trash2 size={16} /> Smazat sloupec
            </button>
            <button
              onClick={() => editor.chain().focus().deleteRow().run()}
              disabled={!editor.can().deleteRow()}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-gray-100 rounded text-red-600 disabled:opacity-50"
            >
              <Trash2 size={16} /> Smazat řádek
            </button>
            <button
              onClick={() => {
                editor.chain().focus().deleteTable().run();
                setShowTableMenu(false);
              }}
              disabled={!editor.can().deleteTable()}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-gray-100 rounded text-red-600 disabled:opacity-50"
            >
              <Trash2 size={16} /> Smazat tabulku
            </button>
          </div>
        )}
      </div>

      <Divider />

      {/* More Options */}
      <ToolbarButton onClick={() => {}} title="Další možnosti">
        <MoreHorizontal size={18} />
      </ToolbarButton>
    </div>
  );
}

export default EditorToolbar;
