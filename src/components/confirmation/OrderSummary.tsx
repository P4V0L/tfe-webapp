"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { OrderInfo } from "@/models/order"
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {OrderItem} from "@/components/confirmation/OrderItem";
import {ExtendedCartItem} from "@/providers/CartProvider";

interface OrderSummaryProps {
    orderInfo: OrderInfo
    cartItems: ExtendedCartItem[]
    orderId: string
}

export function OrderSummary({ orderInfo, cartItems, orderId }: OrderSummaryProps) {
    const { subtotal, tax, shippingCost, discount, total } = orderInfo

    return (
        <div className="px-14">
            <Card className="bg-white shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-semibold">Resumen del pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-white rounded-lg shadow-sm">
                        {cartItems.map((item) => (
                            <OrderItem key={item.id} item={item} />
                        ))}
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Número de pedido</span>
                        <span className="font-medium">{orderId}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">{subtotal.toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Envío</span>
                        <span className="font-medium">{shippingCost.toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">IVA</span>
                        <span className="font-medium">{tax.toFixed(2)}€</span>
                    </div>
                    {discount > 0 && (
                        <div className="flex justify-between text-sm text-accent">
                            <span>Descuento</span>
                            <span>-{discount.toFixed(2)}€</span>
                        </div>
                    )}
                    <div className="border-t pt-4 flex justify-between font-medium">
                        <span>Total</span>
                        <span className="font-bold">{total.toFixed(2)}€</span>
                    </div>

                </CardContent>
            </Card>
            <div className="flex justify-center mt-8">
                <Link href="/">
                    <Button className="bg-accent hover:bg-accent/90 text-white w-full md:w-auto px-8">Volver a la tienda</Button>
                </Link>
            </div>
        </div>
    )
}

