"use client"

import { useState } from "react"
import Testimonial from "@/components/landing/Testimonial";

export function InfiniteTestimonials({ testimonials }: { testimonials: any[] }) {
    // Double the testimonials array to create a seamless loop
    const doubledTestimonials = [...testimonials, ...testimonials]
    const [isHovered, setIsHovered] = useState(false)


    return (
        <div
            className="relative w-full overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                className={`flex gap-6 animate-scroll ${isHovered ? "pause-animation" : ""}`}
                style={{
                    width: `${doubledTestimonials.length * 320}px`,
                }}
            >
                {doubledTestimonials.map((testimonial, index) => (
                    <Testimonial testimonial={testimonial} key={`${testimonial.userId}-${index}`} />
                ))}
            </div>
        </div>
    )
}

