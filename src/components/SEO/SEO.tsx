import { NextSeo } from 'next-seo';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  openGraph?: {
    title?: string;
    description?: string;
    images?: Array<{
      url: string;
      width?: number;
      height?: number;
      alt?: string;
    }>;
    siteName?: string;
    type?: string;
  };
  twitter?: {
    cardType?: string;
    site?: string;
    handle?: string;
  };
  additionalMetaTags?: Array<{
    property: string;
    content: string;
  }>;
}

export function SEO({
  title = "Maxprojekty - Architektura a projekce",
  description = "Profesionální architektonické a projekční služby. Navrhujeme a projektujeme domy, kanceláře a komerční objekty s více než 10letou praxí.",
  canonical,
  openGraph,
  twitter,
  additionalMetaTags = []
}: SEOProps) {
  const defaultOpenGraph = {
    title: title,
    description: description,
    images: [
      {
        url: '/hero-building.jpg',
        width: 1200,
        height: 630,
        alt: 'Maxprojekty - Architektura a projekce'
      }
    ],
    siteName: 'Maxprojekty',
    type: 'website'
  };

  const defaultTwitter = {
    cardType: 'summary_large_image',
    site: '@maxprojekty',
    handle: '@maxprojekty'
  };

  const defaultAdditionalMetaTags = [
    {
      property: 'og:locale',
      content: 'cs_CZ'
    },
    {
      property: 'og:site_name',
      content: 'Maxprojekty'
    },
    {
      property: 'article:author',
      content: 'Maxprojekty'
    },
    {
      property: 'article:publisher',
      content: 'Maxprojekty'
    }
  ];

  return (
    <NextSeo
      title={title}
      description={description}
      canonical={canonical}
      openGraph={{
        ...defaultOpenGraph,
        ...openGraph
      }}
      twitter={{
        ...defaultTwitter,
        ...twitter
      }}
      additionalMetaTags={[
        ...defaultAdditionalMetaTags,
        ...additionalMetaTags
      ]}
    />
  );
}