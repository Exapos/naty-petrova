import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitizuje HTML obsah proti XSS útokům
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty) return '';
  
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [], // Nepovolíme žádné HTML tagy - pouze text
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true // Zachováme textový obsah
  });
}

/**
 * Sanitizuje prostý text pro bezpečné zobrazení
 */
export function sanitizeText(text: string): string {
  if (!text) return '';
  
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Escape SQL wildcards pro LIKE dotazy
 */
export function escapeSqlLike(text: string): string {
  if (!text) return '';
  
  return text
    .replace(/\\/g, '\\\\')
    .replace(/%/g, '\\%')
    .replace(/_/g, '\\_');
}