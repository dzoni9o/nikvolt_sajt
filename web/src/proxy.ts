import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

/**
 * Next 16 "Proxy" (formerly Middleware).
 *
 * Three responsibilities:
 *  1. Locale routing for the public site (sr/en/ru) via next-intl, with a
 *     geo override that forces /sr for visitors from Serbia regardless of
 *     their browser's Accept-Language. Note the public layouts read the locale
 *     from the URL segment, not from a header set here — that is deliberate,
 *     since reading headers in a layout would force dynamic rendering.
 *  2. Refresh Supabase auth cookies on /uvid requests.
 *  3. Optimistic redirect for /uvid when there's no session.
 */

const intlMiddleware = createIntlMiddleware(routing);

const LOCALE_COOKIE = "NEXT_LOCALE";
const SERBIA_LOCALE = "sr";

function pathHasLocalePrefix(pathname: string): boolean {
  return routing.locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
}

function visitorCountry(request: NextRequest): string | null {
  // Vercel sets x-vercel-ip-country; Cloudflare sets cf-ipcountry. Both 2-letter ISO.
  const code =
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cf-ipcountry") ??
    null;
  return code ? code.toUpperCase() : null;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isUvid = pathname === "/uvid" || pathname.startsWith("/uvid/");

  if (!isUvid) {
    // Geo override: visitors from Serbia get Serbian, ignoring Accept-Language.
    // Only fires when the user hasn't already picked a locale (no cookie) and
    // the URL doesn't already have a locale prefix — otherwise we'd trap
    // people who explicitly clicked English/Russian.
    const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
    if (
      !pathHasLocalePrefix(pathname) &&
      !cookieLocale &&
      visitorCountry(request) === "RS"
    ) {
      const url = request.nextUrl.clone();
      url.pathname = `/${SERBIA_LOCALE}${pathname === "/" ? "" : pathname}`;
      const response = NextResponse.redirect(url);
      response.cookies.set(LOCALE_COOKIE, SERBIA_LOCALE, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
      return response;
    }
    return intlMiddleware(request);
  }

  let response = NextResponse.next({ request });

  // If Supabase isn't configured (env vars missing), don't crash — let the
  // /uvid layout handle the empty session and render a config-needed page.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(toSet) {
          for (const { name, value } of toSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of toSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoginRoute =
    pathname === "/uvid/login" || pathname.startsWith("/uvid/login/");

  if (!user && !isLoginRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/uvid/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (user && isLoginRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/uvid";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    // Run on all paths except: api, _next internals, files with extensions
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
