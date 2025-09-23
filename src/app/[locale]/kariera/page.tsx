'use client';
import { useTranslations } from 'next-intl';
import { MapPin, Clock } from 'lucide-react';
import { Briefcase, Globe, Building2 } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Head from 'next/head';

export default function CareerPage() {
  const t = useTranslations('Career');

  const jobs = [
    {
      id: 1,
      title: t('jobs.job1.title'),
      location: t('jobs.job1.location'),
      type: t('jobs.job1.type'),
      description: t('jobs.job1.description'),
    },
    {
      id: 2,
      title: t('jobs.job2.title'),
      location: t('jobs.job2.location'),
      type: t('jobs.job2.type'),
      description: t('jobs.job2.description'),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 transition-colors">
      <Head>
        <title>Kariéra | Maxprojekty</title>
        <meta name="description" content="Připojte se k našemu týmu Maxprojekty. Aktuální nabídka pracovních pozic, benefity a moderní pracovní prostředí." />
        <meta property="og:title" content="Kariéra | Maxprojekty" />
        <meta property="og:description" content="Připojte se k našemu týmu Maxprojekty. Aktuální nabídka pracovních pozic, benefity a moderní pracovní prostředí." />
      </Head>
      {/* Hero sekce */}
      <header className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {t('hero.title')}
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl mb-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {t('hero.subtitle')}
          </motion.p>
          <motion.a
            href="/kontakt"
            className="inline-block bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-900"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.97 }}
          >
            {t('hero.contactUs')}
          </motion.a>
        </div>
      </header>

      {/* Sekce s výhodami */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">{t('benefits.title')}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[{
            icon: <Briefcase className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />,
            title: t('benefits.flexibility.title'),
            desc: t('benefits.flexibility.description'),
          }, {
            icon: <Globe className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />,
            title: t('benefits.projects.title'),
            desc: t('benefits.projects.description'),
          }, {
            icon: <Building2 className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />,
            title: t('benefits.office.title'),
            desc: t('benefits.office.description'),
          }].map((b, i) => (
            <motion.div
              key={i}
              className="p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
            >
              {b.icon}
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{b.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Sekce s volnými pozicemi */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">{t('jobs.title')}</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job, idx) => (
            <motion.div
              key={job.id}
              className="bg-white dark:bg-zinc-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: idx * 0.1 }}
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{job.title}</h3>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-3">
                <MapPin className="w-5 h-5" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-4">
                <Clock className="w-5 h-5" />
                <span>{job.type}</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300">{job.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
