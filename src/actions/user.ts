import { db } from "@/lib/db";
import { ExtendedOrder } from "@/models/order";

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
        items: order.items.map((item) => ({
            ...item,
            price: item.priceAtPurchase,
            cartId: order.id,
            productVariantId: item.productId,
        })),
    }));

    return { ...user, orders: extendedOrders };
};