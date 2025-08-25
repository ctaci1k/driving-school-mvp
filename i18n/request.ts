// i18n/request.ts
import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'

const locales = ['pl', 'uk', 'en', 'ru']

export default getRequestConfig(async ({ requestLocale }) => {
  // Нова версія використовує requestLocale замість locale
  const locale = await requestLocale
  
  if (!locale || !locales.includes(locale)) {
    notFound()
  }

  return {
    locale, // ВАЖЛИВО: повертаємо locale
    messages: (await import(`../messages/${locale}.json`)).default
  }
})