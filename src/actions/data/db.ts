// app/actions/data-actions.ts
'use server';

import {ProductType} from '@prisma/client';
import {db} from "@/lib/db";
import {FullProduct} from "@/models/product"; // Adjust import path

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
export async function getProducts(options?: { category?: string; type?: ProductType; }): Promise<FullProduct[]> {
    try {
        return await prisma.product.findMany({
            where: {
                ...(options?.category && {
                    categories: {
                        some: {
                            category: {slug: options.category},
                        },
                    },
                }),
                ...(options?.type && {type: options.type}),
            },
            include: {
                variants: {
                    include: {
                        size: true,
                        color: true,
                    },
                },
                images: true,
                categories: {
                    include: {
                        category: true,
                    },
                },
                reviews: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                image: true,
                            },
                        },
                    },
                },
            },
            orderBy: {createdAt: 'desc'},
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}

export async function getTopProducts(options?: { category?: string; type?: ProductType; }): Promise<FullProduct[]> {
    try {
        return await prisma.product.findMany({
            where: {
                ...(options?.category && {
                    categories: {
                        some: {
                            category: {slug: options.category},
                        },
                    },
                }),
                ...(options?.type && {type: options.type}),
            },
            include: {
                variants: {
                    include: {
                        size: true,
                        color: true,
                    },
                },
                images: true,
                categories: {
                    include: {
                        category: true,
                    },
                },
                reviews: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                image: true,
                            },
                        },
                    },
                },
            },
            orderBy: {createdAt: 'desc'},
            take: 4,
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
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

export async function getProductBySlug(slug: string): Promise<FullProduct | null> {
    try {
        return await prisma.product.findUnique({
            where: { slug },
            include: {
                variants: {
                    include: {
                        size: true,
                        color: true,
                    },
                },
                images: true,
                categories: {
                    include: {
                        category: true,
                    },
                },
                reviews: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                image: true,
                            },
                        },
                    },
                },
            },
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
//
// export async function getProductVariant(variantId: string) {
//     try {
//         return await prisma.productVariant.findUnique({
//             where: {id: variantId},
//             include: {
//                 product: {
//                     include: {
//                         images: true,
//                     },
//                 },
//                 size: true,
//                 color: true,
//             },
//         })
//     } catch (error) {
//         console.error("Error fetching product variant:", error)
//         return null
//     }
// }

export async function getProductVariant(productId: string, sizeValue: string, colorName: string) {
    try {
        // Fetch Size ID
        const size = await prisma.size.findUnique({
            where: { value: sizeValue },
            select: { id: true }
        });

        // Fetch Color ID
        const color = await prisma.color.findUnique({
            where: { name: colorName },
            select: { id: true }
        });

        if (!size || !color) {
            throw new Error("Size or Color not found");
        }

        // Fetch the Product Variant
        return await prisma.productVariant.findFirst({
            where: {
                productId: productId,
                sizeId: size.id,
                colorId: color.id,
            },
            include: {
                product: {
                    include: {
                        images: true,
                    },
                },
                size: true,
                color: true,
            },
        });

    } catch (error) {
        console.error("Error fetching product variant:", error);
        return null;
    }
}

export async function getColorByName(colorName: string) {
    return await prisma.color.findUnique({
        where: { name: colorName }
    });
}

export async function getSizeByValue(sizeValue: string) {
    return await prisma.size.findUnique({
        where: { value: sizeValue }
    });
}