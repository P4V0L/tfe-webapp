import { Button } from "@/components/ui/button"

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
                <img src={image || "/placeholder.svg"} alt="Hero image" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative h-full flex items-center justify-center text-center">
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-white">{title}</h1>
                    <Button size="lg" variant="destructive" asChild>
                        <a href={ctaLink}>{ctaText}</a>
                    </Button>
                </div>
            </div>
        </section>
    )
}

