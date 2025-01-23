'use client'
// src/components/Header/Header.tsx
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher'
import { useState } from 'react'

export default function Header() {
  const t = useTranslations('Navigation')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 w-full bg-white/95 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Maxprojekty
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            href="/sluzby" 
            className="text-gray-700 hover:text-gray-900 transition-colors"
          >
            {t('services')}
          </Link>
          <Link 
            href="/projekty" 
            className="text-gray-700 hover:text-gray-900 transition-colors"
          >
            {t('projects')}
          </Link>
          <Link 
            href="/o-nas" 
            className="text-gray-700 hover:text-gray-900 transition-colors"
          >
            {t('about')}
          </Link>
          <Link 
            href="/kontakt" 
            className="text-gray-700 hover:text-gray-900 transition-colors"
          >
            {t('contact')}
          </Link>
          <LanguageSwitcher />
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className="w-6 h-0.5 bg-gray-900 mb-1"></div>
          <div className="w-6 h-0.5 bg-gray-900 mb-1"></div>
          <div className="w-6 h-0.5 bg-gray-900"></div>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-2 flex flex-col gap-2">
            <Link 
              href="/sluzby" 
              className="py-2 text-gray-700 hover:text-gray-900"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('services')}
            </Link>
            <Link 
              href="/projekty" 
              className="py-2 text-gray-700 hover:text-gray-900"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('projects')}
            </Link>
            <Link 
              href="/o-nas" 
              className="py-2 text-gray-700 hover:text-gray-900"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('about')}
            </Link>
            <Link 
              href="/kontakt" 
              className="py-2 text-gray-700 hover:text-gray-900"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('contact')}
            </Link>
            <div className="py-2">
              <LanguageSwitcher />
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}
