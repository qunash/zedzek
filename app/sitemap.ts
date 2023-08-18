import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const languages = ['', 'en', 'ru', 'tr', 'ar']
  const pages = ['', '/contribute']
  const sitemap = []

  for (const language of languages) {
    for (const page of pages) {
      sitemap.push({
        url: `https://zedzek.com${language ? '/' + language : ''}${page}`,
        lastModified: new Date(),
      })
    }
  }

  return sitemap
}
