import * as z from "zod";

export const LoginSchema = z.object({
    email: z.string().email().min(1, {
        message: "Indica un email",
    }),
    password: z.string().min(1, {
        message: "Indica una contraseña",
    }),
    code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
    email: z.string().email().min(1,{
        message: "Indica un email",
    }),
    password: z.string().min(6, {
        message: "La contraseña debe tener al menos 6 caracteres",
    }),
    name: z.string().min(1, {
        message: "Indica un nombre",
    }),
});