import createMiddleware from 'next-intl/middleware';
import {createServerClient, type CookieOptions} from '@supabase/ssr';
import {NextResponse, type NextRequest} from 'next/server';
import {routing} from '@/i18n/routing';

const handleI18nRouting = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const response = handleI18nRouting(request);
  const path = request.nextUrl.pathname;
  const segments = path.split('/').filter(Boolean);
  const locale = routing.locales.includes(segments[0] as any) ? segments[0] : routing.defaultLocale;
  const pathnameWithoutLocale = `/${segments.slice(1).join('/')}`.replace(/\/$/, '') || '/';

  let supabaseResponse = response;
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({name, value, ...options});
          supabaseResponse.cookies.set({name, value, ...options});
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({name, value: '', ...options});
          supabaseResponse.cookies.set({name, value: '', ...options});
        }
      }
    }
  );

  const {data: {user}} = await supabase.auth.getUser();

  const isLandingPage = pathnameWithoutLocale === '/';
  const isAuthPage = pathnameWithoutLocale.startsWith('/auth');
  const isProfileCompletion = pathnameWithoutLocale === '/auth/complete-profile';

  if (isLandingPage) {
    return supabaseResponse;
  }

  if (isAuthPage && user && !isProfileCompletion) {
    return NextResponse.redirect(new URL(`/${locale}/home`, request.url));
  }

  const protectedPaths = ['/home', '/scan', '/chat', '/map', '/history', '/profile', '/learn'];
  const isProtected = protectedPaths.some((protectedPath) => pathnameWithoutLocale.startsWith(protectedPath));

  if (isProtected && !user) {
    return NextResponse.redirect(new URL(`/${locale}/auth/login`, request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)']
};
