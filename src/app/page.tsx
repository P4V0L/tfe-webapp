'use client'

import {Hero} from "@/components/landing/Hero";
import {Categorias} from "@/components/landing/Categorias";
import {InfiniteTestimonials} from "@/components/landing/InfiniteTestimonials";
import {useEffect, useState } from "react";
import { TestimonialUser } from "@/models/testimonials";
import {getCategories, getTestimonials, getTopProducts} from "@/actions/data/db";
import {SessionProvider} from "next-auth/react";
import { Category } from "@prisma/client";
import {Card, CardContent} from "@/components/ui/card";
import {TopProduct} from "@/models/product";

const heroInfo = {
    title: "¡Rebajas de invierno! Hasta 50% de descuento",
    image: "https://placehold.co/600x400",
    ctaText: "Comprar Ahora",
    ctaLink: "/catalogo"
}

export default function Home() {
    const [testimonials, setTestimonials] = useState<TestimonialUser[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [productosDestacados, setProductosDestacados] = useState<TopProduct[]>([]);

    useEffect(() => {
        getTestimonials().then((res) => {
            if (res) {
                setTestimonials(res);
            }
        });

        getCategories().then((res) => {
            if (res) {
                setCategories(res);
            }
        });

        getTopProducts().then((res) => {
            if (res) {
                setProductosDestacados(res);
            }
        })
    }, []);

    return (
        <SessionProvider>
            <Hero {...heroInfo} />
            <Categorias categories={categories} />
            <section className="container mt-10">
                <h2 className="text-3xl font-serif font-bold mb-8 text-primary-foreground">Productos destacados</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {productosDestacados.map((product) => (
                        <Card key={product.id} className="overflow-hidden">
                            <CardContent className="p-0">
                                <img
                                    src={product.images?.[0] || "/placeholder.svg"}
                                    alt={product.name}
                                    className="w-full h-64 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="font-medium">{product.name}</h3>
                                    <p className="text-lg font-semibold text-primary">{product.basePrice}€</p>
                                    <div className="mt-2">
                                        {product.categories?.map((category, index) => (
                                            <span key={index} className="text-sm text-muted bg-accent py-1 px-2  rounded-xl">
                                                {category}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex items-center mt-2">
                                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: product.colors?.[0].hexCode }} />
                                        <span className="ml-2 text-sm">{product.colors?.[0].name}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
            <section className="container overflow-hidden mt-10">
                <h2 className="text-3xl font-serif font-bold mb-8 text-primary-foreground text-start">Testimonios de clientes</h2>
                {testimonials && <InfiniteTestimonials testimonials={testimonials} />}
            </section>
        </SessionProvider>
    );
}

