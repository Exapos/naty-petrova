'use client'
// src/components/Header/Header.tsx
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher'
import ThemeToggle from './ThemeToggle'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Header() {
  const t = useTranslations('Navigation')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/70 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl md:text-2xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400 drop-shadow-sm flex-shrink-0">
          Maxprojekty
        </Link>

        {/* Desktop Navigation - Large screens */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link 
            href="/sluzby" 
            className="nav-link"
          >
            {t('services')}
          </Link>
          <Link 
            href="/references" 
            className="nav-link"
          >
            {t('references')}
          </Link>
          <Link 
            href="/o-nas" 
            className="nav-link"
          >
            {t('about')}
          </Link>
          <Link 
            href="/kariera" 
            className="nav-link"
          >
            {t('career')}
          </Link>
          <Link 
            href="/blog" 
            className="nav-link"
          >
            Blog
          </Link>
          <Link 
            href="/kalkulacka" 
            className="nav-link"
          >
            Kalkulačka
          </Link>
          <motion.div
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link
              href="/kontakt"
              className="ml-2 px-6 py-2 rounded-full font-semibold bg-blue-600 text-white shadow-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-900 inline-block"
            >
              {t('contact')}
            </Link>
          </motion.div>
          <LanguageSwitcher />
          <ThemeToggle />
        </nav>

        {/* Tablet Navigation - Medium screens */}
        <nav className="hidden md:flex lg:hidden items-center gap-3">
          <Link 
            href="/sluzby" 
            className="nav-link text-sm"
          >
            {t('services')}
          </Link>
          <Link 
            href="/references" 
            className="nav-link text-sm"
          >
            {t('references')}
          </Link>
          <Link 
            href="/o-nas" 
            className="nav-link text-sm"
          >
            {t('about')}
          </Link>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/kontakt"
              className="px-4 py-2 rounded-full font-semibold bg-blue-600 text-white shadow-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-200 text-sm"
            >
              {t('contact')}
            </Link>
          </motion.div>
          <div className="flex items-center gap-1">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 flex-shrink-0"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menu"
        >
          <span className={`block w-6 h-0.5 bg-blue-600 dark:bg-blue-400 mb-1 rounded transition-all ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
          <span className={`block w-6 h-0.5 bg-blue-600 dark:bg-blue-400 mb-1 rounded transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-blue-600 dark:bg-blue-400 rounded transition-all ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white/95 dark:bg-zinc-900/95 border-t border-zinc-200 dark:border-zinc-800 shadow-lg"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-3">
              <Link href="/sluzby" className="nav-link-mobile" onClick={() => setIsMenuOpen(false)}>{t('services')}</Link>
              <Link href="/references" className="nav-link-mobile" onClick={() => setIsMenuOpen(false)}>{t('references')}</Link>
              <Link href="/o-nas" className="nav-link-mobile" onClick={() => setIsMenuOpen(false)}>{t('about')}</Link>
              <Link href="/kariera" className="nav-link-mobile" onClick={() => setIsMenuOpen(false)}>{t('career')}</Link>
              <Link href="/blog" className="nav-link-mobile" onClick={() => setIsMenuOpen(false)}>Blog</Link>
              <Link href="/kalkulacka" className="nav-link-mobile" onClick={() => setIsMenuOpen(false)}>Kalkulačka</Link>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/kontakt"
                  className="mt-2 px-6 py-3 rounded-full font-semibold bg-blue-600 text-white shadow-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-200 text-center inline-block w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('contact')}
                </Link>
              </motion.div>
              <div className="py-2 flex items-center justify-center gap-4">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
      <style jsx global>{`
        .nav-link {
          position: relative;
          color: var(--tw-prose-invert, #18181b);
          font-weight: 500;
          padding: 0.5rem 0.75rem;
          border-radius: 0.5rem;
          transition: color 0.2s, background 0.2s;
          white-space: nowrap;
        }
        .nav-link:hover, .nav-link:focus {
          color: #2563eb;
          background: rgba(37,99,235,0.08);
        }
        .dark .nav-link {
          color: #e0e7ef;
        }
        .dark .nav-link:hover, .dark .nav-link:focus {
          color: #fff;
          background: rgba(37,99,235,0.18);
        }
        .nav-link-mobile {
          display: block;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          font-weight: 500;
          color: #18181b;
          transition: color 0.2s, background 0.2s;
          text-align: center;
        }
        .nav-link-mobile:hover, .nav-link-mobile:focus {
          color: #2563eb;
          background: rgba(37,99,235,0.08);
        }
        .dark .nav-link-mobile {
          color: #e0e7ef;
        }
        .dark .nav-link-mobile:hover, .dark .nav-link-mobile:focus {
          color: #fff;
          background: rgba(37,99,235,0.18);
        }

        /* Responsive adjustments */
        @media (max-width: 1024px) {
          .nav-link {
            padding: 0.375rem 0.5rem;
            font-size: 0.875rem;
          }
        }

        @media (max-width: 768px) {
          .nav-link-mobile {
            padding: 0.625rem 0.875rem;
            font-size: 1rem;
          }
        }
      `}</style>
    </header>
  )
}
