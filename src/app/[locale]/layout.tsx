import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Fraunces } from 'next/font/google';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing, RTL_LOCALES } from '@/i18n/routing';
import ToasterProvider from '@/components/ToasterProvider';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://costa-drinks.vercel.app';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  const OG_LOCALES: Record<string, string> = {
    es: 'es_ES',
    en: 'en_GB',
    fr: 'fr_FR',
    de: 'de_DE',
    ar: 'ar_AR',
  };

  return {
    metadataBase: new URL(siteUrl),
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}`])),
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `/${locale}`,
      siteName: 'Costa Drinks',
      locale: OG_LOCALES[locale] ?? 'en_GB',
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LiquorStore',
    name: 'Costa Drinks',
    url: siteUrl,
    telephone: '+34000000000',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Calle Camilo José Cela, 12 (Ed. Segovia)',
      addressLocality: 'Marbella',
      addressRegion: 'Málaga',
      postalCode: '29602',
      addressCountry: 'ES',
    },
    areaServed: [
      { '@type': 'City', name: 'Marbella' },
      { '@type': 'City', name: 'Estepona' },
      { '@type': 'City', name: 'Benahavís' },
      { '@type': 'City', name: 'Mijas' },
    ],
    openingHours: 'Mo-Su 08:00-22:00',
    priceRange: '€€',
  };

  const dir = RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextIntlClientProvider>
          {children}
          <ToasterProvider />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
