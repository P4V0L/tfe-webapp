import { NextResponse } from "next/server";
import { auth } from "@/auth";
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

    const token = req.auth;

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

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};