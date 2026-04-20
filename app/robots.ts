import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard/', 
        '/register/success', 
        '/api/',
        '/_next/',
        '/static/'
      ],
    },
    sitemap: 'https://trusathi.com/sitemap.xml',
  }
}
