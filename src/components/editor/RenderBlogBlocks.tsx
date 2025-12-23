'use client';

import React from 'react';
import { BlogBlock } from '@/types/blog';
import { sanitizeHtml } from '@/lib/sanitize';

interface RenderBlogBlocksProps {
  blocks?: BlogBlock[];
  globalStyles?: any;
}

export const RenderBlogBlocks: React.FC<RenderBlogBlocksProps> = ({
  blocks = [],
  globalStyles = {},
}) => {
  if (!blocks || blocks.length === 0) {
    return <p className="text-gray-500">Žádný obsah k zobrazení</p>;
  }

  return (
    <div className="space-y-6">
      {blocks.map((block) => (
        <div
          key={block.id}
          className="prose prose-sm dark:prose-invert max-w-none"
          style={block.styles || {}}
        >
          {block.type === 'paragraph' && (
            <p dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.content) }} />
          )}
          {block.type === 'heading' && block.content && (
            React.createElement(
              `h${block.content.level || 2}` as keyof JSX.IntrinsicElements,
              { dangerouslySetInnerHTML: { __html: sanitizeHtml(block.content.text || '') } }
            )
          )}
          {block.type === 'image' && block.content && (
            <figure className="my-4">
              <img
                src={block.content.src}
                alt={block.content.alt || 'Blog image'}
                className="w-full rounded-lg"
              />
              {block.content.caption && (
                <figcaption
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(block.content.caption),
                  }}
                  className="text-center text-sm text-gray-600 mt-2"
                />
              )}
            </figure>
          )}
          {block.type === 'list' && block.content && (
            block.content.ordered ? (
              <ol
                dangerouslySetInnerHTML={{
                  __html: block.content.items
                    .map((item: string) => `<li>${sanitizeHtml(item)}</li>`)
                    .join(''),
                }}
              />
            ) : (
              <ul
                dangerouslySetInnerHTML={{
                  __html: block.content.items
                    .map((item: string) => `<li>${sanitizeHtml(item)}</li>`)
                    .join(''),
                }}
              />
            )
          )}
          {block.type === 'blockquote' && block.content && (
            <blockquote
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(block.content),
              }}
            />
          )}
          {block.type === 'code' && block.content && (
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <code>{block.content}</code>
            </pre>
          )}
          {block.type === 'table' && block.content && (
            <div
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(block.content),
              }}
            />
          )}
          {/* Fallback for unknown block types */}
          {!['paragraph', 'heading', 'image', 'list', 'blockquote', 'code', 'table'].includes(
            block.type
          ) && (
            <div
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(JSON.stringify(block.content)),
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};
