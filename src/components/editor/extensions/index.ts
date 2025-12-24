// Custom Extensions for TipTap Editor
import { Extension, Node } from '@tiptap/core';

// Module augmentation for custom commands
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    tableOfContentsNode: {
      insertToc: () => ReturnType;
    };
  }
}

// Details Node (Collapsible content)
export const Details = Node.create({
  name: 'details',
  group: 'block',
  content: 'detailsSummary detailsContent',
  
  parseHTML() {
    return [{ tag: 'details' }];
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['details', { ...HTMLAttributes, class: 'editor-details' }, 0];
  },
  
  addCommands() {
    return {
      setDetails: () => ({ commands }: any) => {
        return commands.insertContent({
          type: 'details',
          content: [
            { type: 'detailsSummary', content: [{ type: 'text', text: 'Klikněte pro rozbalení' }] },
            { type: 'detailsContent', content: [{ type: 'paragraph' }] },
          ],
        });
      },
    } as any;
  },
});

export const DetailsSummary = Node.create({
  name: 'detailsSummary',
  group: 'block',
  content: 'inline*',
  
  parseHTML() {
    return [{ tag: 'summary' }];
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['summary', { ...HTMLAttributes, class: 'editor-details-summary' }, 0];
  },
});

export const DetailsContent = Node.create({
  name: 'detailsContent',
  group: 'block',
  content: 'block+',
  
  parseHTML() {
    return [{ tag: 'div[data-details-content]' }];
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-details-content': '', class: 'editor-details-content' }, 0];
  },
});

// Line Height Extension
export const LineHeight = Extension.create({
  name: 'lineHeight',
  
  addOptions() {
    return {
      types: ['paragraph', 'heading'],
      defaultLineHeight: '1.5',
    };
  },
  
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: this.options.defaultLineHeight,
            parseHTML: (element) => element.style.lineHeight || null,
            renderHTML: (attributes) => {
              if (!attributes.lineHeight) return {};
              return { style: `line-height: ${attributes.lineHeight}` };
            },
          },
        },
      },
    ];
  },
  
  addCommands() {
    return {
      setLineHeight: (lineHeight: string) => ({ commands }) => {
        return this.options.types.every((type: string) =>
          commands.updateAttributes(type, { lineHeight })
        );
      },
      unsetLineHeight: () => ({ commands }) => {
        return this.options.types.every((type: string) =>
          commands.resetAttributes(type, 'lineHeight')
        );
      },
    };
  },
});

// Background Color Extension
export const BackgroundColor = Extension.create({
  name: 'backgroundColor',
  
  addOptions() {
    return {
      types: ['textStyle'],
    };
  },
  
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          backgroundColor: {
            default: null,
            parseHTML: (element) => element.style.backgroundColor?.replace(/['"]+/g, ''),
            renderHTML: (attributes) => {
              if (!attributes.backgroundColor) return {};
              return { style: `background-color: ${attributes.backgroundColor}` };
            },
          },
        },
      },
    ];
  },
  
  addCommands() {
    return {
      setBackgroundColor: (color: string) => ({ chain }) => {
        return chain().setMark('textStyle', { backgroundColor: color }).run();
      },
      unsetBackgroundColor: () => ({ chain }) => {
        return chain().setMark('textStyle', { backgroundColor: null }).removeEmptyTextStyle().run();
      },
    };
  },
});

// YouTube Node
export const YouTubeEmbed = Node.create({
  name: 'youtube',
  group: 'block',
  atom: true,
  
  addAttributes() {
    return {
      src: { default: null },
      width: { default: 640 },
      height: { default: 360 },
    };
  },
  
  parseHTML() {
    return [
      {
        tag: 'div[data-youtube-video]',
      },
    ];
  },
  
  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      { 'data-youtube-video': '', class: 'youtube-embed-wrapper' },
      [
        'iframe',
        {
          src: HTMLAttributes.src,
          width: HTMLAttributes.width,
          height: HTMLAttributes.height,
          frameborder: '0',
          allowfullscreen: 'true',
          allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
          class: 'youtube-embed',
        },
      ],
    ];
  },
  
  addCommands() {
    return {
      setYoutubeVideo: (options: { src: string; width?: number; height?: number }) => ({ commands }) => {
        const videoId = extractYouTubeId(options.src);
        if (!videoId) return false;
        
        return commands.insertContent({
          type: 'youtube',
          attrs: {
            src: `https://www.youtube.com/embed/${videoId}`,
            width: options.width || 640,
            height: options.height || 360,
          },
        });
      },
    };
  },
});

function extractYouTubeId(url: string): string | null {
  // Handle various YouTube URL formats
  const patterns = [
    // Standard watch URL: https://www.youtube.com/watch?v=VIDEO_ID
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    // Shortened URL: https://youtu.be/VIDEO_ID
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    // Embed URL: https://www.youtube.com/embed/VIDEO_ID
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    // Shorts URL: https://www.youtube.com/shorts/VIDEO_ID
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    // v= anywhere in query: ...?v=VIDEO_ID
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    // Just the video ID (11 characters)
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

// Copy Markdown Extension
export const CopyMarkdown = Extension.create({
  name: 'copyMarkdown',
  
  addKeyboardShortcuts() {
    return {
      'Mod-Shift-c': ({ editor }) => {
        const json = editor.getJSON();
        navigator.clipboard.writeText(JSON.stringify(json, null, 2));
        return true;
      },
    };
  },
});

// Selection Extension - preserve selection on blur
export const SelectionPreserver = Extension.create({
  name: 'selectionPreserver',
  
  addOptions() {
    return {
      className: 'selection-preserved',
    };
  },
});

// Trailing Node Extension
export const TrailingNode = Extension.create({
  name: 'trailingNode',
  
  addOptions() {
    return {
      node: 'paragraph',
      notAfter: ['paragraph'],
    };
  },
  
  addProseMirrorPlugins() {
    // TODO: Implement trailing node plugin if needed
    return [];
  },
});

// Table of Contents Node - renders a TOC placeholder in the editor
export const TocNode = Node.create({
  name: 'tableOfContentsNode',
  group: 'block',
  atom: true,
  
  parseHTML() {
    return [
      { tag: 'div[data-type="toc"]' },
      { tag: 'div[data-type="tableOfContents"]' },
    ];
  },
  
  renderHTML() {
    return ['div', { 
      'data-type': 'toc',
      'class': 'toc-node',
    }, '📑 Obsah bude vygenerován automaticky z nadpisů'];
  },
  
  addCommands() {
    return {
      insertToc: () => ({ chain }) => {
        return chain()
          .insertContent({ type: this.name })
          .run();
      },
    };
  },
});
