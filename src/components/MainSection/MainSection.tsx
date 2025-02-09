'use client'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'

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
            <div className="absolute inset-0 bg-gray-900/60" />
          </div>
        ))}

        {/* Text ve vlastní vrstvě, aby nebyl průhledný při animaci */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center text-white p-4">
            <h1 className="text-5xl font-bold mb-6">{t('title')}</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">{t('subtitle')}</p>
            <button className="bg-white text-gray-900 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-500 transition">
              {t('contactUs')}
            </button>
          </div>
        </div>
      </div>

      {/* Služby jako "kartičky" */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t('ourServices')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 rounded-lg shadow-lg border border-gray-200">
              <h3 className="text-xl font-semibold mb-4">{t('service1.title')}</h3>
              <p>{t('service1.description')}</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg shadow-lg border border-gray-200">
              <h3 className="text-xl font-semibold mb-4">{t('service2.title')}</h3>
              <p>{t('service2.description')}</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg shadow-lg border border-gray-200">
              <h3 className="text-xl font-semibold mb-4">{t('service3.title')}</h3>
              <p>{t('service3.description')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
