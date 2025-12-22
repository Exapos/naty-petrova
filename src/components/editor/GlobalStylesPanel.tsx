'use client';

import React, { useState } from 'react';
import { 
  SwatchIcon, 
  DocumentTextIcon, 
  AdjustmentsHorizontalIcon,
  EyeIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';

interface GlobalStyles {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
    mono: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
  };
}

interface GlobalStylesPanelProps {
  onStylesChange?: (styles: GlobalStyles) => void;
}

const defaultStyles: GlobalStyles = {
  colors: {
    primary: '#3b82f6',
    secondary: '#6b7280',
    accent: '#f59e0b',
    background: '#ffffff',
    text: '#1f2937',
  },
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
  },
};

export function GlobalStylesPanel({ onStylesChange }: GlobalStylesPanelProps) {
  const [styles, setStyles] = useState<GlobalStyles>(defaultStyles);
  const [activeTab, setActiveTab] = useState<'colors' | 'fonts' | 'spacing' | 'css'>('colors');

  const updateStyles = (section: keyof GlobalStyles, updates: Partial<GlobalStyles[keyof GlobalStyles]>) => {
    const newStyles = {
      ...styles,
      [section]: {
        ...styles[section],
        ...updates,
      },
    };
    setStyles(newStyles);
    onStylesChange?.(newStyles);
  };

  const tabs = [
    { id: 'colors', name: 'Barvy', icon: SwatchIcon },
    { id: 'fonts', name: 'Písma', icon: DocumentTextIcon },
    { id: 'spacing', name: 'Mezery', icon: AdjustmentsHorizontalIcon },
    { id: 'css', name: 'CSS', icon: CodeBracketIcon },
  ];

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg h-full overflow-y-auto">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-2">
          <EyeIcon className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Globální styly</h3>
        </div>
        <p className="text-sm text-gray-500">
          Nastavte globální styly pro celý editor
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 px-4">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'colors' && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Barvy</h4>
            <div className="space-y-3">
              {Object.entries(styles.colors).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => updateStyles('colors', { [key]: e.target.value })}
                      className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => updateStyles('colors', { [key]: e.target.value })}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={value}
                      onChange={(e) => updateStyles('colors', { [key]: e.target.value })}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="#3b82f6">Modrá</option>
                      <option value="#ef4444">Červená</option>
                      <option value="#10b981">Zelená</option>
                      <option value="#f59e0b">Žlutá</option>
                      <option value="#8b5cf6">Fialová</option>
                      <option value="#6b7280">Šedá</option>
                      <option value="#000000">Černá</option>
                      <option value="#ffffff">Bílá</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'fonts' && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Písma</h4>
            <div className="space-y-3">
              {Object.entries(styles.fonts).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => updateStyles('fonts', { [key]: e.target.value })}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Inter, sans-serif"
                    />
                    <select
                      value={value}
                      onChange={(e) => updateStyles('fonts', { [key]: e.target.value })}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Inter, sans-serif">Inter</option>
                      <option value="Roboto, sans-serif">Roboto</option>
                      <option value="Open Sans, sans-serif">Open Sans</option>
                      <option value="Lato, sans-serif">Lato</option>
                      <option value="Montserrat, sans-serif">Montserrat</option>
                      <option value="Poppins, sans-serif">Poppins</option>
                      <option value="Source Sans Pro, sans-serif">Source Sans Pro</option>
                      <option value="Nunito, sans-serif">Nunito</option>
                      <option value="Playfair Display, serif">Playfair Display</option>
                      <option value="Merriweather, serif">Merriweather</option>
                      <option value="JetBrains Mono, monospace">JetBrains Mono</option>
                      <option value="Fira Code, monospace">Fira Code</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'spacing' && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Mezery</h4>
            <div className="space-y-3">
              {Object.entries(styles.spacing).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {key.toUpperCase()}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => updateStyles('spacing', { [key]: e.target.value })}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="1rem"
                    />
                    <select
                      value={value}
                      onChange={(e) => updateStyles('spacing', { [key]: e.target.value })}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="0">0</option>
                      <option value="0.25rem">0.25rem</option>
                      <option value="0.5rem">0.5rem</option>
                      <option value="0.75rem">0.75rem</option>
                      <option value="1rem">1rem</option>
                      <option value="1.25rem">1.25rem</option>
                      <option value="1.5rem">1.5rem</option>
                      <option value="2rem">2rem</option>
                      <option value="2.5rem">2.5rem</option>
                      <option value="3rem">3rem</option>
                      <option value="4rem">4rem</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <h5 className="text-sm font-medium text-gray-900">Border radius</h5>
              {Object.entries(styles.borderRadius).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {key.toUpperCase()}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => updateStyles('borderRadius', { [key]: e.target.value })}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.5rem"
                    />
                    <select
                      value={value}
                      onChange={(e) => updateStyles('borderRadius', { [key]: e.target.value })}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="0">0</option>
                      <option value="0.125rem">0.125rem</option>
                      <option value="0.25rem">0.25rem</option>
                      <option value="0.375rem">0.375rem</option>
                      <option value="0.5rem">0.5rem</option>
                      <option value="0.75rem">0.75rem</option>
                      <option value="1rem">1rem</option>
                      <option value="1.5rem">1.5rem</option>
                      <option value="2rem">2rem</option>
                      <option value="9999px">Kruh</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'css' && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Vlastní CSS</h4>
            <textarea
              className="w-full h-40 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              placeholder="/* Vlastní CSS styly */&#10;.custom-class {&#10;  color: #333;&#10;  font-size: 16px;&#10;}"
            />
            <p className="text-xs text-gray-500">
              Zadejte vlastní CSS styly, které se aplikují na celý editor
            </p>
          </div>
        )}
      </div>

      {/* Preview */}
      <div className="border-t border-gray-200 p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Náhled</h4>
        <div 
          className="p-4 border border-gray-200 rounded-lg"
          style={{
            backgroundColor: styles.colors.background,
            color: styles.colors.text,
            fontFamily: styles.fonts.body,
          }}
        >
          <h3 
            style={{ 
              fontFamily: styles.fonts.heading,
              color: styles.colors.primary,
              marginBottom: styles.spacing.md,
            }}
          >
            Ukázkový nadpis
          </h3>
          <p style={{ marginBottom: styles.spacing.sm }}>
            Toto je ukázkový text s globálními styly aplikovanými.
          </p>
          <button
            style={{
              backgroundColor: styles.colors.primary,
              color: 'white',
              padding: `${styles.spacing.sm} ${styles.spacing.md}`,
              borderRadius: styles.borderRadius.md,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Ukázkové tlačítko
          </button>
        </div>
      </div>
    </div>
  );
}