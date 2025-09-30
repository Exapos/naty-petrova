'use client';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Building2, 
  User, 
  MessageSquare, 
  Send,
  Navigation,
  Car,
  Train,
  Shield,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';

// Global type declarations
declare global {
  interface Window {
    fbq: any;
  }
}

const FormSchema = z.object({
  name: z.string()
    .min(2, { message: 'Jméno musí mít alespoň 2 znaky' })
    .regex(/^[a-zA-Zá-žÁ-Ž ]+$/, { message: 'Použijte platné znaky' }),
  email: z.string()
    .email({ message: 'Neplatný emailový formát' })
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: 'Neplatná emailová adresa' }),
  phone: z.string()
    .optional()
    .refine((val) => !val || /^(\+420\s?)?[0-9\s\-\(\)]{9,}$/.test(val), {
      message: 'Neplatné telefonní číslo'
    }),
  projectType: z.enum(['residential', 'apartment', 'commercial'], {
    required_error: 'Vyberte typ projektu'
  }),
  budget: z.enum(['under-1m', '1-3m', '3-5m', '5-10m', 'over-10m'], {
    required_error: 'Vyberte rozpočet'
  }),
  timeline: z.enum(['asap', '1-3months', '3-6months', '6-12months', 'flexible'], {
    required_error: 'Vyberte časový rámec'
  }),
  location: z.string()
    .min(2, { message: 'Zadejte lokalitu' })
    .max(100, { message: 'Maximální délka lokality je 100 znaků' }),
  message: z.string()
    .min(10, { message: 'Zpráva musí mít alespoň 10 znaků' })
    .max(1000, { message: 'Maximální délka zprávy je 1000 znaků' }),
  website: z.string().max(0) // Honeypot
});

type FormData = z.infer<typeof FormSchema>;

