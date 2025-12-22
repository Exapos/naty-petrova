'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MediaAsset } from '@/types/editor';
import { useEditorStore } from '@/stores/editorStore';
import {
  XMarkIcon,
  ArrowPathIcon,
  CloudArrowUpIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

interface MediaManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (asset: MediaAsset) => void;
}

export function MediaManager({ isOpen, onClose, onSelect }: MediaManagerProps) {
  const mediaAssets = useEditorStore((state) => state.mediaAssets);
  const loadMediaAssets = useEditorStore((state) => state.loadMediaAssets);
  const [isUploading, setIsUploading] = useState(false);
  const [selected, setSelected] = useState<MediaAsset | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadMediaAssets();
    }
  }, [isOpen, loadMediaAssets]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const data = new FormData();
      data.append('file', file);

      const response = await fetch('/api/admin/media', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();
      if (result.success) {
        loadMediaAssets();
        setSelected(result.asset);
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error('Upload failed', error);
    } finally {
      setIsUploading(false);
    }
  };

  const confirmSelection = () => {
    if (selected) {
      onSelect(selected);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900">Správce médií</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col md:flex-row h-[70vh]">
              <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200 p-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    Nahrát nový soubor
                  </label>
                  <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${isUploading ? 'opacity-60 pointer-events-none' : 'hover:border-blue-400 hover:bg-blue-50'}`}>
                    <CloudArrowUpIcon className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-gray-700">Vybrat z počítače</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                  </label>
                  <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                    <ArrowPathIcon className={`w-4 h-4 ${isUploading ? 'animate-spin' : ''}`} />
                    <span>{isUploading ? 'Nahrávám...' : 'Podporované formáty: JPG, PNG, WEBP'}</span>
                  </div>
                </div>

                <div className="rounded-lg border border-dashed border-gray-300 p-3 text-xs text-gray-500 bg-gray-50">
                  <p className="font-semibold text-gray-700 mb-1">Tipy pro obrázky</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Optimální šířka 1600px pro hero sekce</li>
                    <li>Kompresujte obrázky pro rychlejší načítání</li>
                    <li>Vyplňte ALT text pro přístupnost</li>
                  </ul>
                </div>
              </aside>

              <section className="flex-1 overflow-y-auto p-4">
                {mediaAssets.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500">
                    <p>Žádné soubory zatím nebyly nahrány.</p>
                    <p className="text-sm">Nahráním souboru se zde ihned zobrazí.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {mediaAssets.map((asset) => {
                      const isActive = selected?.id === asset.id;
                      return (
                        <button
                          key={asset.id}
                          className={`relative group rounded-xl border ${isActive ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-blue-300'}`}
                          onClick={() => setSelected(asset)}
                        >
                          <img
                            src={asset.url}
                            alt={asset.alt || asset.filename}
                            className="w-full h-32 object-cover rounded-t-xl"
                          />
                          <div className="p-2 text-left">
                            <p className="text-xs font-medium text-gray-800 truncate">{asset.filename}</p>
                            <p className="text-[10px] text-gray-500">
                              {asset.size ? `${(asset.size / 1024).toFixed(1)} KB` : ''}
                            </p>
                          </div>
                          {isActive && (
                            <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center rounded-xl">
                              <CheckIcon className="w-6 h-6 text-white" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>

            <div className="border-t border-gray-200 p-4 flex items-center justify-between">
              <button
                onClick={loadMediaAssets}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Obnovit seznam
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  Zrušit
                </button>
                <button
                  onClick={confirmSelection}
                  disabled={!selected}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg disabled:opacity-50"
                >
                  Použít soubor
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
