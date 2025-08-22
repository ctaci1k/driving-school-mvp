// i18n.ts

import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';

export const locales = ['pl', 'uk', 'en', 'ru'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({locale}) => {
  if (!locales.includes(locale as any)) {
    notFound();
  }

  return {
    messages: (await import(`./messages/${locale}.json`)).default
  };
});