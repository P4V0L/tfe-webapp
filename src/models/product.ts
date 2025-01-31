import { Color } from "@prisma/client";

export interface TopProduct {
    id: string;
    name: string;
    description: string;
    basePrice: number;
    type: string;
    allowedSizeTypes: string[];
    createdAt: Date;
    updatedAt: Date;
    categories: string[];
    colors: Color[];
    images: string[];
}