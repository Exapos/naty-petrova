export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  published: boolean;
  editorMode?: 'markdown' | 'wysiwyg';
  createdAt: Date;
  updatedAt: Date;
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
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  published: boolean;
  editorMode: 'markdown' | 'wysiwyg';
}

export type EditorMode = 'markdown' | 'wysiwyg';

export interface EditorState {
  mode: EditorMode;
  content: string;
  isDarkMode: boolean;
  isAutoSaving: boolean;
  lastSaved: Date | null;
}
