'use client';
import { useTranslations } from 'next-intl';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  Clock, 
  Briefcase, 
  Globe, 
  Building2, 
  Users,
  TrendingUp,
  Award,
  Eye
} from 'lucide-react';
import { motion } from 'framer-motion';
import { JobPosition } from '@/types/career';

export default function CareerPage() {
  const t = useTranslations('Career');
  const [positions, setPositions] = useState<JobPosition[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPositions = useCallback(async () => {
    try {
      const response = await fetch(`/api/jobs?includeInactive=false`);
      const data = await response.json();
      setPositions(data.positions || []);
    } catch (error) {
      console.error('Error fetching positions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPositions();
  }, [fetchPositions]);

  const getJobTypeLabel = (type: string) => {
    const labels = {
      FULL_TIME: t('jobType.FULL_TIME'),
      PART_TIME: t('jobType.PART_TIME'),
      CONTRACT: t('jobType.CONTRACT'),
      INTERNSHIP: t('jobType.INTERNSHIP')
    } as const;
    return labels[type as keyof typeof labels] ?? type;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 transition-colors duration-300">
      {/* Hero sekce */}
      <header className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {t('hero.title')}
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl mb-10 text-blue-100 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {t('hero.subtitle')}
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <Link
              href="/kontakt"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-900 font-semibold rounded-full hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Users className="w-5 h-5 mr-2" />
              {t('hero.contactUs')}
            </Link>
          </motion.div>
        </div>
      </header>

      {/* Statistiky */}
      <section className="relative -mt-12 mb-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <TrendingUp className="w-8 h-8" />, number: t('stats.completed.number'), label: t('stats.completed.label') },
              { icon: <Users className="w-8 h-8" />, number: t('stats.team.number'), label: t('stats.team.label') },
              { icon: <Award className="w-8 h-8" />, number: t('stats.years.number'), label: t('stats.years.label') }
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="bg-white dark:bg-zinc-800 rounded-2xl p-8 text-center shadow-lg border border-gray-200 dark:border-zinc-700"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <div className="text-blue-600 dark:text-blue-400 mb-4 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sekce s výhodami */}
      <section className="max-w-7xl mx-auto py-20 px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            {t('benefits.title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('benefits.intro')}
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[{
            icon: <Briefcase className="w-12 h-12 text-blue-600 dark:text-blue-400" />,
            title: t('benefits.flexibility.title'),
            desc: t('benefits.flexibility.description'),
            gradient: "from-blue-500 to-cyan-500"
          }, {
            icon: <Globe className="w-12 h-12 text-green-600 dark:text-green-400" />,
            title: t('benefits.projects.title'),
            desc: t('benefits.projects.description'),
            gradient: "from-green-500 to-emerald-500"
          }, {
            icon: <Building2 className="w-12 h-12 text-purple-600 dark:text-purple-400" />,
            title: t('benefits.office.title'),
            desc: t('benefits.office.description'),
            gradient: "from-purple-500 to-pink-500"
          }].map((benefit, i) => (
            <motion.div
              key={i}
              className="group relative bg-white dark:bg-zinc-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-600"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              whileHover={{ y: -5 }}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${benefit.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
              <div className="relative">
                <div className="mb-6 flex justify-center">
                  <div className="p-3 bg-gray-100 dark:bg-zinc-700 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    {benefit.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white text-center">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Sekce s volnými pozicemi */}
      <section className="bg-white dark:bg-zinc-800 py-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t('jobs.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {t('jobs.subtitle')}
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : positions.length === 0 ? (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Briefcase className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('jobs.empty.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
                {t('jobs.empty.text')}
              </p>
              <Link
                href="/kontakt"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300"
              >
                {t('hero.contactUs')}
              </Link>
            </motion.div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {positions.map((position, idx) => (
                <motion.div
                  key={position.id}
                  className="group bg-gray-50 dark:bg-zinc-700 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-zinc-600 hover:border-blue-300 dark:hover:border-blue-600"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7, delay: idx * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {position.title}
                      </h3>
                      <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300 mb-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{position.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{getJobTypeLabel(position.type)}</span>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full">
                          {position.department}
                        </span>
                      </div>
                      
                      <p className="text-gray-700 dark:text-gray-300 mb-6 line-clamp-3">
                        {position.shortDescription}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Link
                      href={`/kariera/${position.slug}`}
                      className="w-full inline-flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 group-hover:shadow-lg"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {t('jobs.viewDetail')}
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-white"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t('cta.title')}
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              {t('cta.text')}
            </p>
            <Link
              href="/kontakt"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-full hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {t('hero.contactUs')}
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
