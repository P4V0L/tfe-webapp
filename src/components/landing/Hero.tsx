import { Button } from "@/components/ui/button"
import Image from "next/image";

interface HeroProps {
    title: string
    image: string
    ctaText: string
    ctaLink: string
}

export function Hero({ title, image, ctaText, ctaLink }: HeroProps) {
    return (
        <section className="relative h-[600px] -mt-8">
            <div className="absolute inset-0">
                <Image
                    src={image || "/placeholder.svg"}
                    alt="Hero image"
                    width={1920}
                    height={1080}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative h-full flex items-center justify-center text-center">
                <div className="space-y-4">
                    <h1 className="text-xl md:text-5xl font-serif font-bold text-white">{title}</h1>
                    <Button size="lg" variant="destructive" asChild>
                        <a href={ctaLink}>{ctaText}</a>
                    </Button>
                </div>
            </div>
        </section>
    )
}

