'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StarIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface Reference {
  id: string;
  title: string;
  slug: string;
  location: string;
  description: string;
  category: string;
  image: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ReferenceSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onReferenceSelect: (reference: Reference) => void;
  selectedReferenceId?: string;
}

export function ReferenceSelector({ isOpen, onClose, onReferenceSelect, selectedReferenceId }: ReferenceSelectorProps) {
  const [references, setReferences] = useState<Reference[]>([]);
  const [filteredReferences, setFilteredReferences] = useState<Reference[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchReferences();
    }
  }, [isOpen]);

  useEffect(() => {
    filterReferences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [references, searchQuery, selectedCategory]);

  const fetchReferences = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/references');
      if (response.ok) {
        const data = await response.json();
        setReferences(data);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(data.map((ref: Reference) => ref.category).filter(Boolean))] as string[];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('Error fetching references:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterReferences = () => {
    let filtered = references;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(ref => 
        ref.title.toLowerCase().includes(query) ||
        ref.description.toLowerCase().includes(query) ||
        ref.location.toLowerCase().includes(query) ||
        ref.category.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(ref => ref.category === selectedCategory);
    }

    setFilteredReferences(filtered);
  };

  const handleReferenceSelect = (reference: Reference) => {
    onReferenceSelect(reference);
    onClose();
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
          className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-96 m-4 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Vyberte referenci</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Search and Filter */}
          <div className="p-4 border-b border-gray-200 space-y-3">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Hledat podle názvu, popisu, lokace..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Všechny kategorie</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* References List */}
          <div className="flex-1 overflow-y-auto p-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredReferences.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <StarIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Žádné reference nenalezeny</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredReferences.map((reference) => (
                  <motion.button
                    key={reference.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleReferenceSelect(reference)}
                    className={`p-3 border rounded-lg text-left transition-all ${
                      selectedReferenceId === reference.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                        {reference.image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={reference.image}
                            alt={reference.title}
                            className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                          />
                        )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {reference.title}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {reference.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">
                            {reference.location}
                          </span>
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                            {reference.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
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
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

