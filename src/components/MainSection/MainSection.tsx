'use client'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from '@/i18n/routing'

export default function MainSection() {
  const t = useTranslations('Main')

  // Obrázky pro carousel
  const heroImages = [
    '/hero-building.jpg',
    '/hero-building2.jpg',
    '/hero-building3.jpg',
    '/hero-building4.jpg',
  ]

  // Aktivní index pro přepínání
  const [activeIndex, setActiveIndex] = useState(0)

  // Automatické přepínání každých 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [heroImages.length])

  return (
    <section className="min-h-screen">
      {/* Hero s plynulou animací */}
      <div className="relative h-[80vh] overflow-hidden">
        {heroImages.map((src, i) => (
          <div
            key={i}
            className={`
              absolute inset-0 transition-opacity duration-1000 ease-in-out
              ${i === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}
            `}
          >
            <Image
              src={src}
              alt={`Slide ${i}`}
              fill
              className="object-cover"
            />
            {/* Překryv pro ztmavení pozadí, aby text zůstal čitelný */}
            <div className="absolute inset-0 bg-gray-900/60 dark:bg-black/70" />
          </div>
        ))}

        {/* Text ve vlastní vrstvě, aby nebyl průhledný při animaci */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center text-white p-4">
            <motion.h1
              className="text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {t('title')}
            </motion.h1>
            <motion.p
              className="text-xl mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              {t('subtitle')}
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.08, backgroundColor: '#2563eb', color: '#fff' }}
              whileTap={{ scale: 0.97 }}
              className="bg-white text-gray-900 px-8 py-3 rounded-lg text-lg font-semibold shadow-lg hover:bg-blue-500 hover:text-white transition"
            >
              {t('contactUs')}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Služby jako "kartičky" s animací při scrollování */}
      <div className="py-20 bg-white dark:bg-zinc-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">{t('ourServices')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1,2,3].map((idx) => (
              <motion.div
                key={idx}
                className="p-6 bg-gray-50 dark:bg-zinc-800 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-700"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: idx * 0.15 }}
              >
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t(`service${idx}.title`)}</h3>
                <p className="text-gray-700 dark:text-gray-300">{t(`service${idx}.description`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Reference sekce */}
      <div className="py-20 bg-gray-50 dark:bg-zinc-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Naše reference</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Podívejte se na některé z našich realizovaných projektů
            </p>
          </div>
          
          <div className="text-center">
            <Link 
              href="/references"
              className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-lg"
            >
              Zobrazit všechny reference
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
