'use client';

import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';

// Core extensions
import StarterKit from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Typography } from '@tiptap/extension-typography';
import { CharacterCount as CharacterCountExt } from '@tiptap/extension-character-count';

// Marks
import { Underline } from '@tiptap/extension-underline';
import { Highlight } from '@tiptap/extension-highlight';
import { Link } from '@tiptap/extension-link';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';

// Nodes
import { Image } from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { Youtube } from '@tiptap/extension-youtube';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { HorizontalRule } from '@tiptap/extension-horizontal-rule';

// Functionality
import { TextAlign } from '@tiptap/extension-text-align';
import { Focus } from '@tiptap/extension-focus';
import { Dropcursor } from '@tiptap/extension-dropcursor';
import { Gapcursor } from '@tiptap/extension-gapcursor';
import { FontFamily } from '@tiptap/extension-font-family';
import { FontSize } from '@tiptap/extension-font-size';

// Lowlight for syntax highlighting
import { common, createLowlight } from 'lowlight';

// Local components
import { EditorToolbar } from './EditorToolbar';
import { LivePreview } from './LivePreview';
import { CharacterCount } from './CharacterCount';
import { InlineBubbleMenu } from './InlineBubbleMenu';
import { BlockFloatingMenu } from './BlockFloatingMenu';

// Custom extensions
import { LineHeight, BackgroundColor, CopyMarkdown } from './extensions';

// Styles
import './editor.css';

const lowlight = createLowlight(common);

interface TipTapEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  placeholder?: string;
  characterLimit?: number;
  showPreview?: boolean;
  onImageUpload?: (file: File) => Promise<string>;
  className?: string;
  editable?: boolean;
}

export function TipTapEditor({
  value = '',
  onChange,
  onBlur,
  onFocus,
  placeholder = 'Začněte psát...',
  characterLimit,
  showPreview = true,
  onImageUpload,
  className = '',
  editable = true,
}: TipTapEditorProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [previewMode, setPreviewMode] = useState<'split' | 'editor' | 'preview'>('split');
  const [htmlContent, setHtmlContent] = useState(value);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        horizontalRule: false,
        dropcursor: false,
        gapcursor: false,
      }),
      
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
      
      Typography,
      
      CharacterCountExt.configure({
        limit: characterLimit,
      }),
      
      // Marks
      Underline,
      Highlight.configure({
        multicolor: true,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer hover:text-blue-800',
        },
      }),
      TextStyle,
      Color.configure({
        types: ['textStyle'],
      }),
      Subscript,
      Superscript,
      
      // Nodes
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse',
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList.configure({
        HTMLAttributes: {
          class: 'not-prose',
        },
      }),
      TaskItem.configure({
        nested: true,
      }),
      Youtube.configure({
        width: 640,
        height: 360,
        HTMLAttributes: {
          class: 'youtube-embed-wrapper',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'not-prose',
        },
      }),
      HorizontalRule.configure({
        HTMLAttributes: {
          class: 'my-8 border-t-2 border-gray-200',
        },
      }),
      
      // Functionality
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Focus.configure({
        className: 'has-focus',
        mode: 'all',
      }),
      Dropcursor.configure({
        width: 2,
        color: '#3b82f6',
      }),
      Gapcursor,
      FontFamily.configure({
        types: ['textStyle'],
      }),
      FontSize.configure({
        types: ['textStyle'],
      }),
      
      // Custom extensions
      LineHeight,
      BackgroundColor,
      CopyMarkdown,
    ],
    content: value,
    editable,
    editorProps: {
      attributes: {
        class: 'tiptap-editor prose prose-gray max-w-none focus:outline-none min-h-[400px]',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setHtmlContent(html);
      onChange?.(html);
    },
    onBlur: () => {
      onBlur?.();
    },
    onFocus: () => {
      onFocus?.();
    },
  });

  // Mount check for SSR
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update editor content when value prop changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  // Get character and word counts
  const characterCount = editor?.storage.characterCount?.characters() || 0;
  const wordCount = editor?.storage.characterCount?.words() || 0;

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Načítám editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full bg-white rounded-lg overflow-hidden ${className}`}>
      {/* View Mode Switcher */}
      {showPreview && (
        <div className="flex items-center justify-end gap-1 px-2 py-1 bg-gray-100 border-b border-gray-200">
          <button
            onClick={() => setPreviewMode('editor')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              previewMode === 'editor'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Editor
          </button>
          <button
            onClick={() => setPreviewMode('split')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              previewMode === 'split'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Split
          </button>
          <button
            onClick={() => setPreviewMode('preview')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              previewMode === 'preview'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Náhled
          </button>
        </div>
      )}

      {/* Toolbar */}
      {previewMode !== 'preview' && (
        <EditorToolbar editor={editor} onImageUpload={onImageUpload} />
      )}

      {/* Editor & Preview Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        {previewMode !== 'preview' && (
          <div
            className={`${
              previewMode === 'split' && showPreview ? 'w-1/2' : 'w-full'
            } overflow-y-auto border-r border-gray-200 relative`}
          >
            {/* Inline Bubble Menu for text selection */}
            {editor && <InlineBubbleMenu editor={editor} />}
            
            {/* Block Floating Menu for empty lines */}
            {editor && <BlockFloatingMenu editor={editor} />}

            <EditorContent editor={editor} className="h-full" />
          </div>
        )}

        {/* Live Preview */}
        {showPreview && previewMode !== 'editor' && (
          <div
            className={`${
              previewMode === 'split' ? 'w-1/2' : 'w-full'
            } overflow-y-auto bg-white`}
          >
            <LivePreview content={htmlContent} />
          </div>
        )}
      </div>

      {/* Character Count Footer */}
      <CharacterCount
        characters={characterCount}
        words={wordCount}
        limit={characterLimit}
      />
    </div>
  );
}

export default TipTapEditor;
