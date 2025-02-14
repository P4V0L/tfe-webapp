"use client"

import { useCart } from "@/providers/CartProvider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function OrderSummary() {
    // Now we destructure discount from the cart context
    const { subtotal, tax, discount } = useCart()
    const shipping = 5.00
    const finalTotal = subtotal + tax + shipping - discount

    return (
        <Card>
            <CardHeader>
                <CardTitle>Resumen del pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{subtotal.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Envío</span>
                    <span>{shipping.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Impuesto estimado</span>
                    <span>{tax.toFixed(2)}€</span>
                </div>
                {discount > 0 && (
                    <div className="flex justify-between text-sm text-primary">
                        <span>Descuento</span>
                        <span>-{discount.toFixed(2)}€</span>
                    </div>
                )}
                <div className="border-t pt-4 flex justify-between font-medium">
                    <span>Total</span>
                    <span>{finalTotal.toFixed(2)}€</span>
                </div>
            </CardContent>
        </Card>
    )
}