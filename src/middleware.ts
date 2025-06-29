import { NextResponse, NextRequest } from 'next/server'

export { default } from "next-auth/middleware"
import { getToken } from "next-auth/jwt"


// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.JWT_SECRET })
    const url = request.nextUrl

    if (token && (
        url.pathname.startsWith('/home') ||
        url.pathname.startsWith('/about') ||
        url.pathname.startsWith('/contact') ||
        url.pathname.startsWith('/profile') ||  
        url.pathname.startsWith('/settings') ||
        url.pathname.startsWith('/messages') ||
        url.pathname.startsWith('/dashboard') ||
        url.pathname.startsWith('/signup') ||
        url.pathname.startsWith('/sign-in') ||
        url.pathname.startsWith('/')

    )) {
        // If the user is authenticated, allow access to the requested page
    return NextResponse.redirect(new URL('/dashboard', request.url))
    }


    return NextResponse.redirect(new URL('/home', request.url))
}



export const config = {
    matcher: [
        '/',
        '/home',
        '/about',
        '/contact',
        '/profile',
        '/settings',
        '/messages',
        '/signup',
        '/dashboard',
        'sign-in',
    ],
}