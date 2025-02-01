"use server"

import {db as prisma} from "@/lib/db";

export async function searchProducts(searchTerm: string) {
    const products = await prisma.product.findMany({
        where: {
            OR: [
                { name: { contains: searchTerm, mode: "insensitive" } },
                { description: { contains: searchTerm, mode: "insensitive" } },
            ],
        },
        select: {
            id: true,
            name: true,
            slug: true,
            basePrice: true,
            images: {
                select: {
                    url: true,
                },
                take: 1,
            },
            categories: {
                select: {
                    category: {
                        select: {
                            name: true,
                        },
                    },
                },
                take: 1,
            },
        },
        take: 8,
    })

    return products.map((product) => ({
        ...product,
        price: product.basePrice ?? 0,
        category: {
            name: product.categories[0]?.category.name || "Sin categoría",
        },
    }))
}