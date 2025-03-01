"use client"

import Image from "next/image"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface ProductGalleryProps {
    images: {
        id: string;
        order: number;
        url: string;
        createdAt: Date;
        productId: string;
        altText: string | null;
    }[]
}

export function ProductGallery({ images }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(images[0])

    return (
        <div className="space-y-4">
            <Card>
                <CardContent className="p-0">
                    <AspectRatio ratio={1}>
                        <Image
                            src={selectedImage.url || "/placeholder.svg"}
                            alt={selectedImage.altText || ""}
                            className="object-cover rounded-lg"
                            fill
                            priority
                            sizes="(min-width: 1024px) 50vw, 100vw"
                        />
                    </AspectRatio>
                </CardContent>
            </Card>

            <ScrollArea className="w-full whitespace-nowrap rounded-lg">
                <div className="flex gap-2 pb-4">
                    {images.map((image) => (
                        <Card
                            key={image.id}
                            className={cn(
                                "inline-block w-[100px] shrink-0 cursor-pointer transition-colors hover:bg-secondary",
                                selectedImage.id === image.id && "ring-2 ring-primary",
                            )}
                            onClick={() => setSelectedImage(image)}
                        >
                            <CardContent className="p-0">
                                <AspectRatio ratio={1}>
                                    <Image
                                        src={image.url || "/placeholder.svg"}
                                        alt={image.altText || ""}
                                        className="object-cover rounded-lg"
                                        fill
                                        sizes="100px"
                                    />
                                </AspectRatio>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    )
}

