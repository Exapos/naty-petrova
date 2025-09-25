
'use client';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';

const icons = [
  // Dům
  <svg key="house" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="#2563eb" strokeWidth="1.5"><rect x="4" y="8" width="16" height="10" rx="2"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/></svg>,
  // Výkres
  <svg key="blueprint" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="#2563eb" strokeWidth="1.5"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h10M7 16h6"/></svg>,
  // Dokumentace
  <svg key="docs" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="#2563eb" strokeWidth="1.5"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 4v16M16 4v16"/></svg>,
  // 3D model
  <svg key="3d" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="#2563eb" strokeWidth="1.5"><circle cx="12" cy="12" r="8"/><path d="M8 12h8M12 8v8"/></svg>,
  // Rekonstrukce
  <svg key="recon" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="#2563eb" strokeWidth="1.5"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 12h16"/><path d="M12 4v16"/></svg>,
  // Poradenství
  <svg key="consult" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="#2563eb" strokeWidth="1.5"><path d="M12 20v-6m0 0V4m0 10H6m6 0h6"/></svg>,
];

export default function ServicesPage() {
  const t = useTranslations('Services');
  const blocks = t.raw('blocks');

  // Schema.org strukturovaná data
  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: t('heading'),
    provider: {
      '@type': 'Organization',
      name: 'Maxprojekty',
      url: 'https://maxprojekty.cz',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Služby Maxprojekty',
      itemListElement: blocks.map((s: any, i: number) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: s.title,
          description: s.desc,
        },
        position: i + 1,
      })),
    },
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900 transition-colors">
      {/* Hero sekce */}
      <section className="max-w-4xl mx-auto pt-16 pb-10 px-4 text-center">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold mb-6 text-blue-800 dark:text-blue-400 drop-shadow"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {t('heading')}
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-gray-700 dark:text-gray-200 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          {t('intro')}
        </motion.p>
      </section>

      {/* Grid služeb */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blocks.map((s: any, i: number) => (
            <motion.div
              key={i}
              className="flex flex-col items-center bg-white/90 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
            >
              <div className="mb-5 group-hover:scale-110 transition-transform duration-300">{icons[i]}</div>
              <h3 className="text-xl font-bold text-blue-700 dark:text-blue-400 mb-2 text-center">{s.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center text-base">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA sekce */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 text-white text-center">
        <motion.h2
          className="text-2xl md:text-3xl font-bold mb-4"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          {t('cta')}
        </motion.h2>
        <Link
          href="/kontakt"
          className="inline-block mt-6 bg-white text-blue-700 font-semibold px-8 py-4 rounded-lg text-lg shadow-lg hover:bg-blue-100 hover:text-blue-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-900"
        >
          {t('cta')}
        </Link>
      </section>

      {/* Strukturovaná data pro SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }} />
    </main>
  );
}
