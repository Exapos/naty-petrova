'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CloudArrowUpIcon,
  ArrowLeftIcon,
  Cog6ToothIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { TipTapEditor } from '@/components/editor/TipTapEditor';
import { toast } from 'react-toastify';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string | null;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function BlogEditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get('id');

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [published, setPublished] = useState(false);

  // UI state
  const [loading, setLoading] = useState(!!postId);
  const [saving, setSaving] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load existing post
  useEffect(() => {
    if (postId) {
      const loadPost = async () => {
        try {
          const response = await fetch(`/api/blog/${postId}`);
          if (!response.ok) throw new Error('Nepodařilo se načíst článek');

          const post: BlogPost = await response.json();
          setTitle(post.title);
          setSlug(post.slug);
          setContent(post.content);
          setExcerpt(post.excerpt);
          setMetaTitle(post.metaTitle);
          setMetaDescription(post.metaDescription);
          setKeywords(post.keywords);
          setFeaturedImage(post.featuredImage);
          setPublished(post.published);
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Chyba při načítání';
          setError(message);
          toast.error(message);
        } finally {
          setLoading(false);
        }
      };

      loadPost();
    }
  }, [postId]);

  // Auto-generate slug
  useEffect(() => {
    if (!slug && title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generatedSlug);
    }
  }, [title, slug]);

  // Save draft
  const handleSaveDraft = async () => {
    if (!title.trim()) {
      toast.error('Zadejte název článku');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const method = postId ? 'PUT' : 'POST';
      const url = postId ? `/api/blog/${postId}` : '/api/blog';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          content,
          excerpt,
          metaTitle,
          metaDescription,
          keywords,
          featuredImage,
          published: false,
        }),
      });

      if (!response.ok) throw new Error('Chyba při ukládání');

      const data = await response.json();
      setLastSaved(new Date());
      toast.success('Koncept uložen');

      if (!postId) {
        router.push(`/admin/blog/editor?id=${data.id}`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Chyba při ukládání';
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  // Publish article
  const handlePublish = async () => {
    if (!title.trim()) {
      toast.error('Zadejte název článku');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const method = postId ? 'PUT' : 'POST';
      const url = postId ? `/api/blog/${postId}` : '/api/blog';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          content,
          excerpt,
          metaTitle,
          metaDescription,
          keywords,
          featuredImage,
          published: true,
        }),
      });

      if (!response.ok) throw new Error('Chyba při publikování');

      const data = await response.json();
      setLastSaved(new Date());
      toast.success('Článek publikován');
      setPublished(true);

      if (!postId) {
        router.push(`/admin/blog/editor?id=${data.id}`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Chyba při publikování';
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Načítám článek...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/admin/blog')}
              className="p-2 hover:bg-white rounded-lg transition-colors"
              title="Zpět"
            >
              <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Blog Editor</h1>
              <p className="text-gray-600 mt-1">
                {postId ? 'Upravit článek' : 'Nový článek'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {published && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg">
                <CheckCircleIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Publikováno</span>
              </div>
            )}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-white rounded-lg transition-colors"
              title="Nastavení"
            >
              <Cog6ToothIcon className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
          >
            {error}
          </motion.div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Editor - Main Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col"
            style={{ height: 'calc(100vh - 200px)' }}
          >
            <TipTapEditor
              value={content}
              onChange={setContent}
              placeholder="Začněte psát svůj článek..."
            />
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Akce</h3>
              <div className="space-y-3">
                <button
                  onClick={handleSaveDraft}
                  disabled={saving}
                  className="w-full px-4 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
                >
                  Uložit koncept
                </button>
                <button
                  onClick={handlePublish}
                  disabled={saving}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <CloudArrowUpIcon className="w-4 h-4" />
                  {saving ? 'Ukládá se...' : 'Publikovat'}
                </button>
              </div>

              {lastSaved && (
                <p className="text-xs text-gray-500 mt-4 text-center">
                  Naposledy uloženo: {lastSaved.toLocaleTimeString('cs-CZ')}
                </p>
              )}
            </div>

            {/* Quick Info */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Tipy</h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Ctrl+Z vrátit zpět</li>
                <li>• Ctrl+Y znovu</li>
                <li>• Ctrl+B tučné</li>
                <li>• Ctrl+I kurzíva</li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Settings Modal */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 100, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 100, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl sm:mx-4 shadow-2xl max-h-96 overflow-y-auto"
              >
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Nastavení článku</h2>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Název
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Název vašeho článku"
                    />
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      URL
                    </label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="url-clanek"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      {slug && `URL: /blog/${slug}`}
                    </p>
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Výtah
                    </label>
                    <textarea
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Krátký popis článku..."
                    />
                  </div>

                  {/* Meta Title */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      SEO Nadpis
                    </label>
                    <input
                      type="text"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      maxLength={60}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="SEO nadpis (do 60 znaků)"
                    />
                    <p className="text-xs text-gray-500 mt-1">{metaTitle.length}/60</p>
                  </div>

                  {/* Meta Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      SEO Popis
                    </label>
                    <textarea
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      maxLength={160}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="SEO popis (do 160 znaků)"
                    />
                    <p className="text-xs text-gray-500 mt-1">{metaDescription.length}/160</p>
                  </div>

                  {/* Keywords */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Klíčová slova
                    </label>
                    <input
                      type="text"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Oddělujte čárkami..."
                    />
                  </div>

                  {/* Featured Image */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Hlavní obrázek
                    </label>
                    <input
                      type="text"
                      value={featuredImage || ''}
                      onChange={(e) => setFeaturedImage(e.target.value || null)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="URL obrázku..."
                    />
                    {featuredImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={featuredImage}
                        alt="Featured"
                        className="w-full h-40 object-cover rounded-lg mt-3"
                      />
                    )}
                  </div>
                </div>

                <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex gap-3">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="flex-1 px-4 py-2 text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Zavřít
                  </button>
                  <button
                    onClick={handleSaveDraft}
                    disabled={saving}
                    className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                  >
                    {saving ? 'Ukládá se...' : 'Uložit'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
