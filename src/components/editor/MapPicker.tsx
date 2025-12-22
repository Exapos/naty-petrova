'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPinIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface MapPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: { address: string; lat: number; lng: number; embedUrl: string }) => void;
}

export function MapPicker({ isOpen, onClose, onLocationSelect }: MapPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<{ address: string; lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      // Simulace geocoding API (v reálné aplikaci byste použili Google Maps API nebo podobnou službu)
      const mockLocation = {
        address: searchQuery,
        lat: 50.0755 + (Math.random() - 0.5) * 0.1,
        lng: 14.4378 + (Math.random() - 0.5) * 0.1,
      };
      
      setSelectedLocation(mockLocation);
    } catch (error) {
      console.error('Geocoding error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      const embedUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(selectedLocation.address)}`;
      onLocationSelect({
        ...selectedLocation,
        embedUrl,
      });
      onClose();
    }
  };

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Simulace kliknutí na mapu
    const lat = 50.0755 + (y / rect.height - 0.5) * 0.1;
    const lng = 14.4378 + (x / rect.width - 0.5) * 0.1;
    
    setSelectedLocation({
      address: `Kliknutá lokace (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
      lat,
      lng,
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-96 m-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Vyberte lokaci na mapě</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Zadejte adresu nebo název místa..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {isLoading ? 'Hledám...' : 'Hledat'}
              </button>
            </div>
          </div>

          {/* Map Area */}
          <div className="flex-1 relative">
            <div
              className="w-full h-64 bg-gray-100 relative cursor-crosshair"
              onClick={handleMapClick}
            >
              {/* Mock map background */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-200 to-blue-200 flex items-center justify-center">
                <div className="text-center text-gray-600">
                  <MapPinIcon className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">Klikněte na mapu pro výběr lokace</p>
                  <p className="text-xs text-gray-500 mt-1">nebo použijte vyhledávání výše</p>
                </div>
              </div>

              {/* Selected location marker */}
              {selectedLocation && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                />
              )}
            </div>

            {/* Selected location info */}
            {selectedLocation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-3"
              >
                <div className="flex items-center gap-2 mb-2">
                  <MapPinIcon className="w-4 h-4 text-red-500" />
                  <span className="font-medium text-gray-900">Vybraná lokace:</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{selectedLocation.address}</p>
                <p className="text-xs text-gray-500">
                  Souřadnice: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                </p>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              Zrušit
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedLocation}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Potvrdit výběr
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

