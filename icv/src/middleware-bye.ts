// import { NextRequest, NextResponse } from 'next/server'

// export async function middleware(req: NextRequest) {
//     // Extract the Firebase Auth token from headers or cookies
//     // await auth.authStateReady()
//     // if (!auth.currentUser) {
//     //     return NextResponse.next()
//     // }

//     console.log('INSIDE MIDDLEWARE')
//     console.log('Middleware is running:', req.nextUrl.pathname)

//     // const token = await getIdToken(auth.currentUser)
//     const token = 'MEOW'

//     if (token) {
//         // Clone the request and set the Authorization header
//         const requestHeaders = new Headers(req.headers)
//         requestHeaders.set('Authorization', `Bearer ${token}`)

//         return NextResponse.next({
//             request: {
//                 headers: requestHeaders,
//             },
//         })
//     }

//     return NextResponse.next()
// }

// // Apply middleware to all routes or specific routes
// export const config = {
//     matcher: ['/:path*'],
// }
