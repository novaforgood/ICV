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
import { NextResponse } from 'next/server'
import { getCookie } from 'cookies-next'

export function middleware(request: Request) {
    const idToken = getCookie('idToken', { req: request })

    if (!idToken) {
        // If no idToken is found, redirect to the login page
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Allow the request to proceed if the user is authenticated
    return NextResponse.next()
}

// Define the paths to which this middleware should apply
export const config = {
    matcher: ['/protected', '/protected/*'], // Add the protected paths here
}