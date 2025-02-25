// import { NextRequest, NextResponse } from "next/server";
// import { getAuthenticatedAppForUser } from "../lib/serverApp";
// import { match } from "assert";


// export async function middleware(req: NextRequest) {
//     try {
//         await getAuthenticatedAppForUser()
//         console.log("this should not print if signed out")
//         return NextResponse.next()
//     } catch (error){
//         console.error("authentication error", error)

//         //if auth fails, return 401 unauthorized response
//         return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }
// }
// export const config = {
//     matchers: '/api/:path*', //protect all api routes
// }
import { NextResponse, NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
   
    const idToken = request.cookies.get('idToken')?.value

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
        /*
         * Match all request paths except for the ones starting with:
         * - login (auth page)
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!login|api|_next/static|_next/image|favicon.ico).*)'
    ]
}