import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

/**
 * Next 16 "Proxy" (formerly Middleware).
 *
 * Three responsibilities:
 *  1. Locale routing for the public site (sr/en/ru) via next-intl.
 *  2. Refresh Supabase auth cookies on /uvid requests.
 *  3. Optimistic redirect for /uvid when there's no session.
 */

const intlMiddleware = createIntlMiddleware(routing);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isUvid = pathname === "/uvid" || pathname.startsWith("/uvid/");

  if (!isUvid) {
    return intlMiddleware(request);
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
