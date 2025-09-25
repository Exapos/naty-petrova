'use client';

import React, { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Toolbar from './Toolbar';
import { EnterHandler } from './extensions/EnterHandler';

interface WysiwygEditorProps {
  content: string;
  onChange: (content: string) => void;
  isDarkMode: boolean;
}

const WysiwygEditor: React.FC<WysiwygEditorProps> = ({
  content,
  onChange,
  isDarkMode,
}) => {
  const editor = useEditor({
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
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      TextStyle,
      Color,
      EnterHandler,
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto focus:outline-none min-h-96 p-4 ${
          isDarkMode ? 'prose-invert' : ''
        }`,
      },
    },
  });

  const handleFormat = useCallback((format: string, value?: string) => {
    if (!editor) return;

    switch (format) {
      case 'bold':
        editor.chain().focus().toggleBold().run();
        break;
      case 'italic':
        editor.chain().focus().toggleItalic().run();
        break;
      case 'heading':
        const level = parseInt(value || '1') as 1 | 2 | 3;
        editor.chain().focus().toggleHeading({ level }).run();
        break;
      case 'link':
        try {
          const { url, text } = JSON.parse(value || '{}');
          if (url) {
            if (text && text !== url) {
              editor.chain().focus().insertContent(`<a href="${url}">${text}</a>`).run();
            } else {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }
        } catch {
          const url = prompt('Zadejte URL odkazu:');
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }
        break;
      case 'image':
        if (value) {
          editor.chain().focus().setImage({ src: value }).run();
        }
        break;
      case 'unorderedList':
        editor.chain().focus().toggleBulletList().run();
        break;
      case 'orderedList':
        editor.chain().focus().toggleOrderedList().run();
        break;
    }
  }, [editor]);

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-500">Načítám WYSIWYG editor...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <Toolbar 
        onFormat={handleFormat}
        disabled={!editor}
        editor={editor}
        isDarkMode={isDarkMode}
      />
      <div className={`flex-1 border border-gray-200 dark:border-gray-700 rounded-b-lg overflow-y-auto ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'
      }`}>
        <EditorContent 
          editor={editor}
          className="h-full"
        />
      </div>
    </div>
  );
};

export default WysiwygEditor;