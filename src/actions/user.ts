import { db } from "@/lib/db";
import { ExtendedOrder } from "@/models/order"; // ExtendedOrder includes items: ExtendedCartItem[]

export const getCompleteUser = async (userId: string) => {
    const user = await db.user.findUnique({
        where: { id: userId },
        include: {
            orders: {
                include: {
                    items: {
                        include: {
                            color: true,
                            size: true,
                        },
                    },
                },
            },
        },
    });

    if (!user) {
        return null;
    }

    // Map over each order to ensure it conforms to ExtendedOrder
    const extendedOrders: ExtendedOrder[] = user.orders.map((order) => ({
        id: order.id,
        subtotal: order.subtotal,
        tax: order.tax,
        totalAmount: order.totalAmount,
        shippingCost: order.shippingCost,
        discount: order.discount,
        createdAt: order.createdAt,
        status: order.status,
        updatedAt: order.updatedAt,
        // Transform each order item to ExtendedCartItem
        items: order.items.map((item) => ({
            ...item,
            // Provide the missing fields for ExtendedCartItem
            price: item.priceAtPurchase,         // Using priceAtPurchase as price
            cartId: order.id,                    // Using the order id as cartId
            productVariantId: item.productId,    // Using productId as productVariantId
        })),
    }));

    return { ...user, orders: extendedOrders };
};