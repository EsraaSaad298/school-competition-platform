import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the current school and user from cookies
  const currentSchool = request.cookies.get("currentSchool")?.value
  const currentUser = request.cookies.get("currentUser")?.value

  // If the user is not logged in and trying to access a protected route
  if (
    (!currentSchool || !currentUser) &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/api")
  ) {
    // Redirect to the login page
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If the user is logged in and trying to access the login page, redirect to competitions
  if (currentSchool && currentUser && request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/competitions", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - /api routes
     * - /_next (Next.js internals)
     * - /fonts, /images (static files)
     * - /_vercel (Vercel internals)
     * - /favicon.ico, /sitemap.xml (common static files)
     */
    "/((?!api|_next|_vercel|fonts|images|favicon.ico|sitemap.xml).*)",
  ],
}
