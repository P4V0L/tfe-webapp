import { z } from "zod"

const stringOrArraySchema = z
    .union([z.string(), z.array(z.string()), z.undefined()])
    .transform((val) =>
        Array.isArray(val) ? val.filter(Boolean) : typeof val === "string" ? val.split(",").filter(Boolean) : [],
    )

const numberOrStringSchema = z.union([z.number(), z.string(), z.undefined()]).transform((val) => {
    if (typeof val === "number") return val
    if (typeof val === "string") {
        const parsed = Number.parseFloat(val)
        return isNaN(parsed) ? undefined : parsed
    }
    return undefined
})

export const catalogSearchParamsSchema = z
    .object({
        category: stringOrArraySchema.default([]),
        color: stringOrArraySchema.default([]),
        minPrice: numberOrStringSchema.optional(),
        maxPrice: numberOrStringSchema.optional(),
        page: z
            .union([z.string(), z.number(), z.undefined()])
            .transform((val) => {
                if (typeof val === "number") return val
                if (typeof val === "string") {
                    const parsed = Number.parseInt(val, 10)
                    return isNaN(parsed) ? 1 : parsed
                }
                return 1
            })
            .default(1),
        sort: z.enum(["newest", "price-asc", "price-desc"]).optional().default("newest"),
    })
    .catchall(z.unknown())

export type CatalogSearchParams = z.infer<typeof catalogSearchParamsSchema>

