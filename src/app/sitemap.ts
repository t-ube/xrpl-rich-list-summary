// src/app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://xrp-rich-list-summary.shirome.net',
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1,
    }
  ]
}