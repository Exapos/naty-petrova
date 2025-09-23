'use client'
// src/components/Header/Header.tsx
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher'
import ThemeToggle from './ThemeToggle'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Header() {
  const t = useTranslations('Navigation')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/70 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400 drop-shadow-sm">
          Maxprojekty
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            href="/sluzby" 
            className="nav-link"
          >
            {t('services')}
          </Link>
          <Link 
            href="/projekty" 
            className="nav-link"
          >
            {t('projects')}
          </Link>
          <Link 
            href="/reference" 
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
          <motion.a
            href="/kontakt"
            className="ml-2 px-6 py-2 rounded-full font-semibold bg-blue-600 text-white shadow-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-900"
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.97 }}
          >
            {t('contact')}
          </motion.a>
          <LanguageSwitcher />
          <ThemeToggle />
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menu"
        >
          <span className="block w-6 h-0.5 bg-blue-600 dark:bg-blue-400 mb-1 rounded transition-all" />
          <span className="block w-6 h-0.5 bg-blue-600 dark:bg-blue-400 mb-1 rounded transition-all" />
          <span className="block w-6 h-0.5 bg-blue-600 dark:bg-blue-400 rounded transition-all" />
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
            <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
              <Link href="/sluzby" className="nav-link-mobile" onClick={() => setIsMenuOpen(false)}>{t('services')}</Link>
              <Link href="/projekty" className="nav-link-mobile" onClick={() => setIsMenuOpen(false)}>{t('projects')}</Link>
              <Link href="/reference" className="nav-link-mobile" onClick={() => setIsMenuOpen(false)}>{t('references')}</Link>
              <Link href="/o-nas" className="nav-link-mobile" onClick={() => setIsMenuOpen(false)}>{t('about')}</Link>
              <Link href="/kariera" className="nav-link-mobile" onClick={() => setIsMenuOpen(false)}>{t('career')}</Link>
              <motion.a
                href="/kontakt"
                className="mt-2 px-6 py-2 rounded-full font-semibold bg-blue-600 text-white shadow-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-200 text-center"
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('contact')}
              </motion.a>
              <div className="py-2 flex items-center gap-2">
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
      `}</style>
    </header>
  )
}
