// auth.ts
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { getUserById } from "@/data/user";
import NextAuth from "next-auth";

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

            return session;
        },
        async jwt({ token }) {
            if (!token.sub) return token;

            const existingUser = await getUserById(token.sub);
            if (!existingUser) return token;

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