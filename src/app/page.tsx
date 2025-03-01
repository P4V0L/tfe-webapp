'use client'

import {Hero} from "@/components/landing/Hero";
import {Categorias} from "@/components/landing/Categorias";
import {InfiniteTestimonials} from "@/components/landing/InfiniteTestimonials";
import {useEffect, useState } from "react";
import { TestimonialUser } from "@/models/testimonials";
import {getCategories, getTestimonials, getTopProducts} from "@/actions/data/db";
import { Category } from "@prisma/client";
import {FullProduct} from "@/models/product";
import ProductoDestacado from "@/components/landing/ProductoDestacado";

const heroInfo = {
    title: "¡Rebajas de invierno! Hasta 50% de descuento",
    image: "https://placehold.co/600x400",
    ctaText: "Comprar Ahora",
    ctaLink: "/catalogo"
}

export default function Home() {
    const [testimonials, setTestimonials] = useState<TestimonialUser[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [productosDestacados, setProductosDestacados] = useState<FullProduct[]>([]);

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
        <>
            <Hero {...heroInfo} />
            <Categorias categories={categories} />
            <section className="container mt-10">
                <h2 className="text-3xl font-serif font-bold mb-8 text-primary-foreground">Productos destacados</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {productosDestacados.map((product) => (
                        <ProductoDestacado key={product.id} product={product} />
                    ))}
                </div>
            </section>
            <section className="container overflow-hidden mt-10">
                <h2 className="text-3xl font-serif font-bold mb-8 text-primary-foreground text-start">Testimonios de clientes</h2>
                {testimonials && <InfiniteTestimonials testimonials={testimonials} />}
            </section>
        </>
    );
}

