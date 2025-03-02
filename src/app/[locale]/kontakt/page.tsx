'use client';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';

const FormSchema = z.object({
  name: z.string()
    .min(2, { message: 'Jméno musí mít alespoň 2 znaky' })
    .regex(/^[a-zA-Zá-žÁ-Ž ]+$/, { message: 'Použijte platné znaky' }),
  email: z.string()
    .email({ message: 'Neplatný emailový formát' })
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: 'Neplatná emailová adresa' }),
  message: z.string()
    .min(10, { message: 'Zpráva musí mít alespoň 10 znaků' })
    .max(500, { message: 'Maximální délka zprávy je 500 znaků' }),
  website: z.string().max(0) // Honeypot
});

type FormData = z.infer<typeof FormSchema>;

export default function ContactPage() {
  const t = useTranslations('Contact');
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting }, 
    reset 
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema)
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      if (data.website) throw new Error('Spam detected');
      
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error('Odesílání selhalo');
      
      toast.success('Zpráva úspěšně odeslána!');
      reset();
    } catch (error) {
      toast.error('Chyba při odesílání zprávy');
    }
  };

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
          {/* Levý sloupec - kontaktní informace */}
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

          {/* Pravý sloupec - formulář */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white p-12 rounded-2xl shadow-xl space-y-6 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-10 pointer-events-none"></div>

              {/* Honeypot field */}
              <div className="hidden">
                <label htmlFor="website">Web</label>
                <input {...register('website')} type="text" id="website" />
              </div>

              <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
                {t('form.title')}
              </h2>

              <div>
                <label htmlFor="name" className="block text-base font-semibold text-gray-700 mb-2">
                  {t('form.name')}
                </label>
                <input
                  {...register('name')}
                  className={`w-full px-4 py-3 rounded-lg border text-white ${
                    errors.name ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                  } shadow-md text-lg`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-base font-semibold text-gray-700 mb-2">
                  {t('form.email')}
                </label>
                <input
                  {...register('email')}
                  className={`w-full px-4 py-3 rounded-lg border text-white ${
                    errors.email ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                  } shadow-md text-lg`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-base font-semibold text-gray-700 mb-2">
                  {t('form.message')}
                </label>
                <textarea
                  {...register('message')}
                  rows={5}
                  className={`w-full px-4 py-3 rounded-lg border text-white ${
                    errors.message ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                  } shadow-md text-lg`}
                ></textarea>
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-lg font-semibold shadow-lg transition-all ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                }`}
              >
                {isSubmitting ? 'Odesílání...' : t('form.submit')}
              </button>
            </form>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
