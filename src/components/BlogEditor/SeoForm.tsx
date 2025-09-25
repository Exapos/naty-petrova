'use client';

import React from 'react';
import { BlogPostFormData } from '@/types/blog';

interface SeoFormProps {
  formData: BlogPostFormData;
  onChange: (updates: Partial<BlogPostFormData>) => void;
  isDarkMode: boolean;
}

const SeoForm: React.FC<SeoFormProps> = ({ formData, onChange, isDarkMode }) => {
  const handleChange = (field: keyof BlogPostFormData, value: string) => {
    onChange({ [field]: value });
  };

  const inputClass = `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
    isDarkMode 
      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
  }`;

  const labelClass = `block text-sm font-medium mb-1 ${
    isDarkMode ? 'text-gray-200' : 'text-gray-700'
  }`;

  return (
    <div className={`p-6 border-t ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
      <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        SEO Nastavení
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="slug" className={labelClass}>
            URL Slug
          </label>
          <input
            id="slug"
            type="text"
            value={formData.slug}
            onChange={(e) => handleChange('slug', e.target.value)}
            placeholder="url-slug-clanku"
            className={inputClass}
          />
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            URL adresa článku (automaticky generovaná z názvu)
          </p>
        </div>

        <div>
          <label htmlFor="excerpt" className={labelClass}>
            Úryvek
          </label>
          <input
            id="excerpt"
            type="text"
            value={formData.excerpt}
            onChange={(e) => handleChange('excerpt', e.target.value)}
            placeholder="Krátký popis článku..."
            className={inputClass}
          />
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Krátký popis pro přehledy článků
          </p>
        </div>

        <div>
          <label htmlFor="metaTitle" className={labelClass}>
            Meta Titulek
          </label>
          <input
            id="metaTitle"
            type="text"
            value={formData.metaTitle}
            onChange={(e) => handleChange('metaTitle', e.target.value)}
            placeholder="SEO optimalizovaný titulek"
            className={inputClass}
            maxLength={60}
          />
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {formData.metaTitle.length}/60 znaků - zobrazí se ve vyhledávačích
          </p>
        </div>

        <div>
          <label htmlFor="keywords" className={labelClass}>
            Klíčová slova
          </label>
          <input
            id="keywords"
            type="text"
            value={formData.keywords}
            onChange={(e) => handleChange('keywords', e.target.value)}
            placeholder="klíčové, slovo, seo, blog"
            className={inputClass}
          />
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Oddělte čárkami
          </p>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="metaDescription" className={labelClass}>
            Meta Popis
          </label>
          <textarea
            id="metaDescription"
            value={formData.metaDescription}
            onChange={(e) => handleChange('metaDescription', e.target.value)}
            placeholder="Popis článku pro vyhledávače a sociální sítě..."
            className={`${inputClass} resize-none`}
            rows={3}
            maxLength={160}
          />
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {formData.metaDescription.length}/160 znaků - zobrazí se ve výsledcích vyhledávání
          </p>
        </div>
      </div>

      <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
          Náhled ve vyhledávači:
        </h4>
        <div className="space-y-1">
          <div className="text-blue-600 dark:text-blue-400 text-sm font-medium truncate">
            {formData.metaTitle || formData.title || 'Název článku'}
          </div>
          <div className="text-green-600 dark:text-green-400 text-xs">
            yoursite.com/blog/{formData.slug || 'slug'}
          </div>
          <div className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">
            {formData.metaDescription || formData.excerpt || 'Popis článku se zobrazí zde...'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeoForm;