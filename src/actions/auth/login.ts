"use server"

import { signIn } from "@/auth"
import {DEFAULT_LOGIN_REDIRECT} from "@/routes/routes";
import {AuthError} from "next-auth";
import {LoginSchema} from "@/schemas/auth/auth";

export const login = async (values: unknown) => {
    const validatedFields = LoginSchema.safeParse(values)

    if (!validatedFields.success) {
        return {error: "Invalid fields!"}
    }

    const { email, password } = validatedFields.data

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT
        })
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return {error: "Invalid credentials!"}
                default:
                    return {error: "Something went wrong!"}
            }
        }

        throw error
    }
}