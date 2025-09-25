'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  PencilIcon,
  EyeIcon,
  SunIcon,
  MoonIcon,
  DocumentArrowDownIcon,
  BookmarkIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';
import { useBlogEditor } from '@/hooks/useBlogEditor';
import MarkdownEditor from './MarkdownEditor';
import WysiwygEditor from './WysiwygEditor';
import Preview from './Preview';
import SeoForm from './SeoForm';
import { EditorMode, BlogPost } from '@/types/blog';

interface BlogEditorProps {
  initialData?: Partial<BlogPost>;
}

const BlogEditor: React.FC<BlogEditorProps> = ({ initialData }) => {
  const searchParams = useSearchParams();
  const postId = searchParams.get('id');
  
  const [loadingPost, setLoadingPost] = useState(!!postId);
  const [postData, setPostData] = useState(initialData);

  const {
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
  } = useBlogEditor(postData);

  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const showNotification = useCallback((type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // Load existing post if editing
  useEffect(() => {
    if (postId && !postData) {
      const loadPost = async () => {
        try {
          const response = await fetch(`/api/blog/${postId}`);
          if (!response.ok) {
            throw new Error('Failed to load post');
          }
          const post = await response.json();
          
          // Transform post data to form format
          const formattedData = {
            title: post.title || '',
            slug: post.slug || '',
            content: post.content || '',
            excerpt: post.excerpt || '',
            metaTitle: post.metaTitle || '',
            metaDescription: post.metaDescription || '',
            keywords: post.keywords || '',
            published: post.published ?? false,
          };
          
          setPostData(formattedData);
          setLoadingPost(false);
        } catch (err) {
          console.error('Failed to load post:', err);
          showNotification('error', 'Chyba při načítání článku');
          setLoadingPost(false);
        }
      };
      
      loadPost();
    } else if (!postId) {
      setLoadingPost(false);
    }
  }, [postId, postData, showNotification]);

  const handleSaveDraft = async () => {
    try {
      await saveBlogPost(false, postId || undefined); // Save as draft
      showNotification('success', 'Koncept byl uložen');
    } catch {
      showNotification('error', 'Chyba při ukládání konceptu');
    }
  };

  const handlePublish = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      showNotification('error', 'Vyplňte název a obsah článku');
      return;
    }

    try {
      await saveBlogPost(true, postId || undefined); // Publish
      showNotification('success', 'Článek byl publikován');
      if (!postId) {
        clearDraft();
      }
    } catch {
      showNotification('error', 'Chyba při publikování článku');
    }
  };

  const handleExport = () => {
    try {
      exportMarkdown();
      showNotification('success', 'Markdown soubor byl stažen');
    } catch {
      showNotification('error', 'Chyba při exportu');
    }
  };

  const toggleMode = (mode: EditorMode) => {
    setEditorMode(mode);
  };

  if (loadingPost) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Načítám článek...</p>
        </div>
      </div>
    );
  }

  const buttonClass = `px-4 py-2 rounded-lg transition-colors font-medium`;
  const primaryButtonClass = `${buttonClass} bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed`;
  const secondaryButtonClass = `${buttonClass} ${
    isDarkMode
      ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
  }`;

  return (
    <div className={`min-h-screen transition-colors ${
      isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg ${
          notification.type === 'success'
            ? 'bg-green-500 text-white'
            : 'bg-red-500 text-white'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <header className={`sticky top-0 z-40 border-b ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">
                {postId ? 'Upravit článek' : 'Nový článek'}
              </h1>
              
              {isAutoSaving && (
                <span className="text-sm text-blue-500 animate-pulse">
                  Ukládám...
                </span>
              )}
              
              {lastSaved && (
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Naposledy uloženo: {lastSaved.toLocaleString('cs-CZ')}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {/* Mode switcher */}
              <div className={`flex rounded-lg border ${
                isDarkMode ? 'border-gray-600' : 'border-gray-300'
              }`}>
                <button
                  onClick={() => toggleMode('markdown')}
                  className={`px-3 py-1 text-sm rounded-l-lg transition-colors ${
                    editorMode === 'markdown'
                      ? 'bg-blue-600 text-white'
                      : isDarkMode
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Markdown
                </button>
                <button
                  onClick={() => toggleMode('wysiwyg')}
                  className={`px-3 py-1 text-sm rounded-r-lg transition-colors ${
                    editorMode === 'wysiwyg'
                      ? 'bg-blue-600 text-white'
                      : isDarkMode
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  WYSIWYG
                </button>
              </div>

              {/* Theme toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={secondaryButtonClass}
                title={isDarkMode ? 'Světlý režim' : 'Tmavý režim'}
              >
                {isDarkMode ? (
                  <SunIcon className="w-5 h-5" />
                ) : (
                  <MoonIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Title input */}
          <div className="mt-4">
            <input
              type="text"
              value={formData.title}
              onChange={(e) => updateTitle(e.target.value)}
              placeholder="Název článku..."
              className={`w-full text-3xl font-bold bg-transparent border-none outline-none placeholder-gray-400 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1">
        {/* Mobile tabs */}
        <div className={`lg:hidden border-b ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex">
            <button
              onClick={() => setActiveTab('editor')}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                activeTab === 'editor'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : isDarkMode
                  ? 'text-gray-400 hover:text-gray-200'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <PencilIcon className="w-4 h-4 inline mr-2" />
              Editor
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                activeTab === 'preview'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : isDarkMode
                  ? 'text-gray-400 hover:text-gray-200'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <EyeIcon className="w-4 h-4 inline mr-2" />
              Náhled
            </button>
          </div>
        </div>

        <div className="flex h-[calc(100vh-180px)]">
          {/* Editor panel */}
          <div className={`w-full lg:w-1/2 ${
            activeTab === 'preview' ? 'hidden lg:block' : ''
          }`}>
            <div className="h-full">
              {editorMode === 'markdown' ? (
                <MarkdownEditor
                  content={formData.content}
                  onChange={updateContent}
                  isDarkMode={isDarkMode}
                />
              ) : (
                <WysiwygEditor
                  content={formData.content}
                  onChange={updateContent}
                  isDarkMode={isDarkMode}
                />
              )}
            </div>
          </div>

          {/* Preview panel */}
          <div className={`w-full lg:w-1/2 border-l ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          } ${activeTab === 'editor' ? 'hidden lg:block' : ''}`}>
            <Preview
              content={formData.content}
              title={formData.title}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      </div>

      {/* SEO Form */}
      <SeoForm
        formData={formData}
        onChange={updateFormData}
        isDarkMode={isDarkMode}
      />

      {/* Action buttons */}
      <div className={`border-t px-6 py-4 ${
        isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSaveDraft}
              disabled={isSaving}
              className={secondaryButtonClass}
            >
              <BookmarkIcon className="w-4 h-4 mr-2" />
              {isSaving ? 'Ukládám...' : 'Uložit koncept'}
            </button>

            <button
              onClick={handleExport}
              className={secondaryButtonClass}
            >
              <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
              Export MD
            </button>

            <button
              onClick={clearDraft}
              className={secondaryButtonClass}
            >
              Vymazat vše
            </button>
          </div>

          <button
            onClick={handlePublish}
            disabled={isSaving || !formData.title.trim() || !formData.content.trim()}
            className={primaryButtonClass}
          >
            <ShareIcon className="w-4 h-4 mr-2" />
            {isSaving ? 'Publikuji...' : 'Publikovat'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;