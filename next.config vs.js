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



module.exports = {
  output: 'standalone',
  images: {
    domains: ['localhost', 'yourdomain.com'],
  },
  experimental: {
    outputFileTracingRoot: require('path').join(__dirname, '../../'),
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
}
module.exports = finalConfig;