import * as z from "zod";

export const contactSchema = z.object({
    fullName: z.string().min(2, "El nombre es requerido"),
    email: z.string().email("Email inválido"),
    phone: z.string().min(6, "Teléfono inválido"),
    smsUpdates: z.boolean().default(false),
});

export const shippingSchema = z.discriminatedUnion("deliveryMethod", [
    z.object({
        deliveryMethod: z.literal("delivery"),
        deliverySpeed: z.enum(["standard", "fast", "express"]),
        firstName: z.string().min(2, "Nombre requerido"),
        lastName: z.string().min(2, "Apellido requerido"),
        address: z.string().min(5, "Dirección requerida"),
        address2: z.string().optional(),
        city: z.string().min(2, "Ciudad requerida"),
        postalCode: z.string().min(5, "Código postal requerido"),
        state: z.string().min(2, "Provincia requerida"),
    }),
    z.object({
        deliveryMethod: z.literal("pickup"),
        deliverySpeed: z.enum(["standard", "fast", "express"]),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        address: z.string().optional(),
        address2: z.string().optional(),
        city: z.string().optional(),
        postalCode: z.string().optional(),
        state: z.string().optional(),
    }),
]);

export const paymentSchema = z.discriminatedUnion("paymentMethod", [
    z.object({
        paymentMethod: z.literal("card"),
        cardNumber: z.string().regex(/^\d{16}$/, "Número de tarjeta inválido"),
        expiryDate: z.string().regex(/^\d{2}\/\d{2}$/, "Fecha inválida"),
        cvv: z.string().regex(/^\d{3,4}$/, "CVV inválido"),
        useShippingAsBilling: z.boolean().default(true),
    }),
    z.object({
        paymentMethod: z.literal("paypal"),
        cardNumber: z.string().optional(),
        expiryDate: z.string().optional(),
        cvv: z.string().optional(),
        useShippingAsBilling: z.boolean().default(true),
    }),
]);

export const checkoutSchema = z.object({
    contact: contactSchema,
    shipping: shippingSchema,
    payment: paymentSchema,
    promoCode: z.string().optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;