"use client"

import { Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { getOrder } from "@/actions/order"
import { ConfirmationContent } from "@/components/confirmation/ConfirmationContent"
import { OrderSummary } from "@/components/confirmation/OrderSummary"
import { useCart } from "@/providers/CartProvider"
import { ExtendedOrder, OrderInfo } from "@/models/order"

function ConfirmationPageInner() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [order, setOrder] = useState<ExtendedOrder | null>(null)
    const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null)
    const { clearCart } = useCart()

    useEffect(() => {
        const orderId = searchParams.get("orderId")
        if (!orderId) {
            router.push("/")
        } else {
            getOrder(orderId)
                .then((orderData) => {
                    const extendedOrder: ExtendedOrder = {
                        id: orderData.id,
                        items: orderData.items,
                        subtotal: orderData.subtotal,
                        tax: orderData.tax,
                        totalAmount: orderData.totalAmount,
                        shippingCost: orderData.shippingCost,
                        discount: orderData.discount,
                        createdAt: orderData.createdAt,
                        updatedAt: orderData.updatedAt,
                        status: orderData.status,
                    }
                    setOrder(extendedOrder)
                    setOrderInfo({
                        subtotal: extendedOrder.subtotal,
                        tax: extendedOrder.tax,
                        shippingCost: extendedOrder.shippingCost,
                        discount: extendedOrder.discount,
                        total: extendedOrder.totalAmount,
                    })
                })
                .catch((err) => console.error("Error fetching order:", err))
        }
        clearCart()
    }, [])

    if (!order || !orderInfo) {
        return null
    }

    return (
        <div className="min-h-80 bg-secondary">
            <div className="container mx-auto px-4">
                <div className="flex flex-col gap-8">
                    <div className="lg:col-span-2">
                        <ConfirmationContent  />
                    </div>
                    <div className="lg:col-span-1">
                        <OrderSummary cartItems={order.items} orderId={order.id} orderInfo={orderInfo} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function ConfirmationPage() {
    return (
        <Suspense fallback={<div>Loading confirmation…</div>}>
            <ConfirmationPageInner />
        </Suspense>
    )
}