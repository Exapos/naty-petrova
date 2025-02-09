'use client';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  const t = useTranslations('Contact');

  return (
    <div className="relative min-h-screen bg-gray-50 overflow-hidden">
      {/* Animované pozadí */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-800 to-indigo-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <motion.div
          className="absolute inset-0 bg-[url('/hexagons.svg')] opacity-10"
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
        />
      </motion.div>

      {/* Obsah stránky */}
      <div className="relative z-10 max-w-7xl mx-auto py-20 px-6 lg:px-8">
        {/* Nadpis */}
        <motion.header
          className="text-center text-white"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold mb-4">{t('hero.title')}</h1>
          <p className="text-lg">{t('hero.subtitle')}</p>
        </motion.header>

        {/* Sekce se dvěma sloupci */}
        <section className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Levý sloupec - Informace */}
          <motion.div
            className="space-y-8 bg-white p-8 rounded-xl shadow-lg"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Adresa */}
            <div className="flex items-center space-x-4">
              <MapPin className="w-12 h-12 text-blue-600" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{t('contact.address.title')}</h3>
                <p className="text-gray-600">{t('contact.address.description')}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center space-x-4">
              <Mail className="w-12 h-12 text-blue-600" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{t('contact.email.title')}</h3>
                <p className="text-gray-600">{t('contact.email.description')}</p>
              </div>
            </div>

            {/* Telefon */}
            <div className="flex items-center space-x-4">
              <Phone className="w-12 h-12 text-blue-600" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{t('contact.phone.title')}</h3>
                <p className="text-gray-600">{t('contact.phone.description')}</p>
              </div>
            </div>

            {/* Fakturační údaje */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{t('additionalInfo.billing.title')}</h3>
              {t.raw('additionalInfo.billing.details').map((detail, index) => (
                <p key={index} className="text-gray-600">{detail}</p>
              ))}
            </div>
          </motion.div>

          {/* Pravý sloupec - Formulář */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Formulář */}
            <form
              action="#"
              method="POST"
              className="bg-white p-10 rounded-xl shadow-lg space-y-6 relative overflow-hidden"
            >
              {/* Dekorativní gradientní pozadí */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 opacity-10 pointer-events-none"></div>

              {/* Nadpis formuláře */}
              <h2 className="text-2xl font-bold text-gray-800 text-center">
                {t('form.title')}
              </h2>

              {/* Jméno */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  {t('form.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 placeholder-gray-400 text-gray-300"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  {t('form.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 placeholder-gray-400 text-gray-300"
                />
              </div>

              {/* Zpráva */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  {t('form.message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 placeholder-gray-400 text-gray-300"
                ></textarea>
              </div>

              {/* Odeslat */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue700 hover:to-indigo700 text-white px6 py3 rounded-lg font-semibold shadow-md transition-all duration300 transform hover-scale-[1.02]"
              >
                {t('form.submit')}
              </button>
            </form>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
