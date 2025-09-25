'use client';

import React, { useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Toolbar from './Toolbar';

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96 bg-gray-50 dark:bg-gray-900">
      <div className="text-gray-500">Načítám editor...</div>
    </div>
  ),
});

interface MarkdownEditorProps {
  content: string;
  onChange: (content: string) => void;
  isDarkMode: boolean;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  content,
  onChange,
  isDarkMode,
}) => {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = useCallback((editor: any) => {
    editorRef.current = editor;
  }, []);

  const insertText = useCallback((text: string) => {
    if (!editorRef.current) return;

    const editor = editorRef.current;
    const selection = editor.getSelection();
    const id = { major: 1, minor: 1 };
    const op = {
      identifier: id,
      range: selection,
      text,
      forceMoveMarkers: true,
    };
    editor.executeEdits('my-source', [op]);
    editor.focus();
  }, []);

  const wrapSelectedText = useCallback((before: string, after: string = before) => {
    if (!editorRef.current) return;

    const editor = editorRef.current;
    const selection = editor.getSelection();
    const selectedText = editor.getModel()?.getValueInRange(selection) || '';
    const newText = `${before}${selectedText}${after}`;
    
    const id = { major: 1, minor: 1 };
    const op = {
      identifier: id,
      range: selection,
      text: newText,
      forceMoveMarkers: true,
    };
    editor.executeEdits('my-source', [op]);
    editor.focus();
  }, []);

  const handleFormat = useCallback((format: string, value?: string) => {
    switch (format) {
      case 'bold':
        wrapSelectedText('**');
        break;
      case 'italic':
        wrapSelectedText('*');
        break;
      case 'heading':
        const level = parseInt(value || '1');
        const hashes = '#'.repeat(level);
        insertText(`\n${hashes} `);
        break;
      case 'link':
        try {
          const { url, text } = JSON.parse(value || '{}');
          insertText(`[${text}](${url})`);
        } catch {
          insertText('[text](url)');
        }
        break;
      case 'image':
        insertText(`![alt text](${value})`);
        break;
      case 'unorderedList':
        insertText('\n- ');
        break;
      case 'orderedList':
        insertText('\n1. ');
        break;
    }
  }, [insertText, wrapSelectedText]);

  return (
    <div className="h-full flex flex-col">
      <Toolbar 
        onFormat={handleFormat} 
        isDarkMode={isDarkMode}
      />
      <div className="flex-1">
        <MonacoEditor
          height="100%"
          language="markdown"
          theme={isDarkMode ? 'vs-dark' : 'vs-light'}
          value={content}
          onChange={(value) => onChange(value || '')}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            wordWrap: 'on',
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            fontSize: 14,
            fontFamily: 'Fira Code, Consolas, monospace',
            padding: { top: 16, bottom: 16 },
            bracketPairColorization: { enabled: true },
            folding: true,
            foldingHighlight: true,
            renderLineHighlight: 'line',
            selectOnLineNumbers: true,
            mouseWheelZoom: true,
          }}
        />
      </div>
    </div>
  );
};

export default MarkdownEditor;