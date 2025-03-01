import {
    Product as PrismaProduct,
    ProductVariant as PrismaProductVariant,
    ProductImage as PrismaProductImage,
    ProductCategory as PrismaProductCategory,
    Category as PrismaCategory,
    ProductReview as PrismaProductReview,
    User as PrismaUser,
    Size as PrismaSize,
    Color as PrismaColor,
    ProductType,
    ProductVariant,
    ProductImage,
    ProductCategory,
    ProductReview,
} from '@prisma/client';

export interface TopProduct {
    id: string;
    name: string;
    description: string;
    basePrice: number;
    type: ProductType;
    slug: string;
    allowedSizeTypes: SizeType[];
    createdAt: Date;
    updatedAt: Date;
    colors: ColorType[];
    images: string[];
    categories: string[];
    variants: { size: string; stock: number; price: number; }[]; // Add the variants property
}

export interface ColorType {
    id: string;
    name: string;
    hexCode: string;
}

export interface SizeType {
    id: string;
    value: string;
}

export interface ExtendedProductVariant extends ProductVariant {
    size: SizeType | null;
    color: ColorType | null;
}


export interface CompleteProduct {
    id: string;
    name: string;
    description: string | null;
    basePrice: number | null;
    type: ProductType;
    slug: string;
    allowedSizeTypes: SizeType[];
    specifications: JSON; // specifications is stored as JSON in the DB; adjust as needed
    createdAt: Date;
    updatedAt: Date;
    variants: ExtendedProductVariant[];
    images: ProductImage[];
    categories: ProductCategory[];
    reviews: ProductReview[];
}




/**
 * The FullProduct type extends the basic Prisma Product type
 * and includes all the relational data that you typically load
 * when fetching a product (e.g., variants, images, categories, reviews).
 */
export interface FullProduct extends PrismaProduct {
    variants: Array<
        PrismaProductVariant & {
        // The size or color might be null if not assigned
        size?: PrismaSize | null;
        color?: PrismaColor | null;
    }
    >;
    images: PrismaProductImage[];
    categories: Array<
        PrismaProductCategory & {
        // Include the full category data in the join model
        category: PrismaCategory;
    }
    >;
    reviews: Array<
        PrismaProductReview & {
        // Only select the needed user properties (as in your queries)
        user: Pick<PrismaUser, 'name' | 'image'>;
    }
    >;
}