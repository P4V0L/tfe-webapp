import { Prisma } from "@prisma/client";

/**
 * Standard include configuration for product queries.
 * Includes variants with size/color, images, categories, and reviews with user info.
 */
export const productInclude = {
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
} satisfies Prisma.ProductInclude;

/**
 * Minimal include configuration for cart items.
 * Includes product variant with product, size, and color information.
 */
export const cartItemInclude = {
  productVariant: {
    include: {
      product: true,
      size: true,
      color: true,
    },
  },
} satisfies Prisma.CartItemInclude;