export default function ContactPage() {
  const t = useTranslations('Contact');
  const [mapLoaded, setMapLoaded] = useState(false);
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

      if (!response.ok) throw new Error('SEND_FAILED');
      
      // GA4 Conversion Tracking - Custom event for conversion setup
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'contact_form_submit', {
          event_category: 'conversion',
          event_label: 'contact_form'
        });
      }

      // Facebook Pixel Lead Event
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'Lead', {
          content_name: 'Contact Form',
          content_category: 'Contact'
        });
      }
      
      toast.success(t('form.success'));
      reset();
    } catch (error) {
      if ((error as Error).message === 'Spam detected') {
        toast.error(t('form.spamError'));
      } else {
        toast.error(t('form.error'));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('/hexagons.svg')] opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {t('hero.title')}
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl mb-12 text-blue-100 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {t('hero.subtitle')}
          </motion.p>
          
          <motion.div
            className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <Phone className="w-8 h-8 mx-auto mb-4 text-blue-200" />
              <h3 className="font-semibold mb-2">{t('contact.phone.title')}</h3>
              <p className="text-blue-200">{t('contact.phone.description')}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <Mail className="w-8 h-8 mx-auto mb-4 text-blue-200" />
              <h3 className="font-semibold mb-2">{t('contact.email.title')}</h3>
              <p className="text-blue-200">{t('contact.email.description')}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <MapPin className="w-8 h-8 mx-auto mb-4 text-blue-200" />
              <h3 className="font-semibold mb-2">{t('contact.address.title')}</h3>
              <p className="text-blue-200">{t('contact.address.description')}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Left Column - Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-8">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {t('form.title')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t('form.description')}
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Honeypot field */}
                  <div className="hidden">
                    <input {...register('website')} type="text" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      {t('form.name')}
                    </label>
                    <input
                      {...register('name')}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${
                        errors.name 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-gray-300 dark:border-zinc-600 focus:border-blue-500'
                      } bg-white dark:bg-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                      placeholder={t('form.namePlaceholder')}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      {t('form.email')}
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${
                        errors.email 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-gray-300 dark:border-zinc-600 focus:border-blue-500'
                      } bg-white dark:bg-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                      placeholder={t('form.emailPlaceholder')}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      {t('form.phone')}
                    </label>
                    <input
                      {...register('phone')}
                      type="tel"
                      className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${
                        errors.phone 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-gray-300 dark:border-zinc-600 focus:border-blue-500'
                      } bg-white dark:bg-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                      placeholder={t('form.phonePlaceholder')}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Building2 className="w-4 h-4 inline mr-2" />
                      {t('form.projectType')} *
                    </label>
                    <select
                      {...register('projectType')}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${
                        errors.projectType 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-gray-300 dark:border-zinc-600 focus:border-blue-500'
                      } bg-white dark:bg-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    >
                      <option value="">{t('form.projectType')}</option>
                      <option value="residential">{t('form.projectTypeOptions.residential')}</option>
                      <option value="apartment">{t('form.projectTypeOptions.apartment')}</option>
                      <option value="commercial">{t('form.projectTypeOptions.commercial')}</option>
                    </select>
                    {errors.projectType && (
                      <p className="text-red-500 text-sm mt-1">{errors.projectType.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <DollarSign className="w-4 h-4 inline mr-2" />
                        {t('form.budget')} *
                      </label>
                      <select
                        {...register('budget')}
                        className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${
                          errors.budget 
                            ? 'border-red-500 focus:border-red-500' 
                            : 'border-gray-300 dark:border-zinc-600 focus:border-blue-500'
                        } bg-white dark:bg-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                      >
                        <option value="">{t('form.budget')}</option>
                        <option value="under-1m">{t('form.budgetOptions.under-1m')}</option>
                        <option value="1-3m">{t('form.budgetOptions.1-3m')}</option>
                        <option value="3-5m">{t('form.budgetOptions.3-5m')}</option>
                        <option value="5-10m">{t('form.budgetOptions.5-10m')}</option>
                        <option value="over-10m">{t('form.budgetOptions.over-10m')}</option>
                      </select>
                      {errors.budget && (
                        <p className="text-red-500 text-sm mt-1">{errors.budget.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        {t('form.timeline')} *
                      </label>
                      <select
                        {...register('timeline')}
                        className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${
                          errors.timeline 
                            ? 'border-red-500 focus:border-red-500' 
                            : 'border-gray-300 dark:border-zinc-600 focus:border-blue-500'
                        } bg-white dark:bg-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                      >
                        <option value="">{t('form.timeline')}</option>
                        <option value="asap">{t('form.timelineOptions.asap')}</option>
                        <option value="1-3months">{t('form.timelineOptions.1-3months')}</option>
                        <option value="3-6months">{t('form.timelineOptions.3-6months')}</option>
                        <option value="6-12months">{t('form.timelineOptions.6-12months')}</option>
                        <option value="flexible">{t('form.timelineOptions.flexible')}</option>
                      </select>
                      {errors.timeline && (
                        <p className="text-red-500 text-sm mt-1">{errors.timeline.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      {t('form.location')} *
                    </label>
                    <input
                      {...register('location')}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${
                        errors.location 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-gray-300 dark:border-zinc-600 focus:border-blue-500'
                      } bg-white dark:bg-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                      placeholder={t('form.locationPlaceholder')}
                    />
                    {errors.location && (
                      <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <MessageSquare className="w-4 h-4 inline mr-2" />
                      {t('form.message')}
                    </label>
                    <textarea
                      {...register('message')}
                      rows={6}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 resize-none ${
                        errors.message 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-gray-300 dark:border-zinc-600 focus:border-blue-500'
                      } bg-white dark:bg-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                      placeholder={t('form.messagePlaceholder')}
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 ${
                      isSubmitting 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:from-blue-700 hover:to-blue-800 hover:shadow-xl transform hover:scale-[1.02]'
                    }`}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        {t('form.sending')}
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        {t('form.submit')}
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>

            {/* Right Column - Map and Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Map */}
              <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-zinc-700">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                    <Navigation className="w-5 h-5 mr-2 text-blue-600" />
                    {t('map.title')}
                  </h3>
                </div>
                <div className="h-80 bg-gray-100 dark:bg-zinc-700 relative">
                  {/* Embedded Google Maps */}
                  <iframe
                    src="https://www.google.com/maps?q=Zemsk%C3%A1%20818%2C%20415%2001%20Teplice&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title={t('map.title')}
                    onLoad={() => setMapLoaded(true)}
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0"
                  ></iframe>
                  {/* Fallback for when map doesn't load */}
                  {!mapLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 text-white pointer-events-none" aria-hidden="true">
                      <div className="text-center">
                        <MapPin className="w-12 h-12 mx-auto mb-4" />
                        <p className="font-semibold">{t('contact.address.street')}</p>
                        <p>{t('contact.address.city')}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Details */}
              <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  {t('contactDetails.title')}
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                      <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {t('contact.address.title')}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        {t('contact.address.description')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-lg">
                      <Phone className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {t('contact.phone.title')}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        <a 
                          href={`tel:${t('contact.phone.description')}`} 
                          className="hover:text-green-600 dark:hover:text-green-400 transition-colors"
                          onClick={() => {
                            // GA4 Phone Click Tracking - Custom event for conversion setup
                            if (typeof window !== 'undefined' && window.gtag) {
                              window.gtag('event', 'phone_click_conversion', {
                                event_category: 'conversion',
                                event_label: 'phone_number'
                              });
                            }
                            // Facebook Pixel Contact Event
                            if (typeof window !== 'undefined' && window.fbq) {
                              window.fbq('track', 'Contact', {
                                content_name: 'Phone Click',
                                content_category: 'Contact'
                              });
                            }
                          }}
                        >
                          {t('contact.phone.description')}
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                      <Mail className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {t('contact.email.title')}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        <a 
                          href={`mailto:${t('contact.email.description')}`} 
                          className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                          onClick={() => {
                            // GA4 Email Click Tracking - Custom event for conversion setup
                            if (typeof window !== 'undefined' && window.gtag) {
                              window.gtag('event', 'email_click_conversion', {
                                event_category: 'conversion',
                                event_label: 'email_address'
                              });
                            }
                            // Facebook Pixel Contact Event
                            if (typeof window !== 'undefined' && window.fbq) {
                              window.fbq('track', 'Contact', {
                                content_name: 'Email Click',
                                content_category: 'Contact'
                              });
                            }
                          }}
                        >
                          {t('contact.email.description')}
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                      <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {t('workingHours.title')}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        {t('workingHours.weekdays')}<br />
                        {t('workingHours.weekend')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transport Info */}
              <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  {t('transport.title')}
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Car className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {t('transport.parking')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Train className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {t('transport.train')}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Business Info Section */}
      <section className="bg-white dark:bg-zinc-800 py-20 px-4 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {t('businessInfo.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('businessInfo.description')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              className="bg-gray-50 dark:bg-zinc-700 rounded-xl p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <div className="flex items-center mb-6">
                <Building2 className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('additionalInfo.billing.title')}
                </h3>
              </div>
              <div className="space-y-2">
                <p className="text-gray-700 dark:text-gray-300">
                  {t('additionalInfo.billing.details.0')}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  {t('additionalInfo.billing.details.1')}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  {t('additionalInfo.billing.details.2')}
                </p>
              </div>
            </motion.div>

            <motion.div
              className="bg-gray-50 dark:bg-zinc-700 rounded-xl p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex items-center mb-6">
                <Shield className="w-8 h-8 text-green-600 dark:text-green-400 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('certificates.title')}
                </h3>
              </div>
              <div className="space-y-2">
                <p className="text-gray-700 dark:text-gray-300">
                  ✓ {t('certificates.engineer')}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  ✓ {t('certificates.license')}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  ✓ {t('certificates.insurance')}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
