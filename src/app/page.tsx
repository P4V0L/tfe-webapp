'use client'

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { logout } from "@/actions/auth/logout";
import { useRouter } from "next/navigation";
import {Hero} from "@/components/landing/Hero";
import {Categorias} from "@/components/landing/Categorias";

const heroInfo = {
    title: "¡Rebajas de invierno! Hasta 50% de descuento",
    image: "https://placehold.co/600x400",
    ctaText: "Comprar Ahora",
    ctaLink: "/catalogo"
}

export default function Home() {
    const router = useRouter();

    const categories = [
        {
            name: "Ropa Mujer",
            image: "",
            href: "/catalogo?category=mujer",
        },
        {
            name: "Ropa Hombre",
            image: "",
            href: "/catalogo?category=hombre",
        },
        {
            name: "Accesorios",
            image: "",
            href: "/catalogo?category=accesorios",
        },
        {
            name: "Novedades",
            image: "",
            href: "/catalogo?category=novedades",
        },
    ]

    const handleLogout = async () => {
        await logout();
        router.push('/');
    }

    return (
        <>
            <Hero {...heroInfo} />
            <Categorias categories={categories} />
            <div className="flex flex-col items-center justify-center fit-content gap-4 mt-10">
                <Link href="/auth/login" passHref>
                    <Button>
                        Go to Login
                    </Button>
                </Link>
                <Link href="/auth/register" passHref>
                    <Button>
                        Go to Register
                    </Button>
                </Link>
                <form action={handleLogout}>
                    <Button type="submit">
                        Logout
                    </Button>
                </form>
            </div>
        </>

    );
}

