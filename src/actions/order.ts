"use server"

import {OrderStatus, Prisma} from "@prisma/client"
import type {CheckoutFormData} from "@/schemas/checkout"
import {db as prisma} from "@/lib/db"
import type {ExtendedCartItem} from "@/providers/CartProvider"

const TAX_RATE = 0.21 

export const createOrder = async (
    cartItems: ExtendedCartItem[],
    data: CheckoutFormData,
    userId: string,
    shippingCost: number,
    discount: number,
) => {
    const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * (item.price / (1 + TAX_RATE)), 0)
    const tax = subtotal * TAX_RATE
    const total = subtotal + tax + shippingCost - discount

    const statuses = Object.values(OrderStatus)
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]

    const orderData: Prisma.OrderCreateInput = {
        user: { connect: { id: userId } },
        subtotal,
        tax,
        shippingCost,
        discount,
        totalAmount: total,
        shippingAddress: data.shipping || Prisma.JsonNull,
        billingAddress: data.payment || Prisma.JsonNull,
        status: randomStatus,
        items: {
            create: cartItems.map((item) => ({
                productId: item.productId,
                name: item.name,
                image: item.image,
                color: { connect: { id: item.color.id } },
                size: item.size ? { connect: { id: item.size.id } } : undefined,
                priceAtPurchase: item.price / (1 + TAX_RATE),
                quantity: item.quantity,
            })),
        },
    }

    try {
        return await prisma.order.create({
            data: orderData,
            include: {items: true},
        })
    } catch (error) {
        console.error("Error creating order:", error)
        throw error
    }
}

export const getOrder = async (orderId: string) => {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            items: {
                include: {
                    color: true,
                    size: true,
                },
            },
        },
    })

    if (!order) {
        throw new Error("Order not found")
    }

    const transformedItems = order.items.map((item) => ({
        ...item,
        productVariantId: item.productId,
        price: item.priceAtPurchase * (1 + TAX_RATE),
        cartId: order.id,
    }))

    return {
        ...order,
        items: transformedItems,
    }
}