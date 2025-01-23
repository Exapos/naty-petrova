// src/app/[locale]/o-nas/page.tsx
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import '@/app/[locale]/globals.css'

export default function AboutPage() {
  const t = useTranslations('About')
  
  return (
    <div className="pt-20">
      {/* Hero sekce */}
      <div className="relative h-[40vh] bg-gray-900">
        <Image
          src="/images/office.jpg"
          alt="Naše kancelář"
          fill
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white">{t('title')}</h1>
        </div>
      </div>

      {/* O nás obsah */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">{t('history.title')}</h2>
            <p className="text-gray-600 mb-4">{t('history.description')}</p>
          </div>
          <div className="relative h-[400px]">
            <Image
              src="/images/team.jpg"
              alt="Náš tým"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Hodnoty */}
        <div className="grid md:grid-cols-3 gap-8 my-16">
          <div className="bg-gray-50 p-8 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">{t('values.quality.title')}</h3>
            <p className="text-gray-600">{t('values.quality.description')}</p>
          </div>
          <div className="bg-gray-50 p-8 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">{t('values.innovation.title')}</h3>
            <p className="text-gray-600">{t('values.innovation.description')}</p>
          </div>
          <div className="bg-gray-50 p-8 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">{t('values.responsibility.title')}</h3>
            <p className="text-gray-600">{t('values.responsibility.description')}</p>
          </div>
        </div>

        {/* Tým */}
        <div className="my-16">
          <h2 className="text-3xl font-bold text-center mb-12">{t('team.title')}</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((member) => (
              <div key={member} className="text-center">
                <div className="relative h-[300px] mb-4">
                  <Image
                    src={`/images/team-member-${member}.jpg`}
                    alt={t(`team.member${member}.name`)}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <h3 className="font-semibold">{t(`team.member${member}.name`)}</h3>
                <p className="text-gray-600">{t(`team.member${member}.position`)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
