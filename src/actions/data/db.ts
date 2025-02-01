// app/actions/data-actions.ts
'use server';

import {Color, ProductType} from '@prisma/client';
import {db} from "@/lib/db"; // Adjust import path

const prisma = db

// User Actions
export async function getUsers() {
    try {
        return await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                createdAt: true,
                testimonials: true,
                reviews: true
            },
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}

// Testimonial Actions
export async function getTestimonials() {
    try {
        const testimonials = await prisma.testimonial.findMany({
            where: { approved: true },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return testimonials.map((t) => ({
            ...t,
            name: t.user.name,
            image: t.user.image,
            // optionally remove the nested user if you don't want it
            user: undefined,
        }));
    } catch (error) {
        console.error("Error fetching testimonials:", error);
        throw error;
    }
}

// Product Actions
export async function getProducts(options?: {
    includeRelations?: boolean;
    category?: string;
    type?: ProductType;
}) {
    try {
        return await prisma.product.findMany({
            where: {
                ...(options?.category && {
                    categories: {
                        some: {
                            category: {
                                slug: options.category
                            }
                        }
                    }
                }),
                ...(options?.type && { type: options.type })
            },
            include: {
                variants: options?.includeRelations,
                images: options?.includeRelations,
                categories: options?.includeRelations ? {
                    include: {
                        category: true
                    }
                } : false,
                reviews: options?.includeRelations
            },
            orderBy: { createdAt: 'desc' }
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}


export async function getTopProducts() {
    const products = await prisma.product.findMany({
        include: {
            variants: {
                select: { color: true },
            },
            images: {
                select: { url: true },
            },
            categories: {
                include: {
                    category: {
                        select: { name: true },
                    },
                },
            },
        },
        take: 4
    });

    return products.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description ?? "",
        basePrice: product.basePrice ?? 0,
        type: product.type,
        slug: product.slug,
        allowedSizeTypes: product.allowedSizeTypes,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        // Filter out null
        colors: product.variants
            .map((variant) => variant.color)
            .filter((color): color is Color => color !== null),

        images: product.images.map((image) => image.url),
        categories: product.categories.map((c) => c.category.name),
    }));
}

export async function getProductById(id: string) {
    try {
        return await prisma.product.findUnique({
            where: { id },
            include: {
                variants: {
                    include: {
                        size: true,
                        color: true
                    }
                },
                images: true,
                categories: {
                    include: {
                        category: true
                    }
                },
                reviews: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                image: true
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
}

export async function getProductBySlug(slug: string) {
    try {
        return await prisma.product.findUnique({
            where: { slug },
            include: {
                variants: {
                    include: {
                        size: true,
                        color: true
                    }
                },
                images: true,
                categories: {
                    include: {
                        category: true
                    }
                },
                reviews: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                image: true
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error fetching product by slug:', error);
        throw error;
    }
}

// Review Actions
export async function getProductReviews(productId: string) {
    try {
        return await prisma.productReview.findMany({
            where: { productId },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    } catch (error) {
        console.error('Error fetching product reviews:', error);
        throw error;
    }
}

// Category Actions
export async function getCategories() {
    try {
        return await prisma.category.findMany({
            include: {
                children: true,
                parent: true
            }
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
}

export async function getProductsByCategory(slug: string) {
    try {
        return await prisma.product.findMany({
            where: {
                categories: {
                    some: {
                        category: {
                            slug
                        }
                    }
                }
            },
            include: {
                images: true,
                variants: true
            }
        });
    } catch (error) {
        console.error('Error fetching products by category:', error);
        throw error;
    }
}

// Cart Actions
export async function getCartByUserId(userId: string) {
    try {
        return await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        productVariant: {
                            include: {
                                product: true,
                                size: true,
                                color: true
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error fetching cart:', error);
        throw error;
    }
}

export async function createCartItem(cartId: string, productVariantId: string) {
    try {
        return await prisma.cartItem.create({
            data: {
                cartId,
                productVariantId,
                quantity: 1
            }
        });
    } catch (error) {
        console.error('Error creating cart item:', error);
        throw error;
    }
}

export async function updateCartItemQuantity(id: string, quantity: number) {
    try {
        return await prisma.cartItem.update({
            where: { id },
            data: { quantity }
        });
    } catch (error) {
        console.error('Error updating cart item quantity:', error);
        throw error;
    }
}

export async function deleteCartItem(id: string) {
    try {
        return await prisma.cartItem.delete({
            where: { id }
        });
    } catch (error) {
        console.error('Error deleting cart item:', error);
        throw error;
    }
}

// Admin Actions
export async function toggleTestimonialApproval(id: string) {
    try {
        const testimonial = await prisma.testimonial.findUnique({ where: { id } });
        return await prisma.testimonial.update({
            where: { id },
            data: { approved: !testimonial?.approved }
        });
    } catch (error) {
        console.error('Error toggling testimonial approval:', error);
        throw error;
    }
}