import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/api/', '/onboarding', '/reset-password'],
      },
    ],
    sitemap: 'https://www.tirei10.com.br/sitemap.xml',
    host: 'https://www.tirei10.com.br',
  };
}
