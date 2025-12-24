'use client';

import React from 'react';
import { BlogBlock } from '@/types/blog';
import Image from 'next/image';
import DOMPurify from 'isomorphic-dompurify';

interface RenderBlogBlocksProps {
  blocks: BlogBlock[] | string;
  globalStyles?: any;
}

export function RenderBlogBlocks({ blocks }: RenderBlogBlocksProps) {
  // Parse blocks if they're stored as JSON string
  let parsedBlocks: BlogBlock[] = [];
  
  if (typeof blocks === 'string') {
    try {
      parsedBlocks = JSON.parse(blocks);
    } catch (error) {
      console.error('Failed to parse blocks:', error);
      return null;
    }
  } else {
    parsedBlocks = blocks;
  }

  const renderBlock = (block: BlogBlock, index: number): React.ReactNode => {
    const blockStyle = {
      ...(block.styles || {}),
    };

    switch (block.type) {
      case 'paragraph':
        return (
          <p key={index} style={blockStyle} className="text-lg leading-8 mb-6">
            {block.content}
          </p>
        );

      case 'heading': {
        const level = block.content?.level || 2;
        const headingClasses = {
          h1: 'text-4xl font-bold mb-6 mt-8',
          h2: 'text-3xl font-bold mb-4 mt-6',
          h3: 'text-2xl font-bold mb-3 mt-4',
          h4: 'text-xl font-bold mb-3 mt-3',
        }[`h${level}`] || 'text-lg font-bold mb-2 mt-2';

        return React.createElement(
          `h${level}` as any,
          { key: index, style: blockStyle, className: headingClasses },
          block.content?.text || block.content
        );
      }

      case 'image':
        return (
          <div key={index} style={blockStyle} className="my-8 rounded-xl overflow-hidden">
            <Image
              src={block.content?.src || block.content}
              alt={block.content?.alt || 'Article image'}
              width={800}
              height={600}
              className="w-full h-auto"
            />
            {block.content?.caption && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center italic">
                {block.content.caption}
              </p>
            )}
          </div>
        );

      case 'quote':
      case 'blockquote':
        return (
          <blockquote
            key={index}
            style={blockStyle}
            className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 px-6 py-4 rounded-r-xl my-8 italic text-lg"
          >
            <p>{block.content?.text || block.content}</p>
            {block.content?.author && (
              <p className="text-sm mt-3 font-semibold">— {block.content.author}</p>
            )}
          </blockquote>
        );

      case 'list':
      case 'bulletList':
        return (
          <ul key={index} style={blockStyle} className="list-disc list-inside space-y-2 mb-6 ml-4">
            {(block.content || []).map((item: any, i: number) => (
              <li key={i} className="text-lg">
                {typeof item === 'string' ? item : item.text}
              </li>
            ))}
          </ul>
        );

      case 'orderedList':
        return (
          <ol key={index} style={blockStyle} className="list-decimal list-inside space-y-2 mb-6 ml-4">
            {(block.content || []).map((item: any, i: number) => (
              <li key={i} className="text-lg">
                {typeof item === 'string' ? item : item.text}
              </li>
            ))}
          </ol>
        );

      case 'code':
        return (
          <pre key={index} style={blockStyle} className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto my-6">
            <code className="text-sm font-mono">{block.content}</code>
          </pre>
        );

      case 'divider':
      case 'hr':
        return <hr key={index} className="my-8 border-gray-300 dark:border-gray-700" />;

      case 'spacer': {
        const height = block.content?.height || 20;
        return <div key={index} style={{ height: `${height}px` }} />;
      }

      case 'html':
      case 'embed': {
        const sanitizedHtml = DOMPurify.sanitize(block.content || '', {
          ADD_TAGS: ['iframe'],
          ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'src', 'width', 'height'],
          ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
        });
        return (
          <div
            key={index}
            style={blockStyle}
            className="my-8"
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
          />
        );
      }

      case 'video':
        return (
          <div key={index} style={blockStyle} className="my-8 rounded-xl overflow-hidden">
            <iframe
              width="100%"
              height={block.content?.height || 480}
              src={block.content?.src}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-xl"
            />
          </div>
        );

      case 'columns':
      case 'twoColumn': {
        const columns = block.subBlocks || [];
        return (
          <div
            key={index}
            style={blockStyle}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8"
          >
            {columns.map((col, i) => (
              <div key={i}>
                {col.content && renderBlock(col as any, i)}
              </div>
            ))}
          </div>
        );
      }

      case 'callout':
      case 'highlight': {
        const bgColor = block.content?.color || 'blue';
        const bgColorClass = {
          blue: 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500',
          green: 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500',
          yellow: 'bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500',
          red: 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500',
        }[bgColor as string] || 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500';

        return (
          <div key={index} style={blockStyle} className={`${bgColorClass} p-4 rounded-r-lg my-6`}>
            {block.content?.icon && <span className="mr-2">{block.content.icon}</span>}
            {block.content?.text && <p className="text-lg">{block.content.text}</p>}
          </div>
        );
      }

      case 'table':
        return (
          <div key={index} style={blockStyle} className="overflow-x-auto my-8">
            <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
              <tbody>
                {(block.content || []).map((row: any, i: number) => (
                  <tr key={i} className="border border-gray-300 dark:border-gray-700">
                    {(row || []).map((cell: any, j: number) => (
                      <td
                        key={j}
                        className="border border-gray-300 dark:border-gray-700 p-3"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        // Fallback for unknown block types
        return (
          <div key={index} style={blockStyle} className="my-6 p-4 bg-gray-100 dark:bg-gray-800 rounded">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Unknown block type: {block.type}
            </p>
          </div>
        );
    }
  };

  return <>{parsedBlocks.map((block, index) => renderBlock(block, index))}</>;
}

export default RenderBlogBlocks;
