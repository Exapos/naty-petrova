/**
 * Integrace Blog Editor V2 do existujícího systému
 * 
 * Tento soubor obsahuje přípravné funkce a helpery
 * pro integraci nového editoru do vaší aplikace
 */

import React from 'react';
import { extractPlainText, generateExcerpt, countWords } from '@/components/editor/editorUtils';

/**
 * Příprava obsahu pro uložení do databáze
 */
export interface BlogPostData {
  title: string;
  content: string;
  excerpt: string;
  wordCount: number;
  characterCount: number;
  publishedAt?: string;
  updatedAt?: string;
  featured?: boolean;
  featuredImage?: string;
  tags?: string[];
  category?: string;
  slug?: string;
}

/**
 * Transformuje HTML obsah z editoru do formátu pro databázi
 */
export function prepareBlogPostData(
  title: string,
  htmlContent: string,
  metadata?: Partial<BlogPostData>
): BlogPostData {
  const plainText = extractPlainText(htmlContent);
  const wordCount = countWords(htmlContent);

  return {
    title,
    content: htmlContent,
    excerpt: generateExcerpt(htmlContent, 50),
    wordCount,
    characterCount: plainText.length,
    publishedAt: new Date().toISOString(),
    ...metadata,
  };
}

/**
 * Validuje blog post data
 */
export function validateBlogPost(data: BlogPostData): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data.title || data.title.trim().length === 0) {
    errors.push('Nadpis je povinný');
  }

  if (data.title && data.title.length > 200) {
    errors.push('Nadpis nesmí být delší než 200 znaků');
  }

  if (!data.content || data.content.trim().length === 0) {
    errors.push('Obsah je povinný');
  }

  if (data.wordCount < 50) {
    errors.push('Obsah musí obsahovat minimálně 50 slov');
  }

  if (data.excerpt && data.excerpt.length > 500) {
    errors.push('Výtah nesmí být delší než 500 znaků');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Konvertuje starý editor obsah na nový formát (pokud je potřeba)
 */
export function migrateOldEditorContent(oldContent: any): string {
  // Pokud je to pole bloků (starý editor)
  if (Array.isArray(oldContent)) {
    return convertBlocksToHtml(oldContent);
  }

  // Pokud je to již HTML
  if (typeof oldContent === 'string') {
    return oldContent;
  }

  return '';
}

/**
 * Konvertuje formado de blocos para HTML
 */
function convertBlocksToHtml(blocks: any[]): string {
  function escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (char) => map[char]);
  }

  function isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return url.startsWith('/') || url.startsWith('./') || url.startsWith('../');
    }
  }

  return blocks
    .map((block) => {
      const text = escapeHtml(block.text || '');
      switch (block.type) {
        case 'heading':
          return `<h${block.level || 2}>${text}</h${block.level || 2}>`;
        case 'text':
          return `<p>${text}</p>`;
        case 'image': {
          const src = isValidUrl(block.src) ? escapeHtml(block.src) : '';
          const alt = escapeHtml(block.alt || '');
          return src ? `<img src="${src}" alt="${alt}" />` : '';
        }
        default:
          return '';
      }
    })
    .join('\n');
}

/**
 * API helper pro uložení na server
 */
export async function saveBlogPost(data: BlogPostData, postId?: string) {
  const validation = validateBlogPost(data);

  if (!validation.valid) {
    throw new Error(validation.errors.join(', '));
  }

  const method = postId ? 'PUT' : 'POST';
  const url = postId ? `/api/blog/${postId}` : '/api/blog';

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = 'Chyba při ukládání';
    try {
      const error = await response.json();
      errorMessage = error.message || errorMessage;
    } catch {
      // Response was not JSON, use status text
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

/**
 * Formátuje blog post para exibição
 */
export function formatBlogPostForDisplay(post: BlogPostData) {
  const publishedDate = post.publishedAt ? new Date(post.publishedAt) : null;
  const updatedDate = post.updatedAt ? new Date(post.updatedAt) : null;

  return {
    ...post,
    published: publishedDate && !isNaN(publishedDate.getTime())
      ? publishedDate.toLocaleDateString('cs-CZ')
      : null,
    updated: updatedDate && !isNaN(updatedDate.getTime())
      ? updatedDate.toLocaleDateString('cs-CZ')
      : null,
  };
}

/**
 * Hooks pro práci s blog posty
 */
export function useBlogPostForm(onSubmit: (data: BlogPostData) => Promise<void>) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (title: string, content: string) => {
    setError(null);
    setLoading(true);

    try {
      const data = prepareBlogPostData(title, content);
      await onSubmit(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chyba při ukládání');
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, handleSubmit };
}

const blogEditorIntegration = {
  prepareBlogPostData,
  validateBlogPost,
  migrateOldEditorContent,
  saveBlogPost,
  formatBlogPostForDisplay,
  useBlogPostForm,
};

export default blogEditorIntegration;

// Typy
export type { BlogPostData };
