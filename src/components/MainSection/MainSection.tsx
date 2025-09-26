'use client'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from '@/i18n/routing'
import AnalyticsWrapper from '@/components/AnalyticsWrapper/AnalyticsWrapper'
import { 
  ArrowRightIcon,
  CheckCircleIcon,
  StarIcon,
  PhoneIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  PresentationChartLineIcon,
  CubeIcon,
  WrenchScrewdriverIcon,
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'

export default function MainSection() {
  const t = useTranslations('Main')

  // Obrázky pro carousel
  const heroImages = [
    '/hero-building.jpg',
    '/hero-building2.jpg',
    '/hero-building3.jpg',
  ]

  // Aktivní index pro přepínání
  const [activeIndex, setActiveIndex] = useState(0)

  // Automatické přepínání každých 6s
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroImages.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [heroImages.length])

  return (
    <main className="min-h-screen">
      <AnalyticsWrapper />
      
      {/* Hero sekce - Impresivní úvodní část */}
      <section className="relative h-screen overflow-hidden">
        {heroImages.map((src, i) => (
          <div
            key={i}
            className={`
              absolute inset-0 transition-opacity duration-2000 ease-in-out
              ${i === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}
            `}
          >
            <Image
              src={src}
              alt={`Profesionální projekty ${i + 1}`}
              fill
              className="object-cover"
              priority={i === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-800/70 to-black/60" />
          </div>
        ))}

        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="max-w-6xl mx-auto px-4 text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="mb-6"
            >
              <span className="inline-block px-6 py-3 bg-blue-600/90 backdrop-blur-sm text-white text-lg font-semibold rounded-full">
                {t('hero.badge')}
              </span>
            </motion.div>
            
            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1 }}
            >
              {t('hero.title')}
            </motion.h1>
            
            <motion.p
              className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed text-blue-50"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
            >
              {t('hero.subtitle')}
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1 }}
            >
              <Link
                href="/kontakt"
                className="group relative inline-flex items-center justify-center px-10 py-5 bg-white text-blue-900 font-bold text-lg rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 hover:scale-105"
              >
                <PhoneIcon className="w-6 h-6 mr-3" />
                {t('hero.primaryCta')}
                <ArrowRightIcon className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="/sluzby"
                className="inline-flex items-center justify-center px-10 py-5 border-2 border-white text-white font-semibold text-lg rounded-xl hover:bg-white hover:text-blue-900 transition-all duration-300"
              >
                {t('hero.secondaryCta')}
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              className="mt-16 flex flex-wrap justify-center gap-8 text-blue-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              {t.raw('hero.trustIndicators').map((indicator: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-6 h-6 text-green-400" />
                  <span className="text-lg font-medium">{indicator}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </motion.div>
      </section>

      {/* Statistiky - Důvěryhodnost */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {t.raw('stats').map((stat: any, index: number) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="text-4xl lg:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Služby - Profesionální prezentace */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {t('services.title')}
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t('services.subtitle')}
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {t.raw('services.items').map((service: any, index: number) => {
              const icons = [
                BuildingOfficeIcon,
                PresentationChartLineIcon,
                ClipboardDocumentListIcon,
                CubeIcon,
                WrenchScrewdriverIcon,
                ChatBubbleLeftRightIcon
              ];
              const IconComponent = icons[index] || BuildingOfficeIcon;
              
              return (
                <motion.div
                  key={index}
                  className="group bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <IconComponent className="w-8 h-8 text-blue-600 dark:text-blue-400 group-hover:text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:text-blue-700 transition-colors">
                    <span>{t('services.learnMore')}</span>
                    <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/sluzby"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-bold text-lg rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {t('services.viewAll')}
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Proč si vybrat nás */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              className="text-4xl lg:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {t('whyChooseUs.title')}
            </motion.h2>
            <motion.p
              className="text-xl text-blue-100 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t('whyChooseUs.subtitle')}
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.raw('whyChooseUs.reasons').map((reason: any, index: number) => (
              <motion.div
                key={index}
                className="text-center p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <StarIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">{reason.title}</h3>
                <p className="text-blue-100 leading-relaxed">{reason.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reference preview */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {t('references.title')}
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t('references.subtitle')}
            </motion.p>
          </div>
          
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link 
              href="/references"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-bold text-lg rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {t('references.viewAll')}
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Finální CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              {t('finalCta.title')}
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              {t('finalCta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/kontakt"
                className="inline-flex items-center justify-center px-10 py-5 bg-white text-blue-900 font-bold text-lg rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105"
              >
                <PhoneIcon className="w-6 h-6 mr-3" />
                {t('finalCta.primaryButton')}
              </Link>
              <Link
                href="/kontakt"
                className="inline-flex items-center justify-center px-10 py-5 border-2 border-white text-white font-semibold text-lg rounded-xl hover:bg-white hover:text-blue-900 transition-all duration-300"
              >
                <EnvelopeIcon className="w-6 h-6 mr-3" />
                {t('finalCta.secondaryButton')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
