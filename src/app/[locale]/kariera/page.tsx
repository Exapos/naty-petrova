'use client';
import { useTranslations } from 'next-intl';
import { MapPin, Clock } from 'lucide-react';
import { Briefcase, Globe, Building2 } from 'lucide-react';
import Link from 'next/link'

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
    <div className="min-h-screen bg-gray-50">
      {/* Hero sekce */}
      <header className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{t('hero.title')}</h1>
          <p className="text-xl md:text-2xl mb-8">{t('hero.subtitle')}</p>
          <Link href="/kontakt" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors">
            {t('hero.contactUs')}
          </Link>
        </div>
      </header>

      {/* Sekce s výhodami */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">{t('benefits.title')}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <Briefcase className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t('benefits.flexibility.title')}</h3>
            <p>{t('benefits.flexibility.description')}</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <Globe className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t('benefits.projects.title')}</h3>
            <p>{t('benefits.projects.description')}</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <Building2 className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t('benefits.office.title')}</h3>
            <p>{t('benefits.office.description')}</p>
          </div>
        </div>
      </section>

      {/* Sekce s volnými pozicemi */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">{t('jobs.title')}</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
              <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
              <div className="flex items-center gap-2 text-gray-600 mb-3">
                <MapPin className="w-5 h-5" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <Clock className="w-5 h-5" />
                <span>{job.type}</span>
              </div>
              <p>{job.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
