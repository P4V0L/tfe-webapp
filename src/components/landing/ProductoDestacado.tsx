"use client";  // <--- add this

import { Card, CardContent } from "@/components/ui/card";
import { TopProduct } from "@/models/product";
import Image from "next/image";

interface ProductoDestacadoProps {
    product: TopProduct;
}

export default function ProductoDestacado({ product }: ProductoDestacadoProps) {
    if (!product) {
        return null;
    }

    return (
        <Card key={product.id} className="overflow-hidden">
            <CardContent className="p-0">
                <Image
                    src={product.images?.[0] || "/placeholder.svg"}
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
                                {category}
                            </span>
                        ))}
                    </div>
                    <div className="flex items-center mt-2">
                        {product.colors?.[0] && (
                            <>
                                <div
                                    className="w-4 h-4 rounded-full"
                                    style={{
                                        backgroundColor: product.colors[0].hexCode,
                                    }}
                                />
                                <span className="ml-2 text-sm">
                                    {product.colors[0].name}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}