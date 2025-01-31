export interface TestimonialUser {
    id: string
    name: string | null
    image: string | null
    content: string
    rating: number
    approved: boolean
}