import {TestimonialUser} from "@/models/testimonials";
import {Card} from "@/components/ui/card";
import Image from "next/image";

interface TestimonialProps {
    testimonial: TestimonialUser
}

const Testimonial = ({testimonial}: TestimonialProps) => {
    return (
        <Card className="flex-shrink-0 w-[300px] text-center p-6">
            <Image
                src={testimonial.image || "/placeholder.svg"}
                alt={testimonial.name || "User image"}
                width={64} height={64}
                className="rounded-full mx-auto mb-4"
            />
            <h3 className="font-medium mb-2">{testimonial.name}</h3>
            <p className="text-muted-foreground">&ldquo;{testimonial.content}&rdquo;</p>
        </Card>
    )
}

export default Testimonial