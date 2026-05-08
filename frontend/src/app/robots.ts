import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://wandrer.vn';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/tours', '/tours/*', '/compare'],
        disallow: ['/admin', '/account', '/booking', '/payment'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
