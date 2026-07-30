import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://costa-drinks.vercel.app';

const PUBLIC_PATHS = [
  '',
  '/products',
  '/legal',
  '/privacy',
  '/cookies',
  '/terms',
  '/returns',
  '/contact',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const path of PUBLIC_PATHS) {
    for (const locale of routing.locales) {
      entries.push({
        url: `${siteUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === '' || path === '/products' ? 'daily' : 'monthly',
        priority: path === '' ? 1 : path === '/products' ? 0.9 : 0.4,
      });
    }
  }

  return entries;
}
