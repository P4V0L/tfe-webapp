'use server'
import { db } from "@/lib/db";

export const getCompleteUser = async (userId: string) => {
    return await db.user.findUnique({
        where: { id: userId },
        include: {
            orders: {
                include: {
                    items: {
                        include: {
                            productVariant: {
                                include: {
                                    product: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    })
}