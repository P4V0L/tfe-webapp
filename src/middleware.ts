import { NextResponse } from "next/server";
import { auth } from "@/auth"; // Ensure this points to your auth configuration
import {
    DEFAULT_LOGIN_REDIRECT,
    apiAuthPrefix,
    authRoutes,
    publicRoutes,
} from "@/routes/routes";

export default auth(async (req) => {
    const { nextUrl } = req;
    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname) || nextUrl.pathname.startsWith('/admin') || nextUrl.pathname.startsWith('/product/');
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    // Retrieve the token from the request
    const token = req.auth;

    // Check if the token exists and is not expired
    const isLoggedIn = !!token;
    const isTokenExpired = token?.expires ? Date.now() >= new Date(token.expires).getTime() : true;

    if (isApiAuthRoute) {
        return NextResponse.next();
    }

    if (isAuthRoute) {
        if (isLoggedIn && !isTokenExpired) {
            return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }
        return NextResponse.next();
    }

    if ((!isLoggedIn || isTokenExpired) && !isPublicRoute) {
        return NextResponse.redirect(new URL('/auth/login', nextUrl));
    }

    return NextResponse.next();
});

// Optionally, don't invoke Middleware on some paths
export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};