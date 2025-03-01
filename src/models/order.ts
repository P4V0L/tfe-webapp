import {ExtendedCartItem} from "@/providers/CartProvider";
import {OrderStatus} from "@prisma/client";

export interface OrderInfo {
    subtotal: number
    tax: number
    shippingCost: number
    discount: number
    total: number
}

export interface ExtendedOrder {
    id: string
    items: ExtendedCartItem[]
    subtotal: number
    tax: number
    totalAmount: number
    shippingCost: number
    discount: number
    createdAt: Date
    status: OrderStatus
    updatedAt: Date
}