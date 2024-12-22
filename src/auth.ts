import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import NextAuth from "next-auth";
import {getUserById} from "@/actions/data/user";

export const {
    handlers,
    signIn,
    signOut,
    auth
} = NextAuth({
    callbacks: {
        async session({ token, session }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            if (session.user) {
                session.user.email = token.email as string;
            }
            return session;
        },
        async jwt({ token }) {
            if (!token.sub) return token;

            const existingUser = await getUserById(token.sub);
            if (!existingUser) return token;

            token.email = existingUser.email || "";
            return token;
        }
    },
    adapter: PrismaAdapter(db),
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60, //1 day
    },
    ...authConfig
});