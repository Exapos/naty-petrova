
'use client';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import { 
  HomeIcon, 
  DocumentTextIcon, 
  ClipboardDocumentListIcon,
  CubeIcon,
  WrenchScrewdriverIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const modernIcons = [
  HomeIcon,
  DocumentTextIcon, 
  ClipboardDocumentListIcon,
  CubeIcon,
  WrenchScrewdriverIcon,
  ChatBubbleLeftRightIcon,
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
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 transition-colors">
      <Head>
        <title>{t('metaTitle')}</title>
        <meta name="description" content={t('metaDescription')} />
        <meta property="og:title" content={t('metaTitle')} />
        <meta property="og:description" content={t('metaDescription')} />
      </Head>
      {/* Hero sekce s profesionálním designem */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white pt-24 pb-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-6">
                <span className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-full">
                  {t('hero.badge')}
                </span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                {t('hero.title')}
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                {t('hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/kontakt"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-900 font-bold rounded-lg hover:bg-blue-50 transition-all duration-300 shadow-lg"
                >
                  {t('hero.primaryCta')}
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Link>
                <Link
                  href="/references"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-900 transition-all duration-300"
                >
                  {t('hero.secondaryCta')}
                </Link>
              </div>
            </motion.div>
            <motion.div
              className="hidden lg:block"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div className="space-y-4">
                    {t.raw('hero.trustIndicators').map((indicator: string, index: number) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        <span className="text-white">{indicator}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Služby - profesionální layout */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('servicesSection.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('servicesSection.subtitle')}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {blocks.map((s: any, i: number) => {
              const IconComponent = modernIcons[i] || modernIcons[0];
              return (
                <motion.div
                  key={i}
                  className="bg-white dark:bg-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                  <div className="p-8">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                          {s.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                          {s.desc}
                        </p>
                        <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer">
                          <span>{t('servicesSection.moreInfo')}</span>
                          <ArrowRightIcon className="w-4 h-4 ml-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Proč si vybrat nás */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('whyChooseUs.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {t('whyChooseUs.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.raw('whyChooseUs.stats').map((stat: any, index: number) => {
              const getIcon = (iconIndex: number) => {
                switch (iconIndex) {
                  case 0:
                    return <ClipboardDocumentListIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />;
                  case 1:
                    return (
                      <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    );
                  case 2:
                    return <ChatBubbleLeftRightIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />;
                  case 3:
                    return (
                      <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    );
                  default:
                    return <ClipboardDocumentListIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />;
                }
              };
              
              const bgColors = [
                'bg-blue-100 dark:bg-blue-900/30',
                'bg-green-100 dark:bg-green-900/30',
                'bg-purple-100 dark:bg-purple-900/30',
                'bg-orange-100 dark:bg-orange-900/30'
              ];
              
              return (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className={`w-16 h-16 ${bgColors[index]} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    {getIcon(index)}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{stat.number}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{stat.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Finální CTA */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              {t('finalCta.title')}
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              {t('finalCta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/kontakt"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-900 font-bold rounded-lg hover:bg-blue-50 transition-all duration-300 shadow-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {t('finalCta.callButton')}
              </Link>
              <Link
                href="/kontakt"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-900 transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {t('finalCta.emailButton')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Strukturovaná data pro SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }} />
    </div>
  );
}
