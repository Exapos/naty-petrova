'use client';

import React, { useState } from 'react';
import {
  PhotoIcon,
  XMarkIcon,
  PlusIcon,
  TagIcon,
  DocumentTextIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';


interface SEOSetupProps {
  onContinue: (data: any) => void;
  initialData?: any;
}


export const SEOSetup: React.FC<SEOSetupProps> = ({ onContinue, initialData }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    headerImage: initialData?.headerImage || undefined,
    tags: initialData?.tags || [],
    categories: initialData?.categories || [],
  });

  const [newTag, setNewTag] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [headerImagePreview, setHeaderImagePreview] = useState<string | null>(
    typeof initialData?.headerImage === 'string' ? initialData.headerImage : null
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, headerImage: file }));
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setHeaderImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addCategory = () => {
    if (newCategory.trim() && !formData.categories.includes(newCategory.trim())) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory.trim()]
      }));
      setNewCategory('');
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(cat => cat !== categoryToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim() && formData.description.trim()) {
      onContinue(formData);
    }
  };

  const isValid = formData.title.trim() && formData.description.trim();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-purple-500/25">
            <DocumentTextIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-4">
            SEO & Meta nastavení
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Nastavte základní informace o vašem článku pro lepší vyhledávání a sdílení na sociálních sítích
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            {/* Title */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Název článku *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 text-lg"
                placeholder="Zadejte název článku..."
                maxLength={60}
                required
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-gray-500">
                  Optimální délka: 50-60 znaků
                </p>
                <span className={`text-sm ${formData.title.length > 60 ? 'text-red-500' : 'text-gray-400'}`}>
                  {formData.title.length}/60
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Popis článku *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Napište stručný popis článku..."
                rows={4}
                maxLength={160}
                required
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-gray-500">
                  Optimální délka: 120-160 znaků
                </p>
                <span className={`text-sm ${formData.description.length > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                  {formData.description.length}/160
                </span>
              </div>
            </div>

            {/* Header Image */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Hlavní obrázek
              </label>
              <div className="space-y-4">
                {headerImagePreview ? (
                  <div className="relative group">
                    <div className="relative w-full h-64 rounded-xl overflow-hidden">
                      <Image
                        src={headerImagePreview}
                        alt="Header preview"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setHeaderImagePreview(null);
                          setFormData(prev => ({ ...prev, headerImage: undefined }));
                        }}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-violet-400 hover:bg-violet-50/50 transition-all duration-200 cursor-pointer">
                      <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 font-medium">Klikněte pro nahrání obrázku</p>
                      <p className="text-sm text-gray-400 mt-1">PNG, JPG, WebP až 5MB</p>
                    </div>
                  </label>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <TagIcon className="w-4 h-4 inline mr-1" />
                Štítky
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="w-4 h-4 hover:bg-violet-200 rounded-full flex items-center justify-center"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  placeholder="Přidat štítek..."
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Categories */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Kategorie
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.categories.map((category, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {category}
                    <button
                      type="button"
                      onClick={() => removeCategory(category)}
                      className="w-4 h-4 hover:bg-blue-200 rounded-full flex items-center justify-center"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  placeholder="Přidat kategorii..."
                />
                <button
                  type="button"
                  onClick={addCategory}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Continue Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={!isValid}
                className={`px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-200 ${
                  isValid
                    ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Pokračovat do editoru
                <ArrowRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};