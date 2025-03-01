import Link from "next/link";
import { Category } from "@prisma/client";

interface CategoriasProps {
    categories: Category[]
}

export const Categorias = ({ categories }: CategoriasProps) => {
    return (
        <section className="container mt-10">
            <h2 className="text-3xl font-serif font-bold mb-8 text-primary-foreground">Categorías</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                {categories.map((category) => (
                    <Link
                        key={category.name}
                        href={"/catalogo?category=" + category.slug}
                        className="relative h-[250px] overflow-hidden rounded-lg group"
                    >
                        <div className="absolute inset-0 bg-secondary-foreground/80 flex items-center justify-center group-hover:scale-105">
                            <h3 className="text-2xl font-serif font-bold text-white">{category.name}</h3>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}