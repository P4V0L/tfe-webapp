import { Suspense } from "react"
import { db as prisma } from "@/lib/db"
import { ProductsProvider } from "@/components/catalog/ProductsContext"
import { ProductGrid } from "@/components/catalog/ProductsGrid"
import {FilterSheet} from "@/components/catalog/FilterSheet";

interface CatalogPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function getFilters() {
    const [categories, colors] = await Promise.all([
        prisma.category.findMany({
            where: {
                parentId: null,
            },
            include: {
                children: true,
            },
        }),
        prisma.color.findMany(),
    ])

    return {
        categories,
        colors,
    }
}

async function getProducts(searchParams: Awaited<CatalogPageProps["searchParams"]>) {
    const category = Array.isArray(searchParams.category)
        ? searchParams.category
        : typeof searchParams.category === "string"
            ? searchParams.category.split(",")
            : []

    const color = Array.isArray(searchParams.color)
        ? searchParams.color
        : typeof searchParams.color === "string"
            ? searchParams.color.split(",")
            : []

    const minPrice = searchParams.minPrice ? Number(searchParams.minPrice) : undefined
    const maxPrice = searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined
    const page = searchParams.page ? Number(searchParams.page) : 1
    const sort = searchParams.sort ?? "newest"

    const itemsPerPage = 12

    const where: {
        AND: Array<{
            OR?: Array<{ categories: { some: { category: { OR: Array<{ slug: string } | { parent: { slug: string } }> } } } }>
            variants?: { some: { color: { name: { in: string[] } } } }
            basePrice?: { gte?: number, lte?: number }
        }>
    } = {
        AND: [],
    }


    if (category.length > 0) {
        where.AND.push({
            OR: category.map((cat) => ({
                categories: {
                    some: {
                        category: {
                            OR: [{ slug: cat }, { parent: { slug: cat } }],
                        },
                    },
                },
            })),
        })
    }

    if (color.length > 0) {
        where.AND.push({
            variants: {
                some: {
                    color: {
                        name: {
                            in: color,
                        },
                    },
                },
            },
        })
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
        where.AND.push({
            basePrice: {
                gte: minPrice,
                lte: maxPrice,
            },
        })
    }

    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where,
            include: {
                images: {
                    orderBy: {
                        order: "asc",
                    },
                },
                variants: {
                    include: {
                        color: true,
                        size: true,
                    },
                },
                categories: {
                    include: {
                        category: true,
                    },
                },
            },
            skip: (page - 1) * itemsPerPage,
            take: itemsPerPage,
            orderBy:
                sort === "price-desc"
                    ? { basePrice: "desc" }
                    : sort === "price-asc"
                        ? { basePrice: "asc" }
                        : { createdAt: "desc" },
        }),
        prisma.product.count({ where }),
    ])

    return {
        products,
        pagination: {
            total,
            pages: Math.ceil(total / itemsPerPage),
            current: page,
        },
    }
}

async function CatalogContent({ searchParams }: CatalogPageProps) {
    const resolvedSearchParams = await searchParams
    const [{ products, pagination }, { categories, colors }] = await Promise.all([
        getProducts(resolvedSearchParams),
        getFilters(),
    ])

    return (
        <ProductsProvider initialSearchParams={resolvedSearchParams}>
            <div className="container px-4 py-8">
                <div className="space-y-8">
                    <FilterSheet categories={categories} colors={colors} />
                    <ProductGrid products={products} pagination={pagination} />
                </div>
            </div>
        </ProductsProvider>
    )
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <CatalogContent searchParams={searchParams} />
        </Suspense>
    )
}

