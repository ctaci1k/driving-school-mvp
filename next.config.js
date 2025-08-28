// next.config.js
const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const baseConfig = {
  output: 'standalone',
  reactStrictMode: true,
  trailingSlash: false,
  
  // Налаштування зображень
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 'yourdomain.com' },
      // Додаткові домени для зображень
      { protocol: 'https', hostname: 'api.yourdomain.com' },
      { protocol: 'https', hostname: 'cdn.yourdomain.com' },
      { protocol: 'https', hostname: 'storage.googleapis.com' },
      { protocol: 'https', hostname: '*.googleusercontent.com' }
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 рік
  },
  
  // Змінні оточення
  env: {
    _next_intl_trailing_slash: 'false',
    // Додаткові змінні для i18n
    NEXT_PUBLIC_DEFAULT_LOCALE: 'pl',
    NEXT_PUBLIC_LOCALES: 'pl,uk,en,ru',
  },

  // Експериментальні функції для покращення продуктивності
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      'date-fns',
      'react-hook-form',
      '@hookform/resolvers'
    ],
    // Покращення швидкості білду
    webpackBuildWorker: true,
  },

  // Webpack конфігурація
  webpack: (config, { isServer }) => {
    // Оптимізація для JSON файлів локалізації
    config.module.rules.push({
      test: /\.json$/,
      type: 'json',
      include: /locales/,
    });

    // Ігнорувати певні warnings
    config.ignoreWarnings = [
      { module: /node_modules\/next-intl/ },
    ];

    // Додаткові alias для зручності
    config.resolve.alias = {
      ...config.resolve.alias,
      '@locales': './locales',
      '@i18n': './i18n',
    };

    return config;
  },

  // Переадресації для старих URL
  async redirects() {
    return [
      // Редірект з кореня на дефолтну локаль
      {
        source: '/',
        destination: '/pl',
        permanent: false,
        locale: false,
      },
      // Редіректи для старих URL без локалі
      {
        source: '/login',
        destination: '/pl/auth/login',
        permanent: true,
        locale: false,
      },
      {
        source: '/register',
        destination: '/pl/auth/register',
        permanent: true,
        locale: false,
      },
      {
        source: '/dashboard',
        destination: '/pl/dashboard',
        permanent: true,
        locale: false,
      },
      // Редіректи для зміни структури URL
      {
        source: '/:locale/signin',
        destination: '/:locale/auth/login',
        permanent: true,
      },
      {
        source: '/:locale/signup',
        destination: '/:locale/auth/register',
        permanent: true,
      },
    ];
  },

  // Переписування URL для API
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [
        // API routes можуть бути доступні без префікса локалі
        {
          source: '/api/:path*',
          destination: '/api/:path*',
        },
      ],
      fallback: [],
    };
  },

  // Headers для безпеки та продуктивності
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      // Кешування для статичних файлів
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Кешування для локалізаційних файлів
      {
        source: '/locales/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },

  // Компресія
  compress: true,

  // PoweredBy header
  poweredByHeader: false,

  // TypeScript
  typescript: {
    // Продовжити білд навіть при TypeScript помилках (для розробки)
    ignoreBuildErrors: false,
  },

  // ESLint
  eslint: {
    // Продовжити білд навіть при ESLint помилках (для розробки)
    ignoreDuringBuilds: false,
  },

  // SWC Minify для кращої продуктивності
  swcMinify: true,

  // Модульна федерація (якщо потрібно в майбутньому)
  // modularizeImports: {
  //   'lucide-react': {
  //     transform: 'lucide-react/dist/esm/icons/{{member}}',
  //   },
  // },
};

module.exports = withNextIntl(baseConfig);