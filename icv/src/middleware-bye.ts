import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedAppForUser } from "./lib/serverApp";
import { match } from "assert";


export async function middleware(req: NextRequest) {
    try {
        await getAuthenticatedAppForUser()

        return NextResponse.next()
    } catch (error){
        console.error("authentication error", error)

        //if auth fails, return 401 unauthorized response
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
}
export const config = {
    matchers: '/api/:path*', //protect all api routes
}