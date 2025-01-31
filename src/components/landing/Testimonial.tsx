import {TestimonialUser} from "@/models/testimonials";
import {Card} from "@/components/ui/card";

interface TestimonialProps {
    testimonial: TestimonialUser
}

const Testimonial = ({testimonial}: TestimonialProps) => {
    return (
        <Card className="flex-shrink-0 w-[300px] text-center p-6">
            <img
                src={testimonial.image || "/placeholder.svg"}
                alt={""}
                className="w-16 h-16 rounded-full mx-auto mb-4"
            />
            <h3 className="font-medium mb-2">{testimonial.name}</h3>
            <p className="text-muted-foreground">&ldquo;{testimonial.content}&rdquo;</p>
        </Card>
    )
}

export default Testimonial