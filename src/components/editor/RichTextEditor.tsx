'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  ListBulletIcon,
  LinkIcon,
  CodeBracketIcon,
} from '@heroicons/react/24/outline';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ value, onChange, placeholder, className = '' }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const isTypingRef = useRef(false);

  // Pouze nastavit HTML při prvním renderu, ne při každé změně
  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML && value) {
      editorRef.current.innerHTML = value;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInput = () => {
    if (editorRef.current) {
      isTypingRef.current = true;
      onChange(editorRef.current.innerHTML);
      // Reset flag po krátké době
      setTimeout(() => {
        isTypingRef.current = false;
      }, 100);
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const insertLink = () => {
    const url = prompt('Zadejte URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const formatButtons = [
    { command: 'bold', icon: BoldIcon, label: 'Tučné' },
    { command: 'italic', icon: ItalicIcon, label: 'Kurzíva' },
    { command: 'underline', icon: UnderlineIcon, label: 'Podtržené' },
    { command: 'insertUnorderedList', icon: ListBulletIcon, label: 'Seznam' },
    { command: 'insertOrderedList', icon: ListBulletIcon, label: 'Číslovaný seznam' },
    { command: 'insertCode', icon: CodeBracketIcon, label: 'Kód' },
  ];

  return (
    <div className={`relative ${className}`}>
      {/* Toolbar */}
      {isFocused && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute -top-12 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex space-x-1 z-10"
        >
          {formatButtons.map(({ command, icon: Icon, label }) => (
            <button
              key={command}
              onClick={() => execCommand(command)}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title={label}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
          <div className="w-px bg-gray-200 mx-1" />
          <button
            onClick={insertLink}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Vložit odkaz"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`min-h-[100px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          !value ? 'text-gray-400' : ''
        }`}
        style={{ minHeight: '100px' }}
      >
        {!editorRef.current?.innerHTML && (value || `<p>${placeholder || 'Začněte psát...'}</p>`)}
      </div>
    </div>
  );
}
