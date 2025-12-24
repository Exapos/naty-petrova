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

const FONT_SIZES = [
  { size: '12', label: '12px - Malý' },
  { size: '14', label: '14px - Základní' },
  { size: '16', label: '16px - Normální' },
  { size: '18', label: '18px - Střední' },
  { size: '20', label: '20px - Větší' },
  { size: '24', label: '24px - Velký' },
  { size: '28', label: '28px - Nadpis' },
  { size: '32', label: '32px - H3' },
  { size: '36', label: '36px - H2' },
  { size: '48', label: '48px - H1' },
];
const FONT_FAMILIES = [
  { name: 'Inter', value: 'Inter, sans-serif' },
  { name: 'Open Sans', value: 'Open Sans, sans-serif' },
  { name: 'Roboto', value: 'Roboto, sans-serif' },
  { name: 'Poppins', value: 'Poppins, sans-serif' },
  { name: 'Lato', value: 'Lato, sans-serif' },
  { name: 'Montserrat', value: 'Montserrat, sans-serif' },
  { name: 'Playfair Display', value: 'Playfair Display, serif' },
  { name: 'Merriweather', value: 'Merriweather, serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Source Code Pro', value: 'Source Code Pro, monospace' },
  { name: 'JetBrains Mono', value: 'JetBrains Mono, monospace' },
];

const COLORS = [
  // Row 1 - Grays
  '#000000', '#374151', '#6b7280', '#9ca3af', '#d1d5db', '#f3f4f6',
  // Row 2 - Warm
  '#dc2626', '#ea580c', '#d97706', '#ca8a04', '#84cc16', '#22c55e',
  // Row 3 - Cool
  '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6',
  // Row 4 - Purple/Pink
  '#a855f7', '#c026d3', '#db2777', '#e11d48', '#f43f5e', '#fb7185',
];

const HIGHLIGHT_COLORS = [
  '#fef08a', '#bbf7d0', '#bfdbfe', '#ddd6fe',
  '#fbcfe8', '#fecaca', '#fed7aa', '#fef3c7',
  '#a5f3fc', '#c7d2fe', '#f5d0fe', '#fce7f3',
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
  const [customColor, setCustomColor] = useState('#3b82f6');
  const [customHighlight, setCustomHighlight] = useState('#fef08a');

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
      // Try to extract video ID to validate
      const patterns = [
        /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
        /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
        /[?&]v=([a-zA-Z0-9_-]{11})/,
        /^([a-zA-Z0-9_-]{11})$/,
      ];
      
      let videoId: string | null = null;
      for (const pattern of patterns) {
        const match = youtubeUrl.match(pattern);
        if (match && match[1]) {
          videoId = match[1];
          break;
        }
      }
      
      if (videoId) {
        editor?.chain().focus().setYoutubeVideo({ src: youtubeUrl }).run();
        setYoutubeUrl('');
        setShowYoutubeInput(false);
      } else {
        alert('Neplatná YouTube URL. Zkuste formát: https://www.youtube.com/watch?v=VIDEO_ID');
      }
    }
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
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-48 max-h-64 overflow-y-auto">
            {FONT_FAMILIES.map((font) => (
              <button
                key={font.value}
                onClick={() => {
                  editor.chain().focus().setFontFamily(font.value).run();
                  setShowFontFamily(false);
                }}
                className="block w-full px-3 py-2 text-left hover:bg-gray-100 border-b border-gray-50 last:border-0"
                style={{ fontFamily: font.value }}
              >
                <span className="text-sm">{font.name}</span>
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
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-44 max-h-64 overflow-y-auto">
            {FONT_SIZES.map((item) => (
              <button
                key={item.size}
                onClick={() => {
                  editor.chain().focus().setFontSize(`${item.size}px`).run();
                  setShowFontSize(false);
                }}
                className="flex items-center justify-between w-full px-3 py-2 text-left hover:bg-gray-100 border-b border-gray-50 last:border-0"
              >
                <span style={{ fontSize: `${Math.min(parseInt(item.size), 24)}px` }}>
                  Aa
                </span>
                <span className="text-xs text-gray-500">{item.label}</span>
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
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-3 w-56">
            <p className="text-xs text-gray-500 mb-2 font-medium">Barva textu</p>
            <div className="grid grid-cols-6 gap-1.5 mb-3">
              {COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    editor.chain().focus().setColor(color).run();
                    setShowTextColor(false);
                  }}
                  className="w-7 h-7 rounded-md border border-gray-200 hover:scale-110 hover:shadow-md transition-all"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <div className="border-t border-gray-200 pt-3">
              <p className="text-xs text-gray-500 mb-2">Vlastní barva</p>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border-0"
                />
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="flex-1 px-2 py-1.5 text-xs border border-gray-300 rounded"
                  placeholder="#hex"
                />
                <button
                  onClick={() => {
                    editor.chain().focus().setColor(customColor).run();
                    setShowTextColor(false);
                  }}
                  className="px-2 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  OK
                </button>
              </div>
            </div>
            <button
              onClick={() => {
                editor.chain().focus().unsetColor().run();
                setShowTextColor(false);
              }}
              className="mt-3 w-full py-1.5 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
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
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-3 w-56">
            <p className="text-xs text-gray-500 mb-2 font-medium">Zvýraznění</p>
            <div className="grid grid-cols-4 gap-1.5 mb-3">
              {HIGHLIGHT_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    editor.chain().focus().toggleHighlight({ color }).run();
                    setShowHighlightColor(false);
                  }}
                  className="w-10 h-7 rounded-md border border-gray-200 hover:scale-105 hover:shadow-md transition-all"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <div className="border-t border-gray-200 pt-3">
              <p className="text-xs text-gray-500 mb-2">Vlastní barva</p>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customHighlight}
                  onChange={(e) => setCustomHighlight(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border-0"
                />
                <input
                  type="text"
                  value={customHighlight}
                  onChange={(e) => setCustomHighlight(e.target.value)}
                  className="flex-1 px-2 py-1.5 text-xs border border-gray-300 rounded"
                  placeholder="#hex"
                />
                <button
                  onClick={() => {
                    editor.chain().focus().toggleHighlight({ color: customHighlight }).run();
                    setShowHighlightColor(false);
                  }}
                  className="px-2 py-1.5 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  OK
                </button>
              </div>
            </div>
            <button
              onClick={() => {
                editor.chain().focus().unsetHighlight().run();
                setShowHighlightColor(false);
              }}
              className="mt-3 w-full py-1.5 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
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
