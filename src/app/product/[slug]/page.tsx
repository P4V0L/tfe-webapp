import { notFound } from "next/navigation"
import { ProductGallery } from "@/components/product/ProductGallery"
import { ProductInfo } from "@/components/product/ProductInfo"
import { ProductReviews } from "@/components/product/ProductReviews"
import {getProductBySlug} from "@/actions/data/db";

interface PageProps {
    params: Promise<{ slug: string }>
}

export default async function ProductPage({
    params,
}: PageProps ) {
    const product = await getProductBySlug((await params).slug)

    if (!product) {
        notFound()
    }

    console.log(product)

    return (
        <div className="container px-4 py-8 ">
            <div className="grid lg:grid-cols-2 gap-8">
                <ProductGallery images={product.images} />
                <ProductInfo product={product} />
            </div>
            <ProductReviews reviews={product.reviews} />
        </div>
    )
}

