// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: 'Twitterbot',
        disallow: ['/api/og/'],
      },
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: 'https://xrp-rich-list-summary.shirome.net/sitemap.xml'
  }
}
