import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';
import '@/app/[locale]/globals.css'
import MainSection from '@/components/MainSection/MainSection';

export default function HomePage() {
  const t = useTranslations('HomePage');
  return (
    <MainSection />
  );
}