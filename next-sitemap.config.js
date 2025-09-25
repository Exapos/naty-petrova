/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'http://maxprojekty.cz',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 7000,
  exclude: ['/admin/*', '/api/*'],
  robotsTxtOptions: {
    additionalSitemaps: [
      'http://maxprojekty.cz/sitemap.xml',
    ],
  },
};
