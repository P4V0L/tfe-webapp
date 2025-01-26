import Link from "next/link";
import Image from "next/image";

interface CategoriasProps {
    categories: {
        name: string;
        href: string;
        image?: string;
    }[];
}

export const Categorias = ({ categories }: CategoriasProps) => {
    return (
        <section className="container mt-10">
            <h2 className="text-3xl font-serif font-bold mb-8 text-primary-foreground">Categorías</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categories.map((category) => (
                    <Link
                        key={category.name}
                        href={category.href}
                        className="relative h-[300px] overflow-hidden rounded-lg group"
                    >
                        <Image
                            src={category.image || "/placeholder.svg"}
                            alt={category.name}
                            height={300}
                            width={300}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <h3 className="text-2xl font-serif font-bold text-white">{category.name}</h3>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}