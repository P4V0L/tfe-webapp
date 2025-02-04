"use client"

import { Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

interface ProductReviewsProps {
    reviews: {
        id: string;
        rating: number;
        comment: string;
        user: {
            id: string;
            name: string;
            image: string | null;
        };
    }[]
}

export function ProductReviews({ reviews }: ProductReviewsProps) {
    const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    const ratingCounts = reviews.reduce(
        (acc, review) => {
            acc[review.rating] = (acc[review.rating] || 0) + 1
            return acc
        },
        {} as Record<number, number>,
    )

    return (
        <div className="mt-16">
            <h2 className="text-2xl font-bold tracking-tight mb-8 text-primary-foreground">Reseñas de Clientes</h2>
            <div className="grid md:grid-cols-[300px_1fr] gap-8">
                <Card className="h-fit">
                    <CardHeader>
                        <CardTitle>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-primary">{averageRating.toFixed(1)}</span>
                                <span className="text-lg text-muted-foreground">/5.0</span>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {[5, 4, 3, 2, 1].map((rating) => (
                                <HoverCard key={rating}>
                                    <HoverCardTrigger asChild>
                                        <div className="flex items-center gap-2 group cursor-help">
                                            <div className="w-18 text-sm text-muted-foreground group-hover:text-primary">
                                                {rating} estrellas
                                            </div>
                                            <Progress value={((ratingCounts[rating] || 0) / reviews.length) * 100} className="flex-1 h-2" />
                                            <div className="w-12 text-sm text-right text-muted-foreground">
                                                {Math.round(((ratingCounts[rating] || 0) / reviews.length) * 100)}%
                                            </div>
                                        </div>
                                    </HoverCardTrigger>
                                    <HoverCardContent>
                                        <div className="text-sm">
                                            {ratingCounts[rating] || 0} reseñas con {rating} estrellas
                                        </div>
                                    </HoverCardContent>
                                </HoverCard>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    {reviews.map((review, index) => (
                        <div key={review.id}>
                            {index > 0 && <Separator className="my-6" />}
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <Avatar>
                                        <AvatarImage src={review.user.image || undefined} />
                                        <AvatarFallback>{review.user.name?.[0] || "?"}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-semibold text-foreground">{review.user.name}</div>
                                        <div className="flex">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${
                                                        i < review.rating ? "fill-primary text-primary" : "text-muted-foreground"
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {review.comment && <p className="text-muted-foreground">{review.comment}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

