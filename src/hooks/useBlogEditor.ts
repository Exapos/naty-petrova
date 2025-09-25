'use client';

import { useState, useEffect, useCallback } from 'react';
import { BlogPostFormData, EditorMode } from '@/types/blog';

const STORAGE_KEY = 'blog-editor-draft';
const AUTOSAVE_DELAY = 2000; // 2 seconds

export function useBlogEditor(initialData?: Partial<BlogPostFormData>) {
  const [formData, setFormData] = useState<BlogPostFormData>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    published: false,
    editorMode: 'wysiwyg',
  });

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
      }));
      
      // Set editor mode from the existing post
      if (initialData.editorMode) {
        setEditorMode(initialData.editorMode);
      }
    }
  }, [initialData]);

  const [editorMode, setEditorMode] = useState<EditorMode>('markdown');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData && !initialData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed);
      } catch (error) {
        console.error('Failed to parse saved blog data:', error);
      }
    }

    // Load theme preference
    const savedTheme = localStorage.getItem('blog-editor-theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    } else if (savedTheme === null) {
      // Auto-detect system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(systemPrefersDark);
    }
  }, [initialData]);

  // Auto-save to localStorage
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.title || formData.content) {
        setIsAutoSaving(true);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
        setLastSaved(new Date());
        setTimeout(() => setIsAutoSaving(false), 500);
      }
    }, AUTOSAVE_DELAY);

    return () => clearTimeout(timeoutId);
  }, [formData]);

  // Save theme preference
  useEffect(() => {
    localStorage.setItem('blog-editor-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const updateFormData = useCallback((updates: Partial<BlogPostFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const updateContent = useCallback((content: string) => {
    updateFormData({ content });
  }, [updateFormData]);

  const updateTitle = useCallback((title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    updateFormData({ title, slug });
  }, [updateFormData]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      metaTitle: '',
      metaDescription: '',
      keywords: '',
      published: false,
      editorMode: 'wysiwyg',
    });
    setEditorMode('wysiwyg');
  }, []);

  const saveBlogPost = useCallback(async (published = false, postId?: string) => {
    setIsSaving(true);
    try {
      const url = postId ? `/api/blog/${postId}` : '/api/blog';
      const method = postId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          published,
          editorMode,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save blog post');
      }

      const savedPost = await response.json();
      
      if (published) {
        clearDraft();
      }
      
      return savedPost;
    } catch (error) {
      console.error('Error saving blog post:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [formData, clearDraft, editorMode]);

  const exportMarkdown = useCallback(() => {
    const markdown = `---
title: "${formData.title}"
slug: "${formData.slug}"
excerpt: "${formData.excerpt}"
metaTitle: "${formData.metaTitle}"
metaDescription: "${formData.metaDescription}"
keywords: "${formData.keywords}"
---

${formData.content}`;

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.slug || 'blog-post'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [formData]);

  return {
    formData,
    editorMode,
    isDarkMode,
    isAutoSaving,
    lastSaved,
    isSaving,
    setEditorMode,
    setIsDarkMode,
    updateFormData,
    updateContent,
    updateTitle,
    clearDraft,
    saveBlogPost,
    exportMarkdown,
  };
}