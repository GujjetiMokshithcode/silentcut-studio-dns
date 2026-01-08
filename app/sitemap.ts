import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://silentcut.studio',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://silentcut.studio/privacy',
      lastModified: new Date('2026-01-02'),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: 'https://silentcut.studio/terms',
      lastModified: new Date('2026-01-02'),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]
}
