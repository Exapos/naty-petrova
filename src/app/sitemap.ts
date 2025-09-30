import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://maxprojekty.cz'

  // Základní stránky pro všechny lokalizace
  const locales = ['cs', 'en', 'de']
  const pages = [
    '',
    '/sluzby',
    '/references',
    '/o-nas',
    '/kontakt',
    '/kariera',
    '/blog',
    '/kalkulacka'
  ]

  const sitemapEntries: MetadataRoute.Sitemap = []

  // Přidat všechny lokalizované stránky
  locales.forEach(locale => {
    pages.forEach(page => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'weekly' : 'monthly',
        priority: page === '' ? 1.0 : 0.8,
      })
    })
  })

  // Přidat hlavní stránku bez lokalizace (redirect na cs)
  sitemapEntries.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1.0,
  })

  return sitemapEntries
}