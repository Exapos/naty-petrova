'use client'
// src/components/Footer.tsx
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'

export default function Footer() {
  const t = useTranslations('Footer')

  return (
    <footer className="relative z-40 bg-white/80 dark:bg-zinc-900/90 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 text-gray-900 dark:text-zinc-100 py-12 transition-colors">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          <h3 className="text-2xl font-extrabold mb-3 text-blue-600 dark:text-blue-400">MaxProjekty</h3>
          <p className="text-base opacity-80 mb-2">{t('description')}</p>
          <p className="text-xs opacity-60">© {new Date().getFullYear()} MaxProjekty. {t('rights')}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <h4 className="text-lg font-semibold mb-3">{t('contact')}</h4>
          <a href="mailto:info@maxprojekty.cz" className="block hover:text-blue-500 transition-colors">info@maxprojekty.cz</a>
          <a href="tel:+420775312614" className="block hover:text-blue-500 transition-colors">+420 775 312 614</a>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h4 className="text-lg font-semibold mb-3">{t('followUs')}</h4>
          <div className="flex gap-4">
            <motion.a
              href="https://www.instagram.com/maxprojekty.cz/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.13, color: '#e1306c' }}
              className="hover:text-pink-500 transition-colors font-medium"
            >
              Instagram
            </motion.a>
            <motion.a
              href="https://www.facebook.com/maxprojekty"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.13, color: '#1877f3' }}
              className="hover:text-blue-600 transition-colors font-medium"
            >
              Facebook
            </motion.a>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
