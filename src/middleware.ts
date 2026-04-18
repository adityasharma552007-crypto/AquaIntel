import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware';

const intlMiddleware = createMiddleware({
  locales: ['en', 'hi', 'mr', 'gu', 'ta'],
  defaultLocale: 'en',
  localePrefix: 'as-needed'
});

const locales = ['/hi', '/mr', '/gu', '/ta'];

const getPathWithoutLocale = (pathname: string) => {
  for (const locale of locales) {
    if (pathname === locale || pathname.startsWith(`${locale}/`)) {
      return pathname.replace(locale, '') || '/';
    }
  }
  return pathname;
};

export async function middleware(request: NextRequest) {
  let response = intlMiddleware(request);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const pathWithoutLocale = getPathWithoutLocale(pathname);

  // Public routes — never redirect to login
  const isLandingPage = pathWithoutLocale === '/'
  const isAuthPage = pathWithoutLocale.startsWith('/auth')
  const isPublicRoute = isLandingPage || isAuthPage

  // 1. Landing page — always let through (server component handles logged-in redirect to /home)
  if (isLandingPage) {
    return response
  }

  // 2. Auth pages — if already logged in, go to /home (except profile completion)
  const isProfileCompletion = pathWithoutLocale === '/auth/complete-profile';
  if (isAuthPage && user && !isProfileCompletion) {
    const localePrefix = pathname.substring(0, pathname.length - pathWithoutLocale.length);
    return NextResponse.redirect(new URL(`${localePrefix}/home`.replace('//', '/'), request.url))
  }

  // 3. Protected dashboard routes — redirect to login if not authenticated
  const protectedPaths = ['/home', '/scan', '/chat', '/map', '/history', '/profile', '/learn']
  const isProtected = protectedPaths.some(path => pathWithoutLocale.startsWith(path))
  if (isProtected && !user) {
    const localePrefix = pathname.substring(0, pathname.length - pathWithoutLocale.length);
    return NextResponse.redirect(new URL(`${localePrefix}/auth/login`.replace('//', '/'), request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
}
