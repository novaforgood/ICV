import { NextResponse, NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const idToken = request.cookies.get('idToken')?.value

    // For debugging middleware execution
    console.log("Middleware executed for:", request.nextUrl.pathname)
    console.log("Request URL:", request.url)
    console.log("Cookies:", request.cookies.toString())
    console.log("ID Token exists:", !!idToken)
    
    if (!idToken || idToken.trim() === '') {
        console.log("No valid token found, redirecting to login")
        // Use a 307 temporary redirect to preserve the request method
        return NextResponse.redirect(new URL('/login', request.url), { status: 307 })
    }

    console.log("Token found, allowing request to proceed")
    return NextResponse.next()
}

// Define the paths to which this middleware should apply
export const config = {
    // Match all paths except login, static assets, API routes, etc.
    matcher: [
        '/((?!login|api|_next/static|_next/image|favicon.ico).*)'
    ]
} 