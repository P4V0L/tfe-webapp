import { z } from "zod"

export const baseProductSchema = z.object({
    name: z.string().min(1, "El nombre del producto es requerido"),
    color: z.string().min(1, "El color es requerido"),
    quantity: z.number().int().positive("La cantidad debe ser un número positivo"),
})

export const productWithSizeSchema = baseProductSchema.extend({
    size: z.string().min(1, "La talla es requerida"),
})

export type BaseProductSchema = z.infer<typeof baseProductSchema>
export type ProductWithSizeSchema = z.infer<typeof productWithSizeSchema>

