// src/app/[locale]/o-nas/page.tsx
'use client';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Head from 'next/head';
import Image from 'next/image';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

export default function AboutPage() {
  const t = useTranslations('About');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 transition-colors">
      <Head>
        <title>{t('meta.title')}</title>
        <meta name="description" content={t('meta.description')} />
        <meta property="og:title" content={t('meta.title')} />
        <meta property="og:description" content={t('meta.description')} />
      </Head>
      {/* Hero sekce */}
      <section className="relative min-h-[40vh] flex items-center justify-center bg-gradient-to-r from-blue-800 to-indigo-900">
        <div className="absolute inset-0">
          <Image src="/hero-building2.jpg" alt="Hero" fill priority className="object-cover opacity-40" />
        </div>
        <div className="relative z-10 w-full px-4 text-center flex flex-col items-center justify-center">
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {t('title')}
          </motion.h1>
          <motion.p
            className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {t('subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Historie a vize */}
      <section className="max-w-5xl mx-auto py-12 px-4 flex flex-col md:flex-row gap-10 md:gap-12 items-center">
        <motion.div
          className="w-full md:w-1/2"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 dark:text-white">{t('history.title')}</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{t('history.text')}</p>
          <h3 className="text-xl sm:text-2xl font-semibold mt-8 mb-2 text-blue-700 dark:text-blue-400">{t('vision.title')}</h3>
          <p className="text-gray-700 dark:text-gray-300">{t('vision.text')}</p>
        </motion.div>
        <motion.div
          className="w-full md:w-1/2"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <div className="aspect-w-3 aspect-h-2 w-full max-w-md mx-auto">
            <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-xl shadow-lg flex items-center justify-center">
              <div className="text-center text-blue-600 dark:text-blue-300">
                <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
                </svg>
                <p className="text-sm font-medium">Tým Maxprojekty</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Hodnoty */}
      <section className="max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">{t('values.title')}</h2>
        <div className="flex flex-col md:flex-row gap-8">
          {[1,2,3].map((idx) => (
            <motion.div
              key={idx}
              className="flex-1 p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-md border border-gray-200 dark:border-zinc-700 text-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: idx * 0.15 }}
            >
              <h3 className="text-lg sm:text-xl font-semibold mb-3 text-blue-700 dark:text-blue-400">{t(`values.value${idx}.title`)}</h3>
              <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg">{t(`values.value${idx}.text`)}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mise */}
      <section className="max-w-4xl mx-auto py-16 px-4">
        <motion.h2
          className="text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          {t('mission.title')}
        </motion.h2>
        <motion.p
          className="text-xl text-gray-700 dark:text-gray-300 text-center max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          {t('mission.text')}
        </motion.p>
      </section>

      {/* Timeline */}
      <section className="max-w-5xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">{t('timeline.title')}</h2>
        <VerticalTimeline lineColor="#60a5fa">
          {t.raw('timeline.events').map((event) => (
            <VerticalTimelineElement
              key={event.year}
              date={event.year}
              iconStyle={{ background: '#60a5fa', color: '#fff', boxShadow: '0 0 0 4px #fff, 0 0 0 8px #60a5fa' }}
              contentStyle={{ background: 'var(--tw-bg-opacity,1) #fff', color: 'var(--tw-text-opacity,1) #222', borderRadius: '0.75rem', boxShadow: '0 2px 16px 0 rgba(30,41,59,0.10)', border: '1px solid #e0e7ef' }}
              contentArrowStyle={{ borderRight: '7px solid #fff' }}
            >
              <span className="text-gray-800 dark:text-gray-100">{event.text}</span>
            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>
      </section>

      {/* Reference / Klienti */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">{t('references.title')}</h2>
        <div className="flex flex-wrap justify-center gap-8 mb-8">
          {t.raw('references.logos').map((logo, idx) => (
            <motion.div
              key={logo}
              className="h-16 w-24 bg-white dark:bg-zinc-100 rounded shadow p-2 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className="text-gray-400 dark:text-gray-600 font-bold text-xs text-center">
                LOGO {idx + 1}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {t.raw('references.quotes').map((q, idx) => (
            <motion.blockquote
              key={q.author}
              className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-8 border-l-4 border-blue-600 dark:border-blue-400"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: idx * 0.1 }}
            >
              <p className="text-lg text-gray-700 dark:text-gray-200 italic mb-4">“{q.text}”</p>
              <footer className="text-right text-blue-700 dark:text-blue-400 font-semibold">{q.author}</footer>
            </motion.blockquote>
          ))}
        </div>
      </section>

      {/* Certifikace a ocenění */}
      <section className="max-w-5xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">{t('certificates.title')}</h2>
        <ul className="flex flex-wrap justify-center gap-6">
          {t.raw('certificates.list').map((cert, idx) => (
            <motion.li
              key={cert}
              className="flex flex-col items-center bg-white dark:bg-zinc-800 rounded-lg shadow px-6 py-3 text-lg font-semibold text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-zinc-700"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              {/* Pokud existuje obrázek certifikátu, zobraz jej */}
              <Image
                src={`/certificates/cert${idx + 1}.png`}
                alt={cert}
                width={48}
                height={48}
                className="h-12 mb-2 object-contain"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
              {cert}
            </motion.li>
          ))}
        </ul>
      </section>

      {/* Technologie a postupy */}
      <section className="max-w-5xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">{t('technologies.title')}</h2>
        <ul className="flex flex-wrap justify-center gap-6">
          {t.raw('technologies.list').map((tech, idx) => (
            <motion.li
              key={tech}
              className="bg-white dark:bg-zinc-800 rounded-lg shadow px-6 py-3 text-lg text-gray-800 dark:text-gray-200 border border-blue-100 dark:border-zinc-700"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              {tech}
            </motion.li>
          ))}
        </ul>
      </section>

      {/* Tým s bio */}
      <section className="max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">{t('team.title')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {[1,2,3,4].map((idx) => (
            <motion.div
              key={idx}
              className="text-center group hover:scale-105 transition-transform duration-300"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: idx * 0.1 }}
            >
              <div className="relative w-full aspect-[3/4] mb-4 mx-auto max-w-xs">
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-700 dark:to-zinc-800 rounded-lg flex items-center justify-center group-hover:shadow-2xl group-hover:ring-4 group-hover:ring-blue-200 dark:group-hover:ring-blue-400 transition-all duration-300">
                  <div className="text-gray-400 dark:text-gray-500 text-center">
                    <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                    </svg>
                    <p className="text-xs font-medium">{t(`team.member${idx}.name`)}</p>
                  </div>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{t(`team.member${idx}.name`)}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t(`team.member${idx}.position`)}</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">{t(`team.member${idx}.bio`)}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto py-16 px-4 text-center">
        <motion.h2
          className="text-3xl font-bold mb-6 text-gray-900 dark:text-white"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          {t('cta.title')}
        </motion.h2>
        <motion.p
          className="text-lg text-gray-700 dark:text-gray-300 mb-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          {t('cta.text')}
        </motion.p>
        <motion.a
          href="/kariera"
          className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg font-semibold shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-900"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          {t('cta.button')}
        </motion.a>
      </section>
    </div>
  );
}
