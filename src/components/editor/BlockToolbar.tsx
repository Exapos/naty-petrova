'use client';

import React, { useState } from 'react';
import { useEditorStore } from '@/stores/editorStore';
import { MapPicker } from './MapPicker';
import { ReferenceSelector } from './ReferenceSelector';
import { MediaManager } from './MediaManager';
import {
  TrashIcon,
  ArrowPathIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface BlockToolbarProps {
  activeBreakpoint?: 'mobile' | 'tablet' | 'desktop';
}

export function BlockToolbar({ activeBreakpoint = 'desktop' }: BlockToolbarProps) {
  const {
    selectedBlock,
    deleteBlock,
    duplicateBlock,
    isPreviewMode,
    updateBlock,
    getBlockById,
  } = useEditorStore();

  // Keep layout sub-block selection outside of conditional renders to respect Rules of Hooks
  const [layoutSubSelection, setLayoutSubSelection] = useState<Record<string, string>>({});
  const [showReferenceSelector, setShowReferenceSelector] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [showImageLibrary, setShowImageLibrary] = useState(false);

  // Get the selected block data
  const block = selectedBlock ? getBlockById(selectedBlock) : null;

  if (!selectedBlock || isPreviewMode || !block) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-80 bg-white border-l border-gray-200 p-6"
      >
        <div className="text-center text-gray-500">
          <Cog6ToothIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm">Vyberte blok pro úpravu</p>
        </div>
      </motion.div>
    );
  }

  const renderTextControls = () => (
    <div className="space-y-4">
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Velikost písma
          </label>
          <select
            value={block.styles.fontSize || '1rem'}
            onChange={(e) => handleStyleChange('fontSize', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="0.75rem">XS</option>
            <option value="0.875rem">S</option>
            <option value="1rem">M</option>
            <option value="1.125rem">L</option>
            <option value="1.25rem">XL</option>
            <option value="1.5rem">2XL</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Tučnost
          </label>
          <select
            value={block.styles.fontWeight || 'normal'}
            onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="normal">Normální</option>
            <option value="bold">Tučné</option>
            <option value="600">Semi-bold</option>
            <option value="300">Lehké</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Zarovnání
          </label>
          <select
            value={block.styles.textAlign || 'left'}
            onChange={(e) => handleStyleChange('textAlign', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="left">Vlevo</option>
            <option value="center">Na střed</option>
            <option value="right">Vpravo</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Barva textu
            </label>
            <input
              type="color"
              value={block.styles.textColor || '#374151'}
              onChange={(e) => handleStyleChange('textColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Pozadí
            </label>
            <input
              type="color"
              value={block.styles.backgroundColor || '#ffffff'}
              onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderImageControls = () => (
    <>
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            URL obrázku
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={block.content.src || ''}
              onChange={(e) => handleContentChange('src', e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => setShowImageLibrary(true)}
              className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
            >
              Knihovna
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Alt text
          </label>
          <input
            type="text"
            value={block.content.alt || ''}
            onChange={(e) => handleContentChange('alt', e.target.value)}
            placeholder="Alternativní text"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Titulek
          </label>
          <input
            type="text"
            value={block.content.caption || ''}
            onChange={(e) => handleContentChange('caption', e.target.value)}
            placeholder="Titulek pod obrázkem"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Způsob zobrazení
          </label>
          <select
            value={block.styles.objectFit || 'cover'}
            onChange={(e) => handleStyleChange('objectFit', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="cover">Vyplnit</option>
            <option value="contain">Přizpůsobit</option>
            <option value="fill">Roztáhnout</option>
            <option value="none">Originál</option>
            <option value="scale-down">Zmenšit</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Filtr
          </label>
          <select
            value={block.styles.filter || 'none'}
            onChange={(e) => handleStyleChange('filter', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="none">Žádný</option>
            <option value="grayscale(100%)">Černobílý</option>
            <option value="sepia(100%)">Sépie</option>
            <option value="hue-rotate(90deg)">Hue rotace</option>
            <option value="saturate(2)">Sytější</option>
            <option value="contrast(1.5)">Kontrastnější</option>
            <option value="brightness(1.2)">Světlejší</option>
            <option value="blur(2px)">Rozmazaný</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Šířka
            </label>
            <input
              type="text"
              value={block.styles.width || '100%'}
              onChange={(e) => handleStyleChange('width', e.target.value)}
              placeholder="100%, 500px, auto"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Výška
            </label>
            <input
              type="text"
              value={block.styles.height || 'auto'}
              onChange={(e) => handleStyleChange('height', e.target.value)}
              placeholder="auto, 300px"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Otočení
          </label>
          <input
            type="range"
            min="0"
            max="360"
            value={parseInt(String(block.styles.rotate || '0')) || 0}
            onChange={(e) => handleStyleChange('rotate', `${e.target.value}deg`)}
            className="w-full"
          />
          <div className="text-xs text-gray-500 text-center">
            {block.styles.rotate || '0deg'}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Průhlednost
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={block.styles.opacity || 1}
            onChange={(e) => handleStyleChange('opacity', String(parseFloat(e.target.value)))}
            className="w-full"
          />
          <div className="text-xs text-gray-500 text-center">
            {Math.round((parseFloat(String(block.styles.opacity)) || 1) * 100)}%
          </div>
        </div>
      </div>

      <MediaManager
        isOpen={showImageLibrary}
        onClose={() => setShowImageLibrary(false)}
        onSelect={(asset) => {
          handleContentChange('src', asset.url);
          handleContentChange('alt', asset.alt || asset.filename);
          setShowImageLibrary(false);
        }}
      />
    </>
  );

  const renderHeadingControls = () => (
    <div className="space-y-4">
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Úroveň nadpisu
          </label>
          <select
            value={block.content.level || 1}
            onChange={(e) => handleContentChange('level', Number(e.target.value))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={1}>H1 - Velký nadpis</option>
            <option value={2}>H2 - Střední nadpis</option>
            <option value={3}>H3 - Malý nadpis</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Zarovnání
          </label>
          <select
            value={block.styles.textAlign || 'left'}
            onChange={(e) => handleStyleChange('textAlign', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="left">Vlevo</option>
            <option value="center">Na střed</option>
            <option value="right">Vpravo</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Barva textu
          </label>
          <input
            type="color"
            value={getResponsiveStyles(activeBreakpoint).textColor || block.styles.textColor || '#1f2937'}
            onChange={(e) => handleResponsiveStyleChange('textColor', e.target.value)}
            className="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Velikost písma ({activeBreakpoint})
          </label>
          <input
            type="text"
            value={getResponsiveStyles(activeBreakpoint).fontSize || block.styles.fontSize || ''}
            onChange={(e) => handleResponsiveStyleChange('fontSize', e.target.value)}
            placeholder="1rem"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Řádek ({activeBreakpoint})
          </label>
          <input
            type="text"
            value={getResponsiveStyles(activeBreakpoint).lineHeight || block.styles.lineHeight || ''}
            onChange={(e) => handleResponsiveStyleChange('lineHeight', e.target.value)}
            placeholder="1.5"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const renderGalleryControls = () => (
    <div className="space-y-4">
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Počet sloupců
          </label>
          <select
            value={block.content.columns || 3}
            onChange={(e) => handleContentChange('columns', Number(e.target.value))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Mezera (gap)
          </label>
          <input
            type="text"
            value={block.styles.gap || '0.5rem'}
            onChange={(e) => handleStyleChange('gap', e.target.value)}
            placeholder="0.5rem"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-700">Lightbox</span>
          <input
            type="checkbox"
            checked={!!block.content.lightbox}
            onChange={(e) => handleContentChange('lightbox', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        </div>
      </div>
    </div>
  );

  const renderButtonControls = () => (
    <div className="space-y-4">
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Text tlačítka
          </label>
          <input
            type="text"
            value={block.content.text || ''}
            onChange={(e) => handleContentChange('text', e.target.value)}
            placeholder="Např. Kontaktovat"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Odkaz (URL)
          </label>
          <input
            type="text"
            value={block.content.url || ''}
            onChange={(e) => handleContentChange('url', e.target.value)}
            placeholder="/kontakt nebo https://..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Styl
          </label>
          <select
            value={block.content.style || 'primary'}
            onChange={(e) => handleContentChange('style', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
            <option value="ghost">Ghost</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Barva pozadí
            </label>
            <input
              type="color"
              value={block.styles.backgroundColor || '#2563eb'}
              onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Barva textu
            </label>
            <input
              type="color"
              value={block.styles.textColor || '#ffffff'}
            onChange={(e) => handleStyleChange('textColor', e.target.value)}
            className="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
          />
          </div>
        </div>
      </div>
    </div>
  );

  const renderLayoutControls = () => {
    const subBlocks = (block as any).subBlocks || [];
    const selectedSubId = layoutSubSelection[block.id] || subBlocks[0]?.id || '';

    const updateSubBlock = (subId: string, updates: any) => {
      const next = subBlocks.map((sb: any) => sb.id === subId ? { ...sb, ...updates, styles: { ...sb.styles, ...(updates.styles || {}) } } : sb);
      updateBlock(selectedBlock, { subBlocks: next } as any);
    };

    const selectedSub = subBlocks.find((sb: any) => sb.id === selectedSubId) || subBlocks[0];

    return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Typ layoutu
          </label>
          <select
            value={block.layout || 'single'}
              onChange={(e) => {
                const nextLayout = e.target.value as any;
                const subBlocks = (block as any).subBlocks || [];
                let nextSubBlocks = subBlocks;
                const makeText = () => ({ id: `sub-${Date.now()}-t`, type: 'text', content: { text: 'Text' }, styles: { backgroundColor: 'transparent', textColor: '#1f2937', padding: '1rem', margin: '0' } });
                const makeImage = () => ({ id: `sub-${Date.now()}-i`, type: 'image', content: { src: '', alt: '' }, styles: { backgroundColor: 'transparent', textColor: '#1f2937', padding: '1rem', margin: '0' } });

                if (nextLayout === 'single') {
                  // keep as is
                } else if (nextLayout === 'three-column') {
                  if (subBlocks.length < 3) {
                    nextSubBlocks = [...subBlocks];
                    while (nextSubBlocks.length < 3) nextSubBlocks.push(makeText());
                  }
                } else {
                  // two-column variants need >=2 subblocks
                  if (subBlocks.length < 2) {
                    nextSubBlocks = [makeImage(), makeText()];
                  }
                }

                updateBlock(selectedBlock, { layout: nextLayout, subBlocks: nextSubBlocks } as any);
              }}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="single">Jeden sloupec</option>
            <option value="two-column-equal">50/50</option>
            <option value="two-column-left">70/30 (text vlevo)</option>
            <option value="two-column-right">30/70 (obrázek vlevo)</option>
            <option value="three-column">33/33/33</option>
          </select>
        </div>

          {/* Gutter (gap) for multi-column layouts */}
          {((block.layout && block.layout !== 'single') || ['two-column-equal','two-column-left','two-column-right','three-column'].includes(block.layout as any)) && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Mezera mezi sloupci (gap)</label>
              <input
                type="text"
                value={(block.styles as any)?.gap || '1rem'}
                onChange={(e) => handleStyleChange('gap', e.target.value)}
                placeholder="např. 1rem"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {subBlocks.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">Vybrat pod-blok</label>
              <select
                value={selectedSub?.id || ''}
                onChange={(e) => setLayoutSubSelection(prev => ({ ...prev, [block.id]: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {subBlocks.map((sb: any, i: number) => (
                  <option key={sb.id} value={sb.id}>{i + 1}. {sb.type}</option>
                ))}
              </select>

              {selectedSub && selectedSub.type === 'text' && (
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Text</label>
                  <textarea
                    rows={3}
                    value={selectedSub.content?.text || ''}
                    onChange={(e) => updateSubBlock(selectedSub.id, { content: { ...selectedSub.content, text: e.target.value } })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {selectedSub && selectedSub.type === 'image' && (
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">URL obrázku</label>
                  <input
                    type="text"
                    value={selectedSub.content?.src || ''}
                    onChange={(e) => updateSubBlock(selectedSub.id, { content: { ...selectedSub.content, src: e.target.value } })}
                    placeholder="/uploads/... nebo https://"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <label className="block text-xs font-medium text-gray-700 mb-1">Alt</label>
                  <input
                    type="text"
                    value={selectedSub.content?.alt || ''}
                    onChange={(e) => updateSubBlock(selectedSub.id, { content: { ...selectedSub.content, alt: e.target.value } })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Sub-block generic styles */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Pozadí</label>
                  <input
                    type="color"
                    value={selectedSub?.styles?.backgroundColor || '#ffffff'}
                    onChange={(e) => updateSubBlock(selectedSub.id, { styles: { backgroundColor: e.target.value } })}
                    className="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Barva textu</label>
                  <input
                    type="color"
                    value={selectedSub?.styles?.textColor || '#1f2937'}
                    onChange={(e) => updateSubBlock(selectedSub.id, { styles: { textColor: e.target.value } })}
                    className="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
  };

  const renderGenericControls = () => (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2">
        Obecné styly
      </h3>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Barva pozadí
            </label>
            <input
              type="color"
              value={block.styles.backgroundColor || '#ffffff'}
              onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Odsazení
            </label>
            <input
              type="text"
              value={block.styles.padding || '1rem'}
              onChange={(e) => handleStyleChange('padding', e.target.value)}
              placeholder="1rem"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Okraje
          </label>
          <input
            type="text"
            value={block.styles.margin || '0'}
            onChange={(e) => handleStyleChange('margin', e.target.value)}
            placeholder="0.5rem 0"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Animace při načtení
          </label>
          <select
            value={block.styles.animation || 'none'}
            onChange={(e) => handleStyleChange('animation', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="none">Žádná</option>
            <option value="fadeIn">Fade In</option>
            <option value="slideInUp">Slide In Up</option>
            <option value="slideInDown">Slide In Down</option>
            <option value="slideInLeft">Slide In Left</option>
            <option value="slideInRight">Slide In Right</option>
            <option value="zoomIn">Zoom In</option>
            <option value="bounceIn">Bounce In</option>
            <option value="flipInX">Flip In X</option>
            <option value="flipInY">Flip In Y</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Doba animace
          </label>
          <input
            type="text"
            value={block.styles.animationDuration || '0.5s'}
            onChange={(e) => handleStyleChange('animationDuration', e.target.value)}
            placeholder="0.5s"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Zpoždění animace
          </label>
          <input
            type="text"
            value={block.styles.animationDelay || '0s'}
            onChange={(e) => handleStyleChange('animationDelay', e.target.value)}
            placeholder="0s"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Hover efekt
          </label>
          <select
            value={block.styles.hoverEffect || 'none'}
            onChange={(e) => handleStyleChange('hoverEffect', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="none">Žádný</option>
            <option value="scale">Zvětšení</option>
            <option value="lift">Zvednutí</option>
            <option value="glow">Záře</option>
            <option value="shrink">Zmenšení</option>
            <option value="rotate">Rotace</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Display typ
          </label>
          <select
            value={block.styles.display || 'block'}
            onChange={(e) => handleStyleChange('display', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="block">Block</option>
            <option value="flex">Flex</option>
            <option value="grid">Grid</option>
            <option value="inline-block">Inline Block</option>
            <option value="inline-flex">Inline Flex</option>
          </select>
        </div>

        {block.styles.display === 'flex' && (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Flex směr
              </label>
              <select
                value={block.styles.flexDirection || 'row'}
                onChange={(e) => handleStyleChange('flexDirection', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="row">Řádek</option>
                <option value="column">Sloupec</option>
                <option value="row-reverse">Řádek obráceně</option>
                <option value="column-reverse">Sloupec obráceně</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Flex wrap
              </label>
              <select
                value={block.styles.flexWrap || 'nowrap'}
                onChange={(e) => handleStyleChange('flexWrap', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="nowrap">No wrap</option>
                <option value="wrap">Wrap</option>
                <option value="wrap-reverse">Wrap obráceně</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Justify content
              </label>
              <select
                value={block.styles.justifyContent || 'flex-start'}
                onChange={(e) => handleStyleChange('justifyContent', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="flex-start">Start</option>
                <option value="flex-end">End</option>
                <option value="center">Střed</option>
                <option value="space-between">Mezi</option>
                <option value="space-around">Kolem</option>
                <option value="space-evenly">Rovnoměrně</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Align items
              </label>
              <select
                value={block.styles.alignItems || 'stretch'}
                onChange={(e) => handleStyleChange('alignItems', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="stretch">Stretch</option>
                <option value="flex-start">Start</option>
                <option value="flex-end">End</option>
                <option value="center">Střed</option>
                <option value="baseline">Baseline</option>
              </select>
            </div>
          </>
        )}

        {block.styles.display === 'grid' && (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Grid template columns
              </label>
              <input
                type="text"
                value={block.styles.gridTemplateColumns || ''}
                onChange={(e) => handleStyleChange('gridTemplateColumns', e.target.value)}
                placeholder="1fr 1fr 1fr"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Grid template rows
              </label>
              <input
                type="text"
                value={block.styles.gridTemplateRows || ''}
                onChange={(e) => handleStyleChange('gridTemplateRows', e.target.value)}
                placeholder="auto 1fr auto"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Grid gap
              </label>
              <input
                type="text"
                value={block.styles.gap || ''}
                onChange={(e) => handleStyleChange('gap', e.target.value)}
                placeholder="1rem"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );

  const renderTableControls = () => {
    const addRow = () => {
      const newRows = (block.content.rows || 3) + 1;
      handleContentChange('rows', newRows);
    };

    const removeRow = () => {
      const newRows = Math.max(1, (block.content.rows || 3) - 1);
      handleContentChange('rows', newRows);
    };

    const addColumn = () => {
      const newCols = (block.content.cols || 3) + 1;
      handleContentChange('cols', newCols);
    };

    const removeColumn = () => {
      const newCols = Math.max(1, (block.content.cols || 3) - 1);
      handleContentChange('cols', newCols);
    };

    return (
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Řádky
              </label>
              <div className="flex">
                <input
                  type="number"
                  value={block.content.rows || 3}
                  onChange={(e) => handleContentChange('rows', Number(e.target.value))}
                  min="1"
                  max="20"
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={addRow}
                  className="px-2 py-2 text-sm bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
                  title="Přidat řádek"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Sloupce
              </label>
              <div className="flex">
                <input
                  type="number"
                  value={block.content.cols || 3}
                  onChange={(e) => handleContentChange('cols', Number(e.target.value))}
                  min="1"
                  max="10"
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={addColumn}
                  className="px-2 py-2 text-sm bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
                  title="Přidat sloupec"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={removeRow}
              disabled={(block.content.rows || 3) <= 1}
              className="flex-1 px-3 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Odebrat řádek
            </button>
            <button
              onClick={removeColumn}
              disabled={(block.content.cols || 3) <= 1}
              className="flex-1 px-3 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Odebrat sloupec
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Styl tabulky
            </label>
            <select
              value={block.styles.tableStyle || 'default'}
              onChange={(e) => handleStyleChange('tableStyle', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="default">Výchozí</option>
              <option value="striped">Pruhovaná</option>
              <option value="bordered">S rámečky</option>
              <option value="hover">S hover efektem</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Zarovnání obsahu
            </label>
            <select
              value={block.styles.textAlign || 'left'}
              onChange={(e) => handleStyleChange('textAlign', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="left">Vlevo</option>
              <option value="center">Na střed</option>
              <option value="right">Vpravo</option>
            </select>
          </div>
        </div>
      </div>
    );
  };

  const renderVideoControls = () => {
    const validateVideoUrl = (url: string) => {
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)[\w-]+/;
      const vimeoRegex = /^(https?:\/\/)?(www\.)?vimeo\.com\/\d+/;
      const directVideoRegex = /\.(mp4|webm|ogg|mov|avi)$/i;
      
      return youtubeRegex.test(url) || vimeoRegex.test(url) || directVideoRegex.test(url);
    };

    const getVideoEmbedUrl = (url: string) => {
      if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
        const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
      }
      if (url.includes('vimeo.com/')) {
        const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
        return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
      }
      return url;
    };

    const isValidUrl = validateVideoUrl(block.content.src || '');
    const embedUrl = getVideoEmbedUrl(block.content.src || '');

    return (
      <div className="space-y-4">
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              URL videa
            </label>
            <input
              type="url"
              value={block.content.src || ''}
              onChange={(e) => handleContentChange('src', e.target.value)}
              placeholder="https://youtube.com/watch?v=... nebo https://vimeo.com/..."
              className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 ${
                block.content.src && !isValidUrl 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {block.content.src && !isValidUrl && (
              <p className="text-xs text-red-600 mt-1">
                Neplatná URL videa. Podporované: YouTube, Vimeo, MP4, WebM, OGG
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Titulek videa
            </label>
            <input
              type="text"
              value={block.content.title || ''}
              onChange={(e) => handleContentChange('title', e.target.value)}
              placeholder="Název videa"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Popis videa
            </label>
            <textarea
              value={block.content.description || ''}
              onChange={(e) => handleContentChange('description', e.target.value)}
              placeholder="Popis videa"
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Šířka
            </label>
            <input
              type="text"
              value={block.styles.width || '100%'}
              onChange={(e) => handleStyleChange('width', e.target.value)}
              placeholder="100%"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Výška
            </label>
            <input
              type="text"
              value={block.styles.height || '315px'}
              onChange={(e) => handleStyleChange('height', e.target.value)}
              placeholder="315px"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Autoplay
            </label>
            <select
              value={block.content.autoplay ? 'true' : 'false'}
              onChange={(e) => handleContentChange('autoplay', e.target.value === 'true')}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="false">Vypnuto</option>
              <option value="true">Zapnuto</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Smyčka
            </label>
            <select
              value={block.content.loop ? 'true' : 'false'}
              onChange={(e) => handleContentChange('loop', e.target.value === 'true')}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="false">Vypnuto</option>
              <option value="true">Zapnuto</option>
            </select>
          </div>

          {/* Video Preview */}
          {isValidUrl && embedUrl && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Náhled
              </label>
              <div className="border border-gray-300 rounded-md overflow-hidden">
                <iframe
                  src={embedUrl}
                  width="100%"
                  height="200"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderMapControls = () => {
    const validateMapUrl = (url: string) => {
      const googleMapsRegex = /^https:\/\/www\.google\.com\/maps\/embed\?pb=/;
      const googleMapsPlaceRegex = /^https:\/\/www\.google\.com\/maps\/place\//;
      const openStreetMapRegex = /^https:\/\/www\.openstreetmap\.org\//;
      
      return googleMapsRegex.test(url) || googleMapsPlaceRegex.test(url) || openStreetMapRegex.test(url);
    };

    const isValidUrl = validateMapUrl(block.content.src || '');

    const handleLocationSelect = (location: { address: string; lat: number; lng: number; embedUrl: string }) => {
      handleContentChange('address', location.address);
      handleContentChange('src', location.embedUrl);
      setShowMapPicker(false);
    };

    return (
      <div className="space-y-4">
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Vybrat lokaci
            </label>
            <button
              onClick={() => setShowMapPicker(true)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left"
            >
              {block.content.address || 'Klikněte pro výběr lokace na mapě'}
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Adresa nebo souřadnice
            </label>
            <input
              type="text"
              value={block.content.address || ''}
              onChange={(e) => handleContentChange('address', e.target.value)}
              placeholder="Václavské náměstí 1, Praha 1"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              URL mapy
            </label>
            <input
              type="url"
              value={block.content.src || ''}
              onChange={(e) => handleContentChange('src', e.target.value)}
              placeholder="https://www.google.com/maps/embed?pb=..."
              className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 ${
                block.content.src && !isValidUrl 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {block.content.src && !isValidUrl && (
              <p className="text-xs text-red-600 mt-1">
                Neplatná URL mapy. Podporované: Google Maps, OpenStreetMap
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Šířka
            </label>
            <input
              type="text"
              value={block.styles.width || '100%'}
              onChange={(e) => handleStyleChange('width', e.target.value)}
              placeholder="100%"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Výška
            </label>
            <input
              type="text"
              value={block.styles.height || '400px'}
              onChange={(e) => handleStyleChange('height', e.target.value)}
              placeholder="400px"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Zoom úroveň
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={block.content.zoom || 15}
              onChange={(e) => handleContentChange('zoom', Number(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-gray-500 text-center">
              {block.content.zoom || 15}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Typ mapy
            </label>
            <select
              value={block.content.mapType || 'roadmap'}
              onChange={(e) => handleContentChange('mapType', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="roadmap">Silniční mapa</option>
              <option value="satellite">Satelitní</option>
              <option value="hybrid">Hybridní</option>
              <option value="terrain">Terénní</option>
            </select>
          </div>

          {/* Map Preview */}
          {isValidUrl && block.content.src && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Náhled mapy
              </label>
              <div className="border border-gray-300 rounded-md overflow-hidden">
                <iframe
                  src={block.content.src}
                  width="100%"
                  height="200"
                  frameBorder="0"
                  style={{ border: 0 }}
                  allowFullScreen
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* Map Picker Modal */}
        <MapPicker
          isOpen={showMapPicker}
          onClose={() => setShowMapPicker(false)}
          onLocationSelect={handleLocationSelect}
        />
      </div>
    );
  };

  const renderContactControls = () => (
    <div className="space-y-4">
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Název formuláře
          </label>
          <input
            type="text"
            value={block.content.title || ''}
            onChange={(e) => handleContentChange('title', e.target.value)}
            placeholder="Kontaktujte nás"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Popis
          </label>
          <textarea
            value={block.content.description || ''}
            onChange={(e) => handleContentChange('description', e.target.value)}
            placeholder="Popis formuláře"
            rows={3}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Email pro příjem zpráv
          </label>
          <input
            type="email"
            value={block.content.email || ''}
            onChange={(e) => handleContentChange('email', e.target.value)}
            placeholder="info@example.com"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Pole formuláře
          </label>
          <div className="space-y-2">
            {['Jméno', 'Email', 'Telefon', 'Zpráva'].map((field) => (
              <div key={field} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={block.content.fields?.includes(field) || false}
                  onChange={(e) => {
                    const fields = block.content.fields || [];
                    if (e.target.checked) {
                      handleContentChange('fields', [...fields, field]);
                    } else {
                      handleContentChange('fields', fields.filter(f => f !== field));
                    }
                  }}
                  className="rounded border-gray-300"
                />
                <label className="text-sm text-gray-700">{field}</label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Text tlačítka
          </label>
          <input
            type="text"
            value={block.content.buttonText || 'Odeslat'}
            onChange={(e) => handleContentChange('buttonText', e.target.value)}
            placeholder="Odeslat"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const renderReferenceControls = () => {
    const handleReferenceSelect = (reference: any) => {
      handleContentChange('title', reference.title);
      handleContentChange('description', reference.description);
      handleContentChange('imageUrl', reference.image);
      handleContentChange('projectUrl', `/reference/${reference.slug}`);
      handleContentChange('category', reference.category);
      setShowReferenceSelector(false);
    };

    return (
      <div className="space-y-4">
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Vybrat existující referenci
            </label>
            <button
              onClick={() => setShowReferenceSelector(true)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left"
            >
              {block.content.title || 'Klikněte pro výběr reference'}
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Název reference
            </label>
            <input
              type="text"
              value={block.content.title || ''}
              onChange={(e) => handleContentChange('title', e.target.value)}
              placeholder="Název projektu"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Popis
            </label>
            <textarea
              value={block.content.description || ''}
              onChange={(e) => handleContentChange('description', e.target.value)}
              placeholder="Popis reference"
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              URL obrázku
            </label>
            <input
              type="url"
              value={block.content.imageUrl || ''}
              onChange={(e) => handleContentChange('imageUrl', e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Odkaz na projekt
            </label>
            <input
              type="url"
              value={block.content.projectUrl || ''}
              onChange={(e) => handleContentChange('projectUrl', e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Kategorie
            </label>
            <input
              type="text"
              value={block.content.category || ''}
              onChange={(e) => handleContentChange('category', e.target.value)}
              placeholder="Web design, Branding, atd."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Reference Selector Modal */}
        <ReferenceSelector
          isOpen={showReferenceSelector}
          onClose={() => setShowReferenceSelector(false)}
          onReferenceSelect={handleReferenceSelect}
        />
      </div>
    );
  };

  const renderIconControls = () => (
    <div className="space-y-4">
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Název ikony
          </label>
          <input
            type="text"
            value={block.content.iconName || ''}
            onChange={(e) => handleContentChange('iconName', e.target.value)}
            placeholder="home, user, star, atd."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Velikost ikony
          </label>
          <input
            type="text"
            value={block.styles.fontSize || '24px'}
            onChange={(e) => handleStyleChange('fontSize', e.target.value)}
            placeholder="24px"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Barva ikony
          </label>
          <input
            type="color"
            value={block.styles.color || '#000000'}
            onChange={(e) => handleStyleChange('color', e.target.value)}
            className="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Zarovnání
          </label>
          <select
            value={block.styles.textAlign || 'left'}
            onChange={(e) => handleStyleChange('textAlign', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="left">Vlevo</option>
            <option value="center">Na střed</option>
            <option value="right">Vpravo</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Animace
          </label>
          <select
            value={block.styles.animation || 'none'}
            onChange={(e) => handleStyleChange('animation', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="none">Žádná</option>
            <option value="spin">Rotace</option>
            <option value="pulse">Pulzování</option>
            <option value="bounce">Odraz</option>
          </select>
        </div>
      </div>
    </div>
  );

  // All functions that use 'block' must be defined here, after 'block' is available
  const handleStyleChange = (key: string, value: string) => {
    updateBlock(selectedBlock, {
      styles: { ...block.styles, [key]: value },
    });
  };

  const handleContentChange = (key: string, value: any) => {
    updateBlock(selectedBlock, {
      content: { ...block.content, [key]: value },
    });
  };

  const getResponsiveStyles = (breakpoint: string) => {
    const responsiveStyles = block.styles?.responsive || {};
    return responsiveStyles[breakpoint] || {};
  };

  const handleResponsiveStyleChange = (property: string, value: string) => {
    const responsiveStyles = block.styles?.responsive || {};
    const newResponsiveStyles = {
      ...responsiveStyles,
      [activeBreakpoint]: {
        ...responsiveStyles[activeBreakpoint],
        [property]: value,
      },
    };
    
    updateBlock(selectedBlock, {
      styles: {
        ...block.styles,
        responsive: newResponsiveStyles,
      },
    });
  };

  const getBlockTypeDisplayName = (type: string) => {
    const names: Record<string, string> = {
      text: 'Text',
      heading: 'Nadpis',
      image: 'Obrázek',
      layout: 'Layout',
      button: 'Tlačítko',
      video: 'Video',
      gallery: 'Galerie',
      contact: 'Kontakt',
      reference: 'Reference',
      map: 'Mapa',
      divider: 'Oddělovač',
      icon: 'Ikona',
      table: 'Tabulka',
    };
    return names[type] || type;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto"
    >
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          {getBlockTypeDisplayName(block.type)}
        </h2>
        <p className="text-sm text-gray-500">
          Upravte vlastnosti vybraného bloku
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex space-x-2 mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => duplicateBlock(selectedBlock)}
          className="flex items-center space-x-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors shadow-sm"
          title="Duplikovat blok"
        >
          <ArrowPathIcon className="w-4 h-4" />
          <span>Duplikovat</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => deleteBlock(selectedBlock)}
          className="flex items-center space-x-1 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm transition-colors shadow-sm"
          title="Smazat blok"
        >
          <TrashIcon className="w-4 h-4" />
          <span>Smazat</span>
        </motion.button>
      </div>

      {/* Block-specific controls */}
      <div className="space-y-6">
        {block.type === 'text' && renderTextControls()}
        {block.type === 'heading' && renderHeadingControls()}
        {block.type === 'image' && renderImageControls()}
        {block.type === 'layout' && renderLayoutControls()}
        {block.type === 'gallery' && renderGalleryControls()}
        {block.type === 'button' && renderButtonControls()}
        {block.type === 'table' && renderTableControls()}
        {block.type === 'video' && renderVideoControls()}
        {block.type === 'map' && renderMapControls()}
        {block.type === 'contact' && renderContactControls()}
        {block.type === 'reference' && renderReferenceControls()}
        {block.type === 'icon' && renderIconControls()}

        {/* Generic controls for all block types */}
        {renderGenericControls()}
      </div>
    </motion.div>
  );
}