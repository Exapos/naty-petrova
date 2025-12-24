import sanitizeHtml from 'sanitize-html';

export function sanitizeInput(html: string) {
  return sanitizeHtml(html, {
    allowedTags: [
      // Text formatting
      'b', 'i', 'em', 'strong', 'u', 's', 'strike', 'sub', 'sup', 'mark', 'span',
      // Headings
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      // Paragraphs & blocks
      'p', 'br', 'hr', 'div', 'blockquote', 'pre', 'code',
      // Links
      'a',
      // Lists
      'ul', 'ol', 'li',
      // Tables
      'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'colgroup', 'col',
      // Media
      'img', 'iframe', 'figure', 'figcaption',
      // Task lists (TipTap)
      'input', 'label',
    ],
    allowedAttributes: {
      // Global attributes for all tags
      '*': ['style', 'class', 'id'],
      // Links
      a: ['href', 'name', 'target', 'rel', 'title'],
      // Images
      img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
      // iframes (for YouTube, etc.)
      iframe: [
        'src', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen',
        'scrolling', 'title', 'loading', 'referrerpolicy',
        // YouTube specific
        'autoplay', 'disablekbcontrols', 'enableiframeapi', 'endtime',
        'ivloadpolicy', 'loop', 'modestbranding', 'origin', 'playlist',
        'progressbarcolor', 'rel', 'start', 'cclanguage', 'ccloadpolicy',
      ],
      // Divs with data attributes (for YouTube wrapper, etc.)
      div: ['data-youtube-video', 'data-type', 'data-checked'],
      // Tables
      table: ['border', 'cellpadding', 'cellspacing'],
      th: ['colspan', 'rowspan', 'scope'],
      td: ['colspan', 'rowspan'],
      col: ['span', 'width'],
      // Task list checkboxes
      input: ['type', 'checked', 'disabled'],
      // Lists
      ul: ['data-type'],
      li: ['data-checked'],
      // Code blocks
      pre: ['data-language'],
      code: ['class', 'data-language'],
    },
    // Allow data-* attributes
    allowedClasses: {
      '*': ['*'], // Allow all classes
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: {
      img: ['http', 'https', 'data'],
    },
    // Allow YouTube iframes
    allowedIframeHostnames: [
      'www.youtube.com',
      'youtube.com',
      'www.youtube-nocookie.com',
      'youtube-nocookie.com',
      'youtu.be',
      'player.vimeo.com',
    ],
    // Keep all inline styles - with restricted validators for security
    allowedStyles: {
      '*': {
        // Color & text - allow hex, rgb, rgba, hsl, hsla, named colors
        'color': [/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/, /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/, /^[a-zA-Z]+$/],
        'background-color': [/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/, /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/, /^[a-zA-Z]+$/, /^transparent$/],
        'background': [/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/, /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/, /^[a-zA-Z]+$/, /^transparent$/, /^none$/],
        // Typography - safe values
        'font-family': [/^[a-zA-Z\s,'"_-]+$/],
        'font-size': [/^\d+(\.\d+)?(px|em|rem|%|pt)$/],
        'font-weight': [/^(normal|bold|bolder|lighter|\d{3})$/],
        'font-style': [/^(normal|italic|oblique)$/],
        'line-height': [/^\d+(\.\d+)?(px|em|rem|%)?$/, /^normal$/],
        'letter-spacing': [/^-?\d+(\.\d+)?(px|em|rem)$/, /^normal$/],
        // Text decoration
        'text-decoration': [/^(none|underline|overline|line-through)(\s+(solid|double|dotted|dashed|wavy))?(\s+#?[a-zA-Z0-9]+)?$/],
        'text-align': [/^(left|right|center|justify)$/],
        'text-transform': [/^(none|capitalize|uppercase|lowercase)$/],
        // Layout - numeric values only
        'width': [/^\d+(\.\d+)?(px|em|rem|%|vw|auto)$/],
        'height': [/^\d+(\.\d+)?(px|em|rem|%|vh|auto)$/],
        'max-width': [/^\d+(\.\d+)?(px|em|rem|%|vw|none)$/],
        'max-height': [/^\d+(\.\d+)?(px|em|rem|%|vh|none)$/],
        'margin': [/^(-?\d+(\.\d+)?(px|em|rem|%|auto)\s*){1,4}$/],
        'margin-top': [/^-?\d+(\.\d+)?(px|em|rem|%|auto)$/],
        'margin-right': [/^-?\d+(\.\d+)?(px|em|rem|%|auto)$/],
        'margin-bottom': [/^-?\d+(\.\d+)?(px|em|rem|%|auto)$/],
        'margin-left': [/^-?\d+(\.\d+)?(px|em|rem|%|auto)$/],
        'padding': [/^(\d+(\.\d+)?(px|em|rem|%)\s*){1,4}$/],
        'padding-top': [/^\d+(\.\d+)?(px|em|rem|%)$/],
        'padding-right': [/^\d+(\.\d+)?(px|em|rem|%)$/],
        'padding-bottom': [/^\d+(\.\d+)?(px|em|rem|%)$/],
        'padding-left': [/^\d+(\.\d+)?(px|em|rem|%)$/],
        // Border - safe patterns
        'border': [/^(\d+(\.\d+)?(px|em|rem)\s+)?(solid|dashed|dotted|double|none)(\s+#?[a-zA-Z0-9]+)?$/],
        'border-radius': [/^(\d+(\.\d+)?(px|em|rem|%)\s*){1,4}$/],
        // Display - limited safe values (no position/z-index to prevent overlays)
        'display': [/^(block|inline|inline-block|flex|grid|none|table|table-cell|table-row)$/],
        'vertical-align': [/^(baseline|top|middle|bottom|sub|super|text-top|text-bottom)$/],
      },
    },
    disallowedTagsMode: 'discard',
    // Transform tags if needed
    transformTags: {
      // Ensure YouTube iframes stay in wrapper divs
    },
  });
}
