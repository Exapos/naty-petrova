import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Maxprojekty | Blog',
  description: 'Články a novinky ze světa architektury a designu',
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}