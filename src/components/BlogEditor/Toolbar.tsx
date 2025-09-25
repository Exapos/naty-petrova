'use client';

import React from 'react';
import {
  BoldIcon,
  ItalicIcon,
  LinkIcon,
  PhotoIcon,
  ListBulletIcon,
  NumberedListIcon,
} from '@heroicons/react/24/outline';

interface ToolbarProps {
  onFormat: (format: string, value?: string) => void;
  disabled?: boolean;
  editor?: any;
  isDarkMode?: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({ onFormat, disabled = false, editor, isDarkMode = false }) => {
  const handleImageUpload = () => {
    const url = prompt('Zadejte URL obrázku:');
    if (url) {
      onFormat('image', url);
    }
  };

  const handleLinkInsert = () => {
    const url = prompt('Zadejte URL odkazu:');
    const text = prompt('Zadejte text odkazu:') || url;
    if (url) {
      onFormat('link', JSON.stringify({ url, text }));
    }
  };

  const toolbarButtons = [
    {
      icon: BoldIcon,
      label: 'Tučné',
      action: () => onFormat('bold'),
      shortcut: 'Ctrl+B',
      format: 'bold',
    },
    {
      icon: ItalicIcon,
      label: 'Kurzíva',
      action: () => onFormat('italic'),
      shortcut: 'Ctrl+I',
      format: 'italic',
    },
    {
      type: 'separator' as const,
    },
    {
      label: 'H1',
      action: () => onFormat('heading', '1'),
      className: 'font-bold text-lg',
      format: 'heading',
    },
    {
      label: 'H2',
      action: () => onFormat('heading', '2'),
      className: 'font-bold text-base',
      format: 'heading',
    },
    {
      label: 'H3',
      action: () => onFormat('heading', '3'),
      className: 'font-bold text-sm',
      format: 'heading',
    },
    {
      type: 'separator' as const,
    },
    {
      icon: LinkIcon,
      label: 'Odkaz',
      action: handleLinkInsert,
      shortcut: 'Ctrl+K',
      format: 'link',
    },
    {
      icon: PhotoIcon,
      label: 'Obrázek',
      action: handleImageUpload,
    },
    {
      type: 'separator' as const,
    },
    {
      icon: ListBulletIcon,
      label: 'Seznam s odrážkami',
      action: () => onFormat('unorderedList'),
      format: 'bulletList',
    },
    {
      icon: NumberedListIcon,
      label: 'Číslovaný seznam',
      action: () => onFormat('orderedList'),
      format: 'orderedList',
    },
  ];

  const getButtonActiveState = (format: string) => {
    if (!editor) return false;
    
    switch (format) {
      case 'bold':
        return editor.isActive('bold');
      case 'italic':
        return editor.isActive('italic');
      case 'heading':
        return editor.isActive('heading');
      case 'bulletList':
        return editor.isActive('bulletList');
      case 'orderedList':
        return editor.isActive('orderedList');
      case 'link':
        return editor.isActive('link');
      default:
        return false;
    }
  };

  return (
    <div className={`flex items-center gap-1 p-2 border-b rounded-t-lg ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-gray-50 border-gray-200'
    }`}>
      {toolbarButtons.map((button, index) => {
        if (button.type === 'separator') {
          return (
            <div
              key={index}
              className={`w-px h-6 mx-1 ${
                isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
              }`}
            />
          );
        }

        const Icon = button.icon;
        const isActive = button.format ? getButtonActiveState(button.format) : false;

        return (
          <button
            key={index}
            onClick={button.action}
            disabled={disabled}
            title={`${button.label}${button.shortcut ? ` (${button.shortcut})` : ''}`}
            className={`p-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              isActive
                ? isDarkMode
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-500 text-white'
                : isDarkMode
                ? 'hover:bg-gray-700 text-gray-200'
                : 'hover:bg-gray-200 text-gray-700'
            }`}
          >
            {Icon ? (
              <Icon className="w-4 h-4" />
            ) : (
              <span className={button.className}>{button.label}</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Toolbar;