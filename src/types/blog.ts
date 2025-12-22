export interface BlogBlockSubItem {
  id: string;
  type: string;
  content: any;
  styles?: any;
}

export interface BlogBlock {
  id: string;
  type: string;
  layout?: string;
  content: any;
  subBlocks?: BlogBlockSubItem[];
  styles?: any;
  responsive?: any;
}

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
  editorMode?: 'markdown' | 'wysiwyg' | 'block';
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
  blocks?: BlogBlock[]; // Parsed block data for block editor mode
  globalStyles?: any;
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
