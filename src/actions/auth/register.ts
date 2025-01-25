"use server"

import {RegisterSchema} from "@/schemas/auth/auth";
import {z} from "zod";
import bcrypt from "bcryptjs";
import {db} from "@/lib/db";
import {getUserByEmail} from "@/actions/data/user";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    console.log('Registering user', values)
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { email, password, name } = validatedFields.data;
    console.log(validatedFields.data)
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email)

    if (existingUser) {
        return { error: "User already exists!" }
    }

    await db.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
        }
    })

    return { success: "Usuario registrado correctamente!"}
}