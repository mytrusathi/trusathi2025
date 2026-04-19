import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.trusathi.com';
  
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/about', '/search', '/community'],
      disallow: ['/dashboard', '/register/pending'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
