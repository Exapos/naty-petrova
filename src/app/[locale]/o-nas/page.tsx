// src/app/[locale]/o-nas/page.tsx
'use client';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Head from 'next/head';
import Image from 'next/image';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import '@/app/[locale]/globals.css'

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
      <section className="relative h-[50vh] flex items-center justify-center bg-gradient-to-r from-blue-800 to-indigo-900">
        <Image src="/hero-building2.jpg" alt="Hero" fill className="object-cover opacity-40" />
        <div className="relative z-10 text-center">
          <motion.h1
            className="text-5xl font-bold text-white mb-4 drop-shadow-lg"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {t('title')}
          </motion.h1>
          <motion.p
            className="text-xl text-white/90 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {t('subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Historie a vize */}
      <section className="max-w-5xl mx-auto py-16 px-4 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">{t('history.title')}</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{t('history.text')}</p>
          <h3 className="text-2xl font-semibold mt-8 mb-2 text-blue-700 dark:text-blue-400">{t('vision.title')}</h3>
          <p className="text-gray-700 dark:text-gray-300">{t('vision.text')}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <Image src="/images/team.jpg" alt="Tým Maxprojekty" width={600} height={400} className="rounded-xl shadow-lg object-cover" />
        </motion.div>
      </section>

      {/* Hodnoty */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">{t('values.title')}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[1,2,3].map((idx) => (
            <motion.div
              key={idx}
              className="p-8 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-700 text-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: idx * 0.15 }}
            >
              <h3 className="text-xl font-semibold mb-4 text-blue-700 dark:text-blue-400">{t(`values.value${idx}.title`)}</h3>
              <p className="text-gray-700 dark:text-gray-300">{t(`values.value${idx}.text`)}</p>
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
          {t.raw('timeline.events').map((event, idx) => (
            <VerticalTimelineElement
              key={event.year}
              date={<span className="text-blue-700 dark:text-blue-200 bg-white dark:bg-zinc-900 rounded-full border-2 border-blue-400 dark:border-blue-400 shadow font-extrabold text-xl px-6 py-2 inline-block">{event.year}</span>}
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
            <motion.img
              key={logo}
              src={`/logos/${logo}`}
              alt={`Logo klienta ${idx + 1}`}
              className="h-16 object-contain grayscale hover:grayscale-0 transition-all duration-300 bg-white rounded shadow p-2"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            />
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
              <img
                src={`/certificates/cert${idx + 1}.png`}
                alt={cert}
                className="h-12 mb-2 object-contain"
                onError={e => (e.currentTarget.style.display = 'none')}
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
      <section className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">{t('team.title')}</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[1,2,3,4].map((idx) => (
            <motion.div
              key={idx}
              className="text-center group hover:scale-105 transition-transform duration-300"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: idx * 0.1 }}
            >
              <div className="relative h-[260px] mb-4">
                <Image
                  src={`/images/team-member-${idx}.jpg`}
                  alt={t(`team.member${idx}.name`)}
                  fill
                  className="object-cover rounded-lg group-hover:shadow-2xl group-hover:ring-4 group-hover:ring-blue-200 dark:group-hover:ring-blue-400 transition-all duration-300"
                />
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
