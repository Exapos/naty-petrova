'use client';

import React, { useState } from 'react';
import { BlockToolbar } from './BlockToolbar';
import { GlobalStylesPanel } from './GlobalStylesPanel';
import { DevicePhoneMobileIcon, DeviceTabletIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { useEditorStore } from '@/stores/editorStore';

// Thin wrapper to allow future extensions (e.g., tabs for responsive styles)
export function InspectorPanel() {
  const { responsiveMode, setResponsiveMode } = useEditorStore();
  const [activeTab, setActiveTab] = useState<'blocks' | 'styles'>('blocks');

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg h-full flex flex-col overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 p-3">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('blocks')}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'blocks'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span>Bloky</span>
          </button>
          <button
            onClick={() => setActiveTab('styles')}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'styles'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span>Styly</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'blocks' && (
        <>
          {/* Responsive Breakpoint Selector */}
          <div className="border-b border-gray-200 p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-700">Responsivní náhled</h3>
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => setResponsiveMode('mobile')}
                className={`flex items-center gap-1 px-2 py-1 text-xs rounded ${
                  responsiveMode === 'mobile'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Mobil (320px)"
              >
                <DevicePhoneMobileIcon className="w-4 h-4" />
                <span>Mobil</span>
              </button>
              <button
                onClick={() => setResponsiveMode('tablet')}
                className={`flex items-center gap-1 px-2 py-1 text-xs rounded ${
                  responsiveMode === 'tablet'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Tablet (768px)"
              >
                <DeviceTabletIcon className="w-4 h-4" />
                <span>Tablet</span>
              </button>
              <button
                onClick={() => setResponsiveMode('desktop')}
                className={`flex items-center gap-1 px-2 py-1 text-xs rounded ${
                  responsiveMode === 'desktop'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Desktop (1024px+)"
              >
                <ComputerDesktopIcon className="w-4 h-4" />
                <span>Desktop</span>
              </button>
            </div>
          </div>

          {/* Block Controls */}
          <div className="flex-1 overflow-y-auto p-3">
            <BlockToolbar activeBreakpoint={responsiveMode} />
          </div>
        </>
      )}

      {activeTab === 'styles' && (
        <div className="flex-1 overflow-y-auto">
          <GlobalStylesPanel />
        </div>
      )}
    </div>
  );
}


