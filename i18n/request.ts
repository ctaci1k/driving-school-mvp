// i18n/request.ts
// Оновлена конфігурація для next-intl з підтримкою російської мови

import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Підтримувані мови - додана російська
const locales = ['pl', 'uk', 'en', 'ru'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  // Перевірка чи локаль підтримується
  if (!locales.includes(locale as any)) notFound();

  // Функція для завантаження всіх файлів перекладів для конкретної мови
  const loadMessages = async (locale: string) => {
    try {
      // Завантажуємо всі JSON файли для обраної мови
      const modules = [
        'common',
        'auth', 
        'navigation',
        'forms',
        'errors',
        'instructor',
        'student',
        'admin'
      ];

      // Паралельне завантаження всіх модулів
      const messagePromises = modules.map(async (module) => {
        try {
          const messages = await import(`../locales/${locale}/${module}.json`);
          return { [module]: messages.default };
        } catch (error) {
          console.warn(`Warning: Missing translation file: /locales/${locale}/${module}.json`);
          // Повертаємо порожній об'єкт якщо файл не знайдено
          return { [module]: {} };
        }
      });

      // Чекаємо завантаження всіх файлів
      const loadedMessages = await Promise.all(messagePromises);
      
      // Об'єднуємо всі переклади в один об'єкт
      const messages = loadedMessages.reduce((acc, curr) => {
        return { ...acc, ...curr };
      }, {});

      return messages;
    } catch (error) {
      console.error(`Error loading messages for locale ${locale}:`, error);
      return {};
    }
  };

  const messages = await loadMessages(locale);

  // Налаштування для різних локалей
  const getLocaleConfig = (locale: string) => {
    switch(locale) {
      case 'pl':
        return {
          timeZone: 'Europe/Warsaw',
          currency: 'PLN',
          dateFormat: 'dd.MM.yyyy',
        };
      case 'uk':
        return {
          timeZone: 'Europe/Kiev',
          currency: 'UAH',
          dateFormat: 'dd.MM.yyyy',
        };
      case 'ru':
        return {
          timeZone: 'Europe/Moscow',
          currency: 'RUB',
          dateFormat: 'dd.MM.yyyy',
        };
      case 'en':
        return {
          timeZone: 'Europe/London',
          currency: 'GBP',
          dateFormat: 'MM/dd/yyyy',
        };
      default:
        return {
          timeZone: 'Europe/Warsaw',
          currency: 'PLN',
          dateFormat: 'dd.MM.yyyy',
        };
    }
  };

  const localeConfig = getLocaleConfig(locale);

  return {
    messages,
    // Додаткові налаштування
    timeZone: localeConfig.timeZone,
    now: new Date(),
    // Формати дат та чисел для кожної локалі
    formats: {
      dateTime: {
        short: {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        },
        long: {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric'
        }
      },
      number: {
        currency: {
          style: 'currency',
          currency: localeConfig.currency
        },
        decimal: {
          style: 'decimal',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        },
        percent: {
          style: 'percent',
          minimumFractionDigits: 0,
          maximumFractionDigits: 1
        }
      }
    }
  };
});