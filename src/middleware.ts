import { createServerClient } from '@supabase/ssr';
import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './i18n/routing';
import { isAdminEmail } from './lib/admin';

const intlMiddleware = createIntlMiddleware(routing);

const PROTECTED_PREFIX = /^\/(en|es)\/account(\/|$)/;
const ADMIN_PREFIX = /^\/(en|es)\/admin(\/|$)/;

export default async function middleware(request: NextRequest) {
  const intlResponse = intlMiddleware(request);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => intlResponse.cookies.set(name, value));
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const locale = request.nextUrl.pathname.startsWith('/en') ? 'en' : 'es';

  if (!user && PROTECTED_PREFIX.test(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    url.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (ADMIN_PREFIX.test(request.nextUrl.pathname)) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/login`;
      url.searchParams.set('next', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
    if (!isAdminEmail(user.email)) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}`;
      url.search = '';
      return NextResponse.redirect(url);
    }
  }

  return intlResponse;
}

export const config = {
  matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)'],
};
