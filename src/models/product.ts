import { Color } from "@prisma/client";

export interface TopProduct {
    id: string;
    name: string;
    description: string;
    basePrice: number;
    type: string; // You can replace with an enum if applicable (e.g., ProductType)
    allowedSizeTypes: string[]; // Adjust if this should be a specific type or enum
    createdAt: string; // Consider Date if working with actual Date objects
    updatedAt: string;
    categories: string[]; // List of category names
    colors: Color[]; // List of color objects
    images: string[]; // List of image URLs
}