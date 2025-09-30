import { Metadata, Viewport } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: 'Maxprojekty - Architektura a projekce | Profesionální stavební projekty',
    description: 'Profesionální architektonické a projekční služby v České republice. Navrhujeme a projektujeme domy, kanceláře, komerční objekty a průmyslové stavby s více než 10letou praxí.',
    keywords: [
      // Základní oborová klíčová slova
      'architektura',
      'architekt',
      'projekce',
      'stavební projekty',
      'architektonické návrhy',
      'projektová dokumentace',
      'stavební dozor',
      'projekční kancelář',
      'návrh domu',
      'stavební projektant',

      // Lokální SEO - Teplice a okolí
      'architekt Teplice',
      'projekční kancelář Teplice',
      'architekt Ústecký kraj',
      'stavební projektant Teplice',
      'architektonické služby Teplice',
      'projektování Teplice',

      // Konkrétní služby
      'architektonické návrhy',
      'projekční činnost',
      'stavební dokumentace',
      '3D vizualizace',
      'rekonstrukce budov',
      'stavební konzultace',
      'dokumentace pro stavební povolení',
      'prováděcí dokumentace',
      'fotorealistické vizualizace',

      // Typy staveb a projektů
      'návrh rodinného domu',
      'projekt kancelářské budovy',
      'architektura komerčních objektů',
      'průmyslové stavby',
      'rekonstrukce domu',
      'modernizace budov',
      'přestavba objektů',
      'památkové objekty',

      // Dlouhoocasá klíčová slova
      'architektonické návrhy moderních domů',
      'projektová dokumentace pro stavební povolení',
      '3D vizualizace stavebních projektů',
      'rekonstrukce a modernizace budov',
      'odborné stavební konzultace',
      'komplexní projekční služby',
      'architektonické studie a návrhy',
      'stavební dozor a technický dohled',

      // Kvalita a zkušenosti
      'zkušený architekt',
      'profesionální projekční služby',
      'kvalitní architektonické návrhy',
      'individuální přístup k projektu',
      'více než 10 let zkušeností',
      'autorizovaný projektant',
      'certifikovaný architekt',

      // Technické a specializované
      'BIM projektování',
      'energeticky úsporné domy',
      'nízkonákladové stavby',
      'udržitelné architektury',
      'pasivní domy',
      'zelené stavby'
    ],
    authors: [{ name: 'Maxprojekty' }],
    creator: 'Maxprojekty',
    publisher: 'Maxprojekty',
    category: 'Architecture & Construction',
    classification: 'Professional Services',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL('https://maxprojekty.cz'),
    alternates: {
      canonical: locale === 'cs' ? '/' : `/${locale}`,
      languages: {
        'cs': '/',
        'de': '/de',
        'en': '/en',
      },
    },
    openGraph: {
      title: 'Maxprojekty - Architektura a projekce | Profesionální stavební projekty',
      description: 'Profesionální architektonické služby v Teplicích. Navrhujeme moderní domy, kanceláře a komerční objekty s individuálním přístupem. Více než 12 let zkušeností.',
      url: 'https://maxprojekty.cz',
      siteName: 'Maxprojekty',
      type: 'website',
      locale: locale === 'cs' ? 'cs_CZ' : locale === 'de' ? 'de_DE' : 'en_US',
      images: [
        {
          url: '/hero-building.jpg',
          width: 1200,
          height: 630,
          alt: 'Maxprojekty - Architektura a projekce v Teplicích',
          type: 'image/jpeg',
        },
        {
          url: '/hero-building2.jpg',
          width: 1200,
          height: 630,
          alt: 'Naše architektonické projekty',
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Maxprojekty - Architektura a projekce | Profesionální stavební projekty',
      description: 'Profesionální architektonické služby v Teplicích. Navrhujeme moderní domy, kanceláře a komerční objekty s individuálním přístupem.',
      images: ['/hero-building.jpg'],
      creator: '@maxprojekty',
      site: '@maxprojekty',
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'your-google-verification-code',
      yandex: 'your-yandex-verification-code',
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: 'Maxprojekty',
    },
    other: {
      'msapplication-TileColor': '#ffffff',
      'msapplication-config': '/browserconfig.xml',
      'revisit-after': '7 days',
    },
  };
}

export function generateViewport(): Viewport {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: '#ffffff' },
      { media: '(prefers-color-scheme: dark)', color: '#000000' },
    ],
  };
}