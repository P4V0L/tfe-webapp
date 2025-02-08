"use client"

import type { Product, ProductImage, ProductVariant } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"
import { useProducts } from "./ProductsContext"
import { Button } from "@/components/ui/button"

interface ExtendedProduct extends Product {
    images: ProductImage[]
    variants: (ProductVariant & {
        color: { name: string; hexCode: string } | null
        size: { value: string } | null
    })[]
}

interface ProductGridProps {
    products: ExtendedProduct[]
    pagination: {
        total: number
        pages: number
        current: number
    }
}

export function ProductGrid({ products, pagination }: ProductGridProps) {
    const { updateFilters } = useProducts()

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div key={product.id} className="group relative">
                        <Link href={`/product/${product.slug}`} className="block">
                            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                <Image
                                    src={product.images[0]?.url || "/placeholder.svg"}
                                    alt={product.name}
                                    width={400}
                                    height={400}
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <div className="mt-4 space-y-1">
                                <h3 className="text-sm font-medium">{product.name.split('-')[0]}</h3>
                                <p className="text-lg font-bold">{product.basePrice?.toFixed(2)} €</p>
                            </div>
                        </Link>
                        <div className="mt-2 flex gap-1">
                            {product.variants
                                .filter((v) => v.color)
                                .map((variant) => (
                                    <div
                                        key={variant.id}
                                        className="w-6 h-6 rounded-full border-2 border-white ring-1 ring-gray-200"
                                        style={{ backgroundColor: variant.color!.hexCode }}
                                        title={variant.color!.name}
                                    />
                                ))}
                        </div>
                    </div>
                ))}
            </div>

            {pagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                        <Button
                            key={page}
                            variant={page === pagination.current ? "default" : "outline"}
                            size="icon"
                            onClick={() => updateFilters({ page: page })}
                        >
                            {page}
                        </Button>
                    ))}
                </div>
            )}

        </div>


)
}

