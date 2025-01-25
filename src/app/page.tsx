'use client'

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { logout } from "@/actions/auth/logout";
import { useRouter } from "next/navigation";
import {Hero} from "@/components/landing/Hero";

const heroInfo = {
    title: "¡Rebajas de invierno! Hasta 50% de descuento",
    image: "https://placehold.co/600x400",
    ctaText: "Comprar Ahora",
    ctaLink: "/catalogo"
}

export default function Home() {
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push('/');
    }

    return (
        <>
            <Hero {...heroInfo} />
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
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

