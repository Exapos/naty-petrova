// src/components/LanguageSwitcher/LanguageSwitcher.tsx
import { useLocale } from 'next-intl'
import { Link } from '@/navigation'

export default function LanguageSwitcher() {
  const locale = useLocale()
  
  return (
    <div className="flex gap-2 items-center">
      <Link href="/" locale="cs" className={`${locale === 'cs' ? 'font-bold' : ''}`}>
        CZ
      </Link>
      <span>|</span>
      <Link href="/" locale="en" className={`${locale === 'en' ? 'font-bold' : ''}`}>
        EN
      </Link>
      <span>|</span>
      <Link href="/" locale="de" className={`${locale === 'de' ? 'font-bold' : ''}`}>
        DE
      </Link>
    </div>
  )
}
