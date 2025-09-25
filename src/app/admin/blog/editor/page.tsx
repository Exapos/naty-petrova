import { Metadata } from 'next';
import BlogEditor from '@/components/BlogEditor/BlogEditor';

export const metadata: Metadata = {
  title: 'Blog Editor - Moderní editor článků',
  description: 'Pokročilý editor pro tvorbu blog článků s podporou Markdown a WYSIWYG režimu',
};

export default function BlogEditorPage() {
  return <BlogEditor />;
}