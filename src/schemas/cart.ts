import { z } from "zod"

export const addToCartSchema = z.object({
    productId: z.string(),
    variantId: z.string(),
    quantity: z.number().int().positive(),
    color: z.string(),
    size: z.string().optional().nullable(), // Make size optional and nullable
    image: z.string(),
    productName: z.string(),
    price: z.number().positive(),
})

export type AddToCartFormData = z.infer<typeof addToCartSchema>

