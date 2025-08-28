// middleware.ts
import type {NextRequest} from 'next/server';
import {NextResponse} from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import {getToken} from 'next-auth/jwt';

// Підтримувані локалі та дефолтна
const locales = ['pl', 'uk', 'en', 'ru'] as const;
type AppLocale = (typeof locales)[number];
const defaultLocale: AppLocale = 'pl';

// Публічні сторінки (без префікса локалі)
const publicPages = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify',
  '/about',
  '/contact',
  '/pricing',
  '/terms',
  '/privacy'
];

// next-intl middleware: додає/перевіряє префікс локалі
const intl = createIntlMiddleware({
  locales: locales as unknown as string[],
  defaultLocale,
  // хочеш без префікса для дефолтної локалі — заміни на 'as-needed'
  localePrefix: 'always'
});

// Допоміжне: зняти рівно один префікс локалі з початку шляху
function stripLocalePrefix(pathname: string): {locale: AppLocale; stripped: string} {
  for (const l of locales) {
    if (pathname === `/${l}`) return {locale: l, stripped: '/'};
    if (pathname.startsWith(`/${l}/`)) return {locale: l, stripped: pathname.slice(1 + l.length) || '/'};
  }
  // якщо немає префікса — вважай дефолтну локаль
  return {locale: defaultLocale, stripped: pathname};
}

// Допоміжне: сторінка є публічною?
function isPublic(pathnameWithoutLocale: string): boolean {
  // Нормалізувати подвійні слеші
  const p = pathnameWithoutLocale.replace(/\/{2,}/g, '/');
  return publicPages.some((page) => p === page || p.startsWith(page + '/'));
}

// Редірект на локалізовану сторінку логіну
function redirectToLogin(req: NextRequest, locale: AppLocale) {
  const url = new URL(`/${locale}/auth/login`, req.url);
  url.searchParams.set('callbackUrl', req.nextUrl.pathname + req.nextUrl.search);
  return NextResponse.redirect(url);
}

export default async function middleware(req: NextRequest) {
  const {pathname} = req.nextUrl;

  // 1) Пропускаємо технічне (статичні файли/іконки) — це ще дублюється у matcher, але залишимо guard
  if (pathname.startsWith('/_next') || pathname.includes('.') || pathname === '/favicon.ico') {
    return NextResponse.next();
  }

  // 2) API не локалізуємо й не захищаємо тут (керуйся роут-хендлерами)
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // 3) Спочатку — локалізація
  const intlResp = intl(req);

  // Якщо intl зробив редірект (/ -> /pl тощо), віддаємо його одразу
  if (intlResp.status >= 300 && intlResp.status < 400) {
    return intlResp;
  }

  // 4) Визначаємо локаль і шлях без локалі
  const {locale, stripped: pathnameWithoutLocale} = stripLocalePrefix(req.nextUrl.pathname);

  // 5) Публічні сторінки — пропускаємо (але вже після нормалізації локалі)
  if (isPublic(pathnameWithoutLocale)) {
    return intlResp; // достатньо next-intl обробки
  }

  // 6) Дістаємо токен (JWT) з NextAuth
  const token = await getToken({req, secret: process.env.NEXTAUTH_SECRET});

  // Якщо немає токена — редіректимо на локалізований логін
  if (!token) {
    return redirectToLogin(req, locale);
  }

  // 7) Рольовий доступ
  const role = (token as any)?.role as string | undefined;

  if (pathnameWithoutLocale.startsWith('/admin')) {
    if (role !== 'ADMIN') return NextResponse.redirect(new URL(`/${locale}`, req.url));
  }

  if (pathnameWithoutLocale.startsWith('/instructor')) {
    if (role !== 'INSTRUCTOR' && role !== 'ADMIN')
      return NextResponse.redirect(new URL(`/${locale}`, req.url));
  }

  if (pathnameWithoutLocale.startsWith('/student')) {
    if (role !== 'STUDENT' && role !== 'ADMIN')
      return NextResponse.redirect(new URL(`/${locale}`, req.url));
  }

  // 8) Усе інше — пропускаємо далі (вже локалізований запит)
  return intlResp;
}

// Матчер: локалізуємо все, крім технічного
export const config = {
  matcher: [
    // усе, крім системних шляхів та файлів з розширенням
    '/((?!_next|.*\\..*|favicon.ico|api).*)',
    '/',
    '/(pl|uk|en|ru)/:path*'
  ]
};