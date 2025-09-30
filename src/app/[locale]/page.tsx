import '@/app/[locale]/globals.css'
import MainSection from '@/components/MainSection/MainSection';
import { generateMetadata } from './metadata';

export { generateMetadata };

export default function HomePage() {
  return (
    <MainSection />
  );
}