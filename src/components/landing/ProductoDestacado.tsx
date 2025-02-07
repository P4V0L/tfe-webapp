"use client";  // <--- add this

import { Card, CardContent } from "@/components/ui/card";
import {FullProduct} from "@/models/product";
import Image from "next/image";
import Link from "next/link";

interface ProductoDestacadoProps {
    product: FullProduct;
}

export default function ProductoDestacado({ product }: ProductoDestacadoProps) {
    if (!product) {
        return null;
    }

    const colors = product.variants.map((variant) => variant.color).filter((color) => Boolean(color));

    return (
        <Link href={`/product/${product.slug}`}>
        <Card key={product.id} className="overflow-hidden">
            <CardContent className="p-0">
                <Image
                    src={product.images[0].url || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                    width={500}
                    height={300}
                />
                <div className="p-4">
                    <h3 className="font-medium">{product.name.split('-')[0]}</h3>
                    <p className="text-lg font-semibold text-primary">
                        {product.basePrice}€
                    </p>
                    <div className="mt-2">
                        {product.categories?.map((category, index) => (
                            <span
                                key={index}
                                className="text-sm text-muted bg-accent py-1 px-2 rounded-xl"
                            >
                                {category.category.name}
                            </span>
                        ))}
                    </div>
                    <div className="flex items-center mt-2">
                        {colors && (
                            colors.map((color) => (
                                <div
                                    key={color?.id}
                                    className="w-4 h-4 rounded-full"
                                    style={{
                                        backgroundColor: color?.hexCode,
                                    }}
                                />
                            ))
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
        </Link>
    );
}