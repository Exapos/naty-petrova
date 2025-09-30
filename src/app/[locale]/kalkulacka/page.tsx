import { Metadata } from 'next';
import CalculatorClient from '@/components/CalculatorClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: 'Kalkulačka projektových služeb | Maxprojekty',
    description: 'Zjistěte orientační cenu za naše architektonické služby. Interaktivní kalkulačka pro rodinné domy, bytové domy a komerční stavby.',
    keywords: ['kalkulačka', 'cena', 'architektonické služby', 'projekt', 'stavba', 'náklady'],
    openGraph: {
      title: 'Kalkulačka projektových služeb | Maxprojekty',
      description: 'Zjistěte orientační cenu za naše architektonické služby. Interaktivní kalkulačka pro všechny typy staveb.',
      type: 'website',
      locale: locale,
      siteName: 'Maxprojekty',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Kalkulačka projektových služeb | Maxprojekty',
      description: 'Zjistěte orientační cenu za naše architektonické služby.',
    },
    alternates: {
      canonical: `/${locale}/kalkulacka`,
      languages: {
        'cs': '/cs/kalkulacka',
        'de': '/de/kalkulacka',
        'en': '/en/kalkulacka',
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default function KalkulackaPage() {
  return <CalculatorClient />;
}