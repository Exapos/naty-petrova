/**
 * Utility functions for blog editor
 * Extraction of plain text, word count, and excerpt generation
 */

/**
 * Extracts plain text from HTML content
 * Removes all HTML tags and returns only text content
 */
export function extractPlainText(htmlContent: string): string {
  if (!htmlContent) return '';
  
  // Remove HTML tags
  const plainText = htmlContent
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();
  
  return plainText;
}

/**
 * Counts the number of words in HTML content
 */
export function countWords(htmlContent: string): number {
  const plainText = extractPlainText(htmlContent);
  if (!plainText) return 0;
  
  const words = plainText.split(/\s+/).filter(word => word.length > 0);
  return words.length;
}

/**
 * Generates an excerpt from HTML content
 * @param htmlContent - The HTML content to generate excerpt from
 * @param maxWords - Maximum number of words in excerpt (default: 50)
 * @returns The generated excerpt
 */
export function generateExcerpt(htmlContent: string, maxWords: number = 50): string {
  const plainText = extractPlainText(htmlContent);
  if (!plainText) return '';
  
  const words = plainText.split(/\s+/).filter(word => word.length > 0);
  
  if (words.length <= maxWords) {
    return plainText;
  }
  
  const excerpt = words.slice(0, maxWords).join(' ');
  return excerpt + '...';
}

/**
 * Counts characters in plain text (excluding whitespace)
 */
export function countCharacters(htmlContent: string): number {
  const plainText = extractPlainText(htmlContent);
  return plainText.replace(/\s/g, '').length;
}

/**
 * Sanitizes text for use in URLs (slugs)
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generates a summary of key statistics about the content
 */
export interface ContentStats {
  wordCount: number;
  characterCount: number;
  characterCountWithoutSpaces: number;
  readingTimeMinutes: number;
  excerptPreview: string;
}

export function generateContentStats(htmlContent: string, excerptWords: number = 50): ContentStats {
  const plainText = extractPlainText(htmlContent);
  const wordCount = countWords(htmlContent);
  const characterCount = plainText.length;
  const characterCountWithoutSpaces = plainText.replace(/\s/g, '').length;
  
  // Assuming average reading speed of 200 words per minute
  const readingTimeMinutes = Math.ceil(wordCount / 200);
  
  const excerptPreview = generateExcerpt(htmlContent, excerptWords);
  
  return {
    wordCount,
    characterCount,
    characterCountWithoutSpaces,
    readingTimeMinutes,
    excerptPreview,
  };
}
