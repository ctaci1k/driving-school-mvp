// next.config.js

const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Додаємо це для виправлення попередження
  env: {
      _next_intl_trailing_slash: 'never'
  }
}

// PWA конфігурація
let finalConfig = withNextIntl(nextConfig);

try {
  const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: false,
  });
  
  finalConfig = withPWA(withNextIntl(nextConfig));
} catch (e) {
  console.log('PWA not installed, using only next-intl');
}

module.exports = finalConfig;