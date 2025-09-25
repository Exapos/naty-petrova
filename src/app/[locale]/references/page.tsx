'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { SafeText, SafeDescription } from '@/components/SafeText/SafeText';
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';

interface Reference {
  id: string;
  title: string;
  slug: string;
  location: string;
  description: string;
  category: string;
  image: string | null;
  createdAt: string;
}

interface Stats {
  total: number;
  bytove_domy: number;
  rodinne_domy: number;
  komercni_objekty: number;
  prumyslove_objekty: number;
  rekonstrukce: number;
  interiery: number;
  infrastruktura: number;
  ostatni: number;
}

const categoryLabels: Record<string, string> = {
  'Bytové domy': 'Bytové domy',
  'Rodinné domy': 'Rodinné domy',
  'Komerční objekty': 'Komerční objekty',
  'Průmyslové objekty': 'Průmyslové objekty',
  'Rekonstrukce': 'Rekonstrukce',
  'Interiéry': 'Interiéry',
  'Infrastruktura': 'Infrastruktura',
  'Ostatní': 'Ostatní',
};

export default function ReferencesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('ReferencesPage');
  
  const [references, setReferences] = useState<Reference[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'all');
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('search') || '');
  const [inputValue, setInputValue] = useState<string>(searchParams.get('search') || '');
  const [showFilters, setShowFilters] = useState(false);

  const fetchReferences = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }

      const response = await fetch(`/api/references/public?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(t('loading'));
      }

      const data = await response.json();
      setReferences(data.references);
      setCategories(data.categories);
      setStats(data.stats);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery, t]);

  // Debouncing pro vyhledávání
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchQuery(inputValue);
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [inputValue]);

  const updateURL = useCallback((category: string, search: string) => {
    const params = new URLSearchParams();
    if (category !== 'all') {
      params.append('category', category);
    }
    if (search.trim()) {
      params.append('search', search.trim());
    }
    
    const url = params.toString() ? `?${params.toString()}` : '';
    router.push(`/references${url}`, { scroll: false });
  }, [router]);

  useEffect(() => {
    fetchReferences();
  }, [fetchReferences]);

  // Aktualizace URL po změně searchQuery nebo selectedCategory
  useEffect(() => {
    updateURL(selectedCategory, searchQuery);
  }, [selectedCategory, searchQuery, updateURL]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (search: string) => {
    setInputValue(search);
    // URL se aktualizuje pouze když se provede skutečné vyhledávání (po debounce)
  };

  const handleReferenceClick = (slug: string) => {
    router.push(`/references/${slug}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 flex items-center justify-center pt-20 transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-800 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
              {t('title')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors duration-300">
              {t('subtitle')}
            </p>
            {stats && (
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 text-center transition-colors duration-300">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{t('totalProjects')}</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4 text-center transition-colors duration-300">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.bytove_domy + stats.rodinne_domy}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{t('residentialProjects')}</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4 text-center transition-colors duration-300">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.komercni_objekty + stats.prumyslove_objekty}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{t('commercialProjects')}</div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/30 rounded-lg p-4 text-center transition-colors duration-300">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.rekonstrukce + stats.interiery}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{t('reconstructionProjects')}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md leading-5 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
                  placeholder={t('searchPlaceholder')}
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden inline-flex items-center px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-600 transition-colors duration-300"
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              {t('filters')}
            </button>

            {/* Categories - Desktop */}
            <div className="hidden lg:flex items-center space-x-2">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                  selectedCategory === 'all' 
                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200' 
                    : 'bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-600'
                }`}
              >
                {t('allCategories')} ({stats?.total || 0})
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                    selectedCategory === category 
                      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200' 
                      : 'bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-600'
                  }`}
                >
                  {categoryLabels[category] || category}
                </button>
              ))}
            </div>
          </div>

          {/* Categories - Mobile */}
          {showFilters && (
            <div className="lg:hidden mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                  selectedCategory === 'all' 
                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200' 
                    : 'bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-600'
                }`}
              >
                {t('allCategories')} ({stats?.total || 0})
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                    selectedCategory === category 
                      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200' 
                      : 'bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-600'
                  }`}
                >
                  {categoryLabels[category] || category}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-8 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded transition-colors duration-300">
            {error}
          </div>
        )}

        {references.length === 0 && !loading && (
          <div className="text-center py-12">
            <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">{t('noResults')}</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchQuery || selectedCategory !== 'all' 
                ? t('tryDifferentSearch')
                : t('noResults')
              }
            </p>
          </div>
        )}

        {/* References Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {references.map((reference) => (
            <div
              key={reference.id}
              onClick={() => handleReferenceClick(reference.slug)}
              className="bg-white dark:bg-zinc-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border border-transparent dark:border-zinc-700"
            >
              {/* Image */}
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                {reference.image ? (
                  <Image
                    src={reference.image}
                    alt={reference.title}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover"
                    unoptimized={reference.image.startsWith('http')}
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 dark:bg-zinc-700 flex items-center justify-center transition-colors duration-300">
                    <BuildingOfficeIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 transition-colors duration-300">
                    {reference.category}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center transition-colors duration-300">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    {new Date(reference.createdAt).getFullYear()}
                  </span>
                </div>

                <SafeText 
                  as="h3"
                  className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 transition-colors duration-300"
                >
                  {reference.title}
                </SafeText>

                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3 transition-colors duration-300">
                  <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                  <SafeText className="truncate">{reference.location}</SafeText>
                </div>

                <SafeDescription 
                  description={reference.description}
                  className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 transition-colors duration-300"
                />

                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-700 transition-colors duration-300">
                  <span className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-300">
                    {t('viewDetail')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}