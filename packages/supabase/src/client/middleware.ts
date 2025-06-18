import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import type { Database } from "types/database.types";
// Array of route prefixes that don't require authentication
const PUBLIC_ROUTES = [
  "/",
  "/auth",
  "/signin",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/privacy-policy",
  "/terms-of-use",
  "/api",
  "/changelog",
  "/contact",
  "/about",
  "/404",
  "/roadmap",
  "/pricing",
  "/api/stripe/webhook",
];

const REDIRECT_ROUTES = [
  {
    routes: ["/terms-and-conditions", "/terms-of-service"],
    redirect: "/terms-of-use",
  },
  {
    routes: ["/roadmap"],
    redirect: "https://armony.featurebase.app/roadmap",
  },
  {
    routes: ["/changelog"],
    redirect: "https://armony.featurebase.app/changelog",
  },
  {
    routes: ["/feedback", "/feedbacks"],
    redirect: "https://armony.featurebase.app/",
  },
];

export async function updateSession(
  request: NextRequest,
): Promise<NextResponse> {
  let supabaseResponse = NextResponse.next({ request });

  // Initialize Supabase client
  const supabase = createServerClient<Database>(
    // biome-ignore lint/style/noNonNullAssertion: <To simplify monorepo setup>
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // biome-ignore lint/style/noNonNullAssertion: <To simplify monorepo setup>
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // biome-ignore lint/complexity/noForEach: <Same as supabase documentation>
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );

          supabaseResponse = NextResponse.next({ request });

          // biome-ignore lint/complexity/noForEach: <Same as supabase documentation>
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  if (!supabase) {
    throw new Error("Supabase client not initialized");
  }

  const { pathname } = request.nextUrl;

  // Special handling for callback route - always allow
  if (pathname.startsWith("/auth/callback")) {
    return NextResponse.next();
  }

  // Check for predefined redirects first
  const routeRedirect = checkRouteRedirect(request);
  if (routeRedirect) {
    return routeRedirect;
  }

  // Get user authentication status early
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Handle user-specific redirects first if authenticated
  if (user) {
    // Redirect authenticated users from root to chat
    if (pathname === "/") {
      return createRedirectResponse(request, "/chat");
    }

    // Redirect logged-in users from signin page to chat
    if (pathname === "/signin") {
      return createRedirectResponse(request, "/chat");
    }

    // Redirect authenticated users from auth paths to home
    if (pathname.startsWith("/auth")) {
      return createRedirectResponse(request, "/");
    }

    // Check admin access
    if (pathname.startsWith("/admin")) {
      const isAdminUser = isAdmin(user.email);
      if (!isAdminUser) {
        return createRedirectResponse(request, "/");
      }
    }
  }

  // Check for public routes after handling user-specific redirects
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Handle unauthenticated users accessing protected routes
  if (!user) {
    return createRedirectResponse(request, "/signin");
  }

  // Default: proceed with the request
  return NextResponse.next();
}

const isAdmin = (userEmail: string | null | undefined) => {
  if (process.env.NODE_ENV === "development") {
    return (
      userEmail === "test@mail.com" ||
      userEmail === "damien.schneider01@gmail.com"
    );
  }
  return userEmail === "damien.schneider01@gmail.com";
};

// Helper functions to reduce complexity
const isExternalUrl = (url: string): boolean =>
  url.startsWith("http://") || url.startsWith("https://");

const isPathMatch = (pathname: string, routes: string[]): boolean =>
  routes.some((route) => pathname.startsWith(route));

const createRedirectResponse = (
  request: NextRequest,
  targetPath: string,
): NextResponse => {
  if (isExternalUrl(targetPath)) {
    return NextResponse.redirect(targetPath);
  }

  const url = request.nextUrl.clone();
  url.pathname = targetPath;
  return NextResponse.redirect(url);
};

const checkRouteRedirect = (request: NextRequest): NextResponse | null => {
  const { pathname } = request.nextUrl;

  for (const route of REDIRECT_ROUTES) {
    if (isPathMatch(pathname, route.routes)) {
      return createRedirectResponse(request, route.redirect);
    }
  }

  return null;
};

const isPublicRoute = (pathname: string): boolean =>
  PUBLIC_ROUTES.includes(pathname);
