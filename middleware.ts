import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['en', 'es', 'fr', 'hi']
const defaultLocale = 'en'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Check if the request is for static files or API
  if (pathname.includes('api') || 
      pathname.includes('_next') || 
      pathname.includes('favicon.ico')) {
    return NextResponse.next()
  }

  // Check if pathname starts with a locale
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  // Allow paths that already have a locale
  if (pathnameHasLocale) return NextResponse.next()

  // If pathname is root, serve the landing page
  if (pathname === '/') {
    return NextResponse.next() // Allow access to the landing page
  }

  // For any other path without locale, redirect to the default locale
  return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, request.url))
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!api|_next/static|_next/image|fonts|favicon.ico).*)',
  ],
}