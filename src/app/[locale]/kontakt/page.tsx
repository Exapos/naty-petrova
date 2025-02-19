'use client';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  const t = useTranslations('Contact');

  return (
    <div className="relative min-h-screen bg-gray-50 overflow-hidden">
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

      <div className="relative z-10 max-w-7xl mx-auto py-20 px-6 lg:px-8">
        <motion.header
          className="text-center text-white"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold mb-4">{t('hero.title')}</h1>
          <p className="text-lg">{t('hero.subtitle')}</p>
        </motion.header>

        <section className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            className="space-y-8 bg-white p-8 rounded-xl shadow-lg grid"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center space-x-4">
              <MapPin className="w-12 h-12 text-blue-600" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{t('contact.address.title')}</h3>
                <p className="text-gray-600">{t('contact.address.description')}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Mail className="w-12 h-12 text-blue-600" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{t('contact.email.title')}</h3>
                <p className="text-gray-600">{t('contact.email.description')}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Phone className="w-12 h-12 text-blue-600" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{t('contact.phone.title')}</h3>
                <p className="text-gray-600">{t('contact.phone.description')}</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800">{t('additionalInfo.billing.title')}</h3>
              {t.raw('additionalInfo.billing.details').map((detail, index) => (
                <p key={index} className="text-gray-600">{detail}</p>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <form
              action="#"
              method="POST"
              className="bg-white p-12 rounded-2xl shadow-xl space-y-8 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-10 pointer-events-none"></div>
          
              <h2 className="text-3xl font-bold text-gray-800 text-center">
                {t('form.title')}
              </h2>
          
              <div>
                <label htmlFor="name" className="block text-base font-semibold text-gray-700">
                  {t('form.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="mt-2 block w-full rounded-lg border-gray-300 shadow-md focus:border-blue-500 focus:ring-blue-500 placeholder-gray-500 text-white px-4 py-3 text-lg"
                />
              </div>
          
              <div>
                <label htmlFor="email" className="block text-base font-semibold text-gray-700">
                  {t('form.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="mt-2 block w-full rounded-lg border-gray-300 shadow-md focus:border-blue-500 focus:ring-blue-500 placeholder-gray-500 text-white px-4 py-3 text-lg"
                />
              </div>
          
              <div>
                <label htmlFor="message" className="block text-base font-semibold text-gray-700">
                  {t('form.message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="mt-2 block w-full rounded-lg border-gray-300 shadow-md focus:border-blue-500 focus:ring-blue-500 placeholder-gray-500 text-white px-4 py-3 text-lg"
                ></textarea>
              </div>
          
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-4 rounded-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-[1.03]"
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
