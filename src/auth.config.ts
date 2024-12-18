import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import * as bcrypt from "bcryptjs";
import {getUserByEmail} from "@/data/user";
import {LoginSchema} from "@/schemas/login";

export default {
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: {  label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const validatedFields = LoginSchema.safeParse(credentials)

                if (validatedFields.success) {
                    const { email, password } = validatedFields.data;
                    const user = await getUserByEmail(email)

                    if (!user || !user.password) return null

                    const passwordMatch = await bcrypt.compare(password, user.password)

                    if (passwordMatch) return user
                }

                return null
            }
        })
    ]
} satisfies NextAuthConfig