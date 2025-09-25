'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import Image from 'next/image';

interface PreviewProps {
  content: string;
  title: string;
  isDarkMode: boolean;
}

const Preview: React.FC<PreviewProps> = ({ content, title, isDarkMode }) => {
  return (
    <div className={`h-full overflow-y-auto p-6 transition-colors ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
    }`}>
      <div className="max-w-none">
        {title && (
          <h1 className={`text-3xl font-bold mb-6 pb-3 border-b transition-colors ${
            isDarkMode ? 'border-gray-700 text-gray-100' : 'border-gray-200 text-gray-900'
          }`}>
            {title}
          </h1>
        )}
        
        <div className={`prose max-w-none ${
          isDarkMode ? 'prose-invert' : ''
        } prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:leading-relaxed prose-img:rounded-lg prose-img:shadow-md prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm ${
          isDarkMode ? 'prose-code:bg-gray-800' : ''
        } prose-pre:bg-gray-100 prose-pre:border prose-pre:border-gray-200 ${
          isDarkMode ? 'prose-pre:bg-gray-800 prose-pre:border-gray-700' : ''
        } prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-li:my-1`}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold mt-8 mb-4 first:mt-0">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-bold mt-6 mb-3">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-bold mt-4 mb-2">{children}</h3>
              ),
              p: ({ children }) => (
                <p className="mb-4 leading-relaxed">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="mb-1">{children}</li>
              ),
              blockquote: ({ children }) => (
                <blockquote className={`border-l-4 border-blue-500 pl-4 py-2 my-4 italic ${
                  isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
                }`}>
                  {children}
                </blockquote>
              ),
              code: ({ children, ...props }: any) => {
                const isInline = !props.className;
                if (isInline) {
                  return (
                    <code className={`px-1 py-0.5 rounded text-sm font-mono ${
                      isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {children}
                    </code>
                  );
                }
                return (
                  <pre className={`p-4 rounded-lg overflow-x-auto my-4 ${
                    isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800'
                  }`}>
                    <code className="font-mono text-sm">{children}</code>
                  </pre>
                );
              },
              img: ({ src, alt }: any) => (
                <Image
                  src={src}
                  alt={alt || ''}
                  width={800}
                  height={400}
                  className="max-w-full h-auto rounded-lg shadow-md my-4"
                />
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {children}
                </a>
              ),
            }}
          >
            {content || '*Zde se zobrazí náhled vašeho článku...*'}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default Preview;