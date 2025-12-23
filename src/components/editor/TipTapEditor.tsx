'use client';

import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import BubbleMenuExtension from '@tiptap/extension-bubble-menu';
import FloatingMenuExtension from '@tiptap/extension-floating-menu';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import DragHandleReact from '@tiptap/extension-drag-handle-react';
import Dropcursor from '@tiptap/extension-dropcursor';
import FileHandler from '@tiptap/extension-file-handler';
import Focus from '@tiptap/extension-focus';
import FontFamily from '@tiptap/extension-font-family';
import FontSize from '@tiptap/extension-font-size';
import Gapcursor from '@tiptap/extension-gapcursor';
import InvisibleCharacters from '@tiptap/extension-invisible-characters';
import ListKeymap from '@tiptap/extension-list-keymap';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import TableOfContents from '@tiptap/extension-table-of-contents';
import TextAlign from '@tiptap/extension-text-align';
import Typography from '@tiptap/extension-typography';
import Underline from '@tiptap/extension-underline';
import CharacterCount from '@tiptap/extension-character-count';

import { motion } from 'framer-motion';
import { Toolbar } from './TipTapToolbar';
import './TipTapEditor.css';

interface TipTapEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export const TipTapEditor: React.FC<TipTapEditorProps> = ({
  value,
  onChange,
  placeholder = 'Začněte psát...',
}) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      BubbleMenuExtension.configure({
        shouldShow: ({ editor }) => {
          return editor.isActive('heading') || editor.isActive('paragraph');
        },
      }),
      FloatingMenuExtension.configure({
        shouldShow: ({ editor, state }) => {
          return editor.isActive('paragraph') && state.selection.empty;
        },
      }),
      TextStyle,
      Color.configure({
        types: ['textStyle'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      DragHandleReact,
      Dropcursor.configure({
        width: 2,
        class: 'ProseMirror-dropcursor',
        color: '#3b82f6',
      }),
      FileHandler.configure({
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
        onDrop: (currentEditor, files) => {
          files.forEach((file) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
              currentEditor
                .chain()
                .insertContent({
                  type: 'image',
                  attrs: {
                    src: reader.result,
                  },
                })
                .focus()
                .run();
            };
          });
        },
        onPaste: (currentEditor, files) => {
          files.forEach((file) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
              currentEditor
                .chain()
                .insertContent({
                  type: 'image',
                  attrs: {
                    src: reader.result,
                  },
                })
                .focus()
                .run();
            };
          });
        },
      }),
      Focus.configure({
        className: 'has-focus',
        mode: 'all',
      }),
      FontFamily.configure({
        types: ['textStyle'],
      }),
      FontSize.configure({
        types: ['textStyle'],
      }),
      Gapcursor,
      InvisibleCharacters.configure({
        HTML: false,
      }),
      ListKeymap,
      Placeholder.configure({
        placeholder,
      }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'prose-img',
        },
      }),
      Link.configure({
        openOnClick: true,
        autolink: true,
        linkOnPaste: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TableOfContents.configure({
        levels: [1, 2, 3],
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Typography,
      Underline,
      CharacterCount.configure({
        limit: 50000,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
    >
      {/* Sticky Toolbar */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white">
        <Toolbar editor={editor} showPreview={false} onPreviewToggle={() => {}} />
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Editor Content - Full Width */}
        <div className="flex-1 overflow-auto bg-white">
          <div className="tiptap-container h-full">
            <EditorContent editor={editor} className="tiptap-editor" />
          </div>
        </div>

        {/* Status Bar */}
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-2 flex items-center justify-between text-xs text-gray-600">
          <div className="flex gap-4">
            <span>
              {editor && editor.storage?.characterCount?.characters?.() 
                ? `${editor.storage.characterCount.characters()} znaků` 
                : '0 znaků'}
            </span>
            {editor && (
              <span>
                {editor.getJSON().content?.reduce((acc: number, node: any) => {
                  if (node.type === 'paragraph' && node.content?.[0]?.text) {
                    return acc + node.content[0].text.split(/\s+/).filter((w: string) => w).length;
                  }
                  return acc;
                }, 0) || 0} slov
              </span>
            )}
          </div>
          <div className="text-gray-400">
            {editor?.isActive('bold') && <span className="mr-2">Bold</span>}
            {editor?.isActive('italic') && <span className="mr-2">Italic</span>}
            {editor?.isActive('underline') && <span>Underline</span>}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
