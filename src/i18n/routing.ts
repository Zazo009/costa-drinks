import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['es', 'en', 'fr', 'de', 'ar'],
  defaultLocale: 'es',
});

export const RTL_LOCALES = ['ar'];
