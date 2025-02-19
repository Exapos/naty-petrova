// src/components/LanguageSwitcher/LanguageSwitcher.tsx
'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/navigation';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (newLocale) => {
    router.replace(pathname, {locale: newLocale});
  };

  return (
    <div className="flex gap-2 items-center">
      <button 
        onClick={() => handleChange('cs')}
        className={`${locale === 'cs' ? 'font-bold' : ''}`}
      >
        CZ
      </button>
      <span>|</span>
      <button 
        onClick={() => handleChange('en')}
        className={`${locale === 'en' ? 'font-bold' : ''}`}
      >
        EN
      </button>
      <span>|</span>
      <button 
        onClick={() => handleChange('de')}
        className={`${locale === 'de' ? 'font-bold' : ''}`}
      >
        DE
      </button>
    </div>
  );
}
