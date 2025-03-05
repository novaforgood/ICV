import { NextResponse, NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
   return NextResponse.redirect(new URL('/login', request.url))
}

export const config = {
    matcher: '/examples/:path*',
}