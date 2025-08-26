// /next.config.js
const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const baseConfig = {
  output: 'standalone',
  reactStrictMode: true,
  trailingSlash: false,
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 'yourdomain.com' }
    ]
  },
  // 👇 Додаємо це, щоб прибрати warning від Next
  env: {
    _next_intl_trailing_slash: 'false'
  }
};

module.exports = withNextIntl(baseConfig);
