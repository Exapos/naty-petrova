import { useEditor as useTipTapEditor } from '@tiptap/react';
import { useCallback, useEffect, useState } from 'react';
import StarterKit from '@tiptap/starter-kit';
import BubbleMenu from '@tiptap/extension-bubble-menu';
import FloatingMenu from '@tiptap/extension-floating-menu';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import Typography from '@tiptap/extension-typography';
import Placeholder from '@tiptap/extension-placeholder';
import Focus from '@tiptap/extension-focus';
import FontFamily from '@tiptap/extension-font-family';
import DragHandleReact from '@tiptap/extension-drag-handle-react';
import Dropcursor from '@tiptap/extension-dropcursor';
import FileHandler from '@tiptap/extension-file-handler';
import FontSize from '@tiptap/extension-font-size';
import Gapcursor from '@tiptap/extension-gapcursor';
import InvisibleCharacters from '@tiptap/extension-invisible-characters';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import TableOfContents from '@tiptap/extension-table-of-contents';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import CharacterCount from '@tiptap/extension-character-count';
import Highlight from '@tiptap/extension-highlight';
import { Extension } from '@tiptap/core';

// Copy Markdown extension
const CopyMarkdown = Extension.create({
  name: 'copyMarkdown',
  addKeyboardShortcuts() {
    return {
      'Mod-Shift-c': ({ editor }) => {
        const markdown = editor.getJSON();
        navigator.clipboard.writeText(JSON.stringify(markdown, null, 2));
        return true;
      },
    };
  },
});

// Line Height extension
const LineHeight = Extension.create({
  name: 'lineHeight',
  addOptions() {
    return {
      types: ['paragraph', 'heading'],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: (element) => element.style.lineHeight || null,
            renderHTML: (attributes) => {
              if (!attributes.lineHeight) {
                return {};
              }
              return {
                style: `line-height: ${attributes.lineHeight}`,
              };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setLineHeight:
        (lineHeight: string) =>
        ({ commands }) => {
          return commands.setMark('lineHeight', { lineHeight });
        },
    };
  },
});

interface UseBlogEditorOptions {
  initialContent?: string;
  onUpdate?: (html: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

/**
 * Hook pro práci s Blog Editor V2
 * Vrací nakonfigurovaný TipTap editor s všemi extensions
 */
export function useBlogEditor({
  initialContent = '',
  onUpdate,
  onBlur,
  onFocus,
}: UseBlogEditorOptions = {}) {
  const [isMounted, setIsMounted] = useState(false);

  const editor = useTipTapEditor({
    extensions: [
      StarterKit.configure({
        history: {
          depth: 100,
        },
      }),
      BubbleMenu,
      FloatingMenu.configure({
        shouldShow: ({ state }) => {
          const { $from } = state.selection;
          const isEmptyTextBlock =
            $from.parent.isBlock &&
            $from.parent.childCount === 0;
          return isEmptyTextBlock;
        },
      }),
      Color.configure({
        types: ['textStyle'],
      }),
      TextStyle,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Typography,
      Placeholder.configure({
        placeholder: 'Začněte psát...',
      }),
      Focus.configure({
        className: 'has-focus',
        mode: 'all',
      }),
      FontFamily.configure({
        types: ['textStyle'],
      }),
      DragHandleReact,
      Dropcursor.configure({
        width: 2,
        class: 'ProseMirror-dropcursor',
      }),
      FileHandler.configure({
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
        onDrop: (currentEditor, files, pos) => {
          files.forEach((file) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
              currentEditor
                .chain()
                .insertContentAt(pos, {
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
      FontSize.configure({
        types: ['textStyle'],
      }),
      Gapcursor,
      InvisibleCharacters.configure({
        showSpaces: false,
        showTabs: false,
        showLinebreaks: false,
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
      Link.configure({
        openOnClick: true,
        autolink: true,
        protocols: ['http', 'https'],
      }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto',
        },
      }),
      Underline,
      Superscript,
      Subscript,
      CharacterCount.configure({
        limit: undefined,
      }),
      Highlight.configure({
        multicolor: true,
      }),
      CopyMarkdown,
      LineHeight,
    ],
    content: initialContent,
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      if (onUpdate) {
        onUpdate(editor.getHTML());
      }
    };

    const handleBlur = () => {
      if (onBlur) {
        onBlur();
      }
    };

    const handleFocus = () => {
      if (onFocus) {
        onFocus();
      }
    };

    editor.on('update', handleUpdate);
    editor.on('blur', handleBlur);
    editor.on('focus', handleFocus);

    return () => {
      editor.off('update', handleUpdate);
      editor.off('blur', handleBlur);
      editor.off('focus', handleFocus);
    };
  }, [editor, onUpdate, onBlur, onFocus]);

  const getWordCount = useCallback(() => {
    return editor?.storage.characterCount?.words() || 0;
  }, [editor]);

  const getCharCount = useCallback(() => {
    return editor?.storage.characterCount?.characters() || 0;
  }, [editor]);

  const getHtml = useCallback(() => {
    return editor?.getHTML() || '';
  }, [editor]);

  const getJson = useCallback(() => {
    return editor?.getJSON() || null;
  }, [editor]);

  const setContent = useCallback((content: string) => {
    editor?.commands.setContent(content);
  }, [editor]);

  const clearContent = useCallback(() => {
    editor?.commands.clearContent();
  }, [editor]);

  return {
    editor,
    isMounted,
    getWordCount,
    getCharCount,
    getHtml,
    getJson,
    setContent,
    clearContent,
  };
}
