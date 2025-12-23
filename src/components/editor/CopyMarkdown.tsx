'use client';

import React from 'react';
import { Editor } from '@tiptap/react';
import { motion } from 'framer-motion';

interface CopyMarkdownProps {
  editor: Editor | null;
}

export const CopyMarkdown: React.FC<CopyMarkdownProps> = ({ editor }) => {
  const handleCopyMarkdown = async () => {
    if (!editor) return;

    try {
      const html = editor.getHTML();
      
      // Jednoduchý HTML to Markdown konvertor
      const markdown = htmlToMarkdown(html);
      
      await navigator.clipboard.writeText(markdown);
      alert('Markdown zkopírován do schránky');
    } catch (error) {
      console.error('Chyba při kopírování:', error);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleCopyMarkdown}
      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
      title="Kopírovat jako Markdown"
    >
      📋 Copy Markdown
    </motion.button>
  );
};

// Jednoduchý HTML to Markdown konvertor
function htmlToMarkdown(html: string): string {
  let markdown = html;

  // Headings
  markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n');
  markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n');
  markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n');

  // Bold
  markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
  markdown = markdown.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');

  // Italic
  markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
  markdown = markdown.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');

  // Links
  markdown = markdown.replace(/<a[^>]*href=["'](.*?)["'][^>]*>(.*?)<\/a>/gi, '[$2]($1)');

  // Lists
  markdown = markdown.replace(/<ul[^>]*>(.*?)<\/ul>/gi, (match, content) => {
    const items = content.match(/<li[^>]*>(.*?)<\/li>/gi) || [];
    return items.map((item) => {
      const text = item.replace(/<li[^>]*>(.*?)<\/li>/gi, '$1');
      return `- ${text}`;
    }).join('\n') + '\n';
  });

  markdown = markdown.replace(/<ol[^>]*>(.*?)<\/ol>/gi, (match, content) => {
    const items = content.match(/<li[^>]*>(.*?)<\/li>/gi) || [];
    return items.map((item, index) => {
      const text = item.replace(/<li[^>]*>(.*?)<\/li>/gi, '$1');
      return `${index + 1}. ${text}`;
    }).join('\n') + '\n';
  });

  // Code blocks
  markdown = markdown.replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gi, '```\n$1\n```\n');
  markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');

  // Blockquotes
  markdown = markdown.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, (match, content) => {
    const lines = content.split('\n');
    return lines.map((line) => `> ${line}`).join('\n') + '\n';
  });

  // Line breaks and paragraphs
  markdown = markdown.replace(/<br\s*\/?>/gi, '\n');
  markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');

  // Remove remaining HTML tags
  markdown = markdown.replace(/<[^>]*>/gi, '');

  // Clean up whitespace
  markdown = markdown.replace(/\n{3,}/g, '\n\n').trim();

  return markdown;
}
