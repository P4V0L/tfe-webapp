'use client'

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { logout } from "@/actions/auth/logout";
import { useRouter } from "next/navigation";
import {Hero} from "@/components/landing/Hero";
import Test from "@/components/test";
import {InfiniteTestimonials} from "@/components/landing/InfiniteTestimonials";
import {useEffect, useState } from "react";
import { TestimonialUser } from "@/models/testimonials";
import { getTestimonials } from "@/actions/data/db";
import {SessionProvider, useSession} from "next-auth/react";

const heroInfo = {
    title: "¡Rebajas de invierno! Hasta 50% de descuento",
    image: "https://placehold.co/600x400",
    ctaText: "Comprar Ahora",
    ctaLink: "/catalogo"
}

export default function Home() {
    const router = useRouter();

    const [testimonials, setTestimonials] = useState<TestimonialUser[]>([]);


    useEffect(() => {
        getTestimonials().then((res) => {
            if (res) {
                setTestimonials(res);
            }
        });
    }, []);

    const handleLogout = async () => {
        await logout();
        router.push('/');
    }

    return (
        <SessionProvider>
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
            <section className="container overflow-hidden">
                <h2 className="text-3xl font-serif font-bold mb-8 text-primary text-center">Testimonios de clientes</h2>
                {testimonials && <InfiniteTestimonials testimonials={testimonials} />}
            </section>
        </SessionProvider>
    );
}

