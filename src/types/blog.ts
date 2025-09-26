export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  categories?: string; // JSON string or comma-separated
  tags?: string; // Legacy support for keywords
  published: boolean;
  editorMode?: 'markdown' | 'wysiwyg';
  readingTime?: number; // Auto-calculated reading time in minutes
  viewsCount?: number; // Track article views
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  author?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface BlogPostFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  published: boolean;
}

export type EditorMode = 'markdown' | 'wysiwyg';

export interface EditorState {
  mode: EditorMode;
  content: string;
  isDarkMode: boolean;
  isAutoSaving: boolean;
  lastSaved: Date | null;
}
