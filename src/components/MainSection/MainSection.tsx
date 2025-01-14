// src/components/MainSection/MainSection.tsx
import Image from 'next/image'
import { useTranslations } from 'next-intl'

export default function MainSection() {
  const t = useTranslations('Main')
  
  return (
    <section className="min-h-screen">
      {/* Hero sekce */}
      <div className="relative h-[80vh] bg-gray-900">
        <Image
          src="/images/hero-building.jpg"
          alt="Modern architecture"
          fill
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white p-4">
            <h1 className="text-5xl font-bold mb-6">{t('title')}</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">{t('subtitle')}</p>
            <button className="bg-white text-gray-900 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition">
              {t('contactUs')}
            </button>
          </div>
        </div>
      </div>

      {/* Služby přehled */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t('ourServices')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">{t('service1.title')}</h3>
              <p>{t('service1.description')}</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">{t('service2.title')}</h3>
              <p>{t('service2.description')}</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">{t('service3.title')}</h3>
              <p>{t('service3.description')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
