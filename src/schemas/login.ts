import * as z from "zod";

export const LoginSchema = z.object({
    email: z.string().email().min(1, {
        message: "Indica un usuario",
    }),
    password: z.string().min(1, {
        message: "Indica una contraseña",
    }),
    code: z.optional(z.string()),
});
