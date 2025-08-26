// lib/i18n/config.ts

export const locales = ['pl', 'uk', 'en', 'ru'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'pl'

export const localeNames: Record<Locale, string> = {
  pl: 'Polski',
  uk: 'Українська',
  en: 'English',
  ru: 'Русский'
}

export const localeFlags: Record<Locale, string> = {
  pl: '🇵🇱',
  uk: '🇺🇦',
  en: '🇬🇧',
  ru: '🇷🇺'
}