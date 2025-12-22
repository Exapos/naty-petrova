'use client';

import React from 'react';
import { BlogBlock } from '@/types/blog';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface RenderBlogBlocksProps {
  blocks: BlogBlock[];
  globalStyles?: any;
}

const styleMap = (styles: any = {}) => ({
  backgroundColor: styles.backgroundColor,
  color: styles.textColor,
  padding: styles.padding,
  margin: styles.margin,
});

const RenderHeading = ({ block }: { block: BlogBlock }) => {
  const HeadingTag = `h${block.content?.level || 2}` as keyof React.JSX.IntrinsicElements;
  return (
    <HeadingTag style={styleMap(block.styles)} className="font-semibold tracking-tight">
      {block.content?.text}
    </HeadingTag>
  );
};

const RenderText = ({ block }: { block: BlogBlock }) => (
  <div style={styleMap(block.styles)} className="prose lg:prose-lg">
    <div dangerouslySetInnerHTML={{ __html: block.content?.text || '' }} />
  </div>
);

const RenderImage = ({ block }: { block: BlogBlock }) => (
  <figure style={styleMap(block.styles)} className="my-6">
    {block.content?.src && (
      <Image
        src={block.content.src}
        alt={block.content?.alt || ''}
        width={1200}
        height={675}
        className="w-full rounded-xl shadow-lg"
      />
    )}
    {block.content?.caption && (
      <figcaption className="mt-3 text-sm text-gray-500 text-center">
        {block.content.caption}
      </figcaption>
    )}
  </figure>
);

const RenderLayout = ({ block }: { block: BlogBlock }) => {
  const columns = block.subBlocks || [];
  const layout = block.layout || 'two-column-equal';
  const getGrid = () => {
    switch (layout) {
      case 'two-column-left':
        return 'md:grid-cols-[2fr_1fr]';
      case 'two-column-right':
        return 'md:grid-cols-[1fr_2fr]';
      case 'three-column':
        return 'md:grid-cols-3';
      default:
        return 'md:grid-cols-2';
    }
  };

  return (
    <div style={styleMap(block.styles)} className={`grid gap-6 ${getGrid()}`}>
      {columns.map((sub) => (
        <div key={sub.id} className="bg-white/40 rounded-xl">
          <RenderBlock block={sub as BlogBlock} />
        </div>
      ))}
    </div>
  );
};

const RenderBlock = ({ block }: { block: BlogBlock }) => {
  switch (block.type) {
    case 'heading':
      return <RenderHeading block={block} />;
    case 'text':
      return <RenderText block={block} />;
    case 'image':
      return <RenderImage block={block} />;
    case 'layout':
      return <RenderLayout block={block} />;
    default:
      return null;
  }
};

export function RenderBlogBlocks({ blocks, globalStyles }: RenderBlogBlocksProps) {
  return (
    <div
      style={{
        fontFamily: globalStyles?.fontFamily,
        color: globalStyles?.primaryColor,
      }}
      className="space-y-10"
    >
      {blocks.map((block) => (
        <motion.div
          key={block.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <RenderBlock block={block} />
        </motion.div>
      ))}
    </div>
  );
}

