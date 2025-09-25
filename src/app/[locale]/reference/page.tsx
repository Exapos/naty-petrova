'use client';
import { projects } from './projectsData';
import ClientProjects from '@/components/Projects/ClientProjects';
import { useTranslations } from 'next-intl';

// Metadata se musí přesunout do layout.tsx pro client komponenty

function buildJsonLd() {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'itemListElement': projects.map((p, i) => ({
      '@type': 'ListItem',
      'position': i + 1,
      'item': {
        '@type': 'Project',
        'name': p.title,
        'location': p.location,
        'additionalType': p.category
      }
    }))
  };
  return JSON.stringify(ld);
}

export default function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const t = useTranslations('Projects');
  
  // Unused params for now, but available if needed
  void params;

  return (
    <main className="py-20">
      <div className="max-w-5xl mx-auto px-4">
        <h1 id="references-title" className="text-3xl font-bold mb-4">{t('title')}</h1>
        <p className="text-zinc-700 dark:text-zinc-300 mb-8">{t('intro')}</p>
      </div>

      <ClientProjects projects={projects} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: buildJsonLd() }} />
    </main>
  );
}
