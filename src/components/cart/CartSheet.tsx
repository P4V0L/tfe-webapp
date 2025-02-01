"use client"

import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {useCart} from "@/providers/cart-provider";
import {Separator} from "@/components/ui/separator";

export function CartSheet() {
    const { cartItems, removeFromCart, updateQuantity } = useCart()

    const availableSizes = ["40", "41", "42", "43", "44", "45"]

    return (
        <SheetContent className="w-full sm:max-w-lg">
            <SheetHeader className="space-y-2.5 pb-6">
                <SheetTitle className="text-xl">Carrito</SheetTitle>
            </SheetHeader>
            <div className="space-y-6">
                {cartItems.map((item) => (
                    <div key={item.id}>
                        <div className="flex gap-4">
                            <div className="relative h-[120px] w-[120px] bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                    src={item.productVariant.product.images[0]?.url || "/placeholder.svg"}
                                    alt={item.productVariant.product.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1 space-y-3">
                                <div>
                                    <h3 className="font-medium">{item.productVariant.product.name}</h3>
                                    <p className="font-semibold">{item.productVariant.price?.toFixed(2)} €</p>
                                </div>
                                <Select defaultValue={item.productVariant.size?.value || "42"}>
                                    <SelectTrigger className="w-[80px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableSizes.map((size) => (
                                            <SelectItem key={size} value={size}>
                                                {size}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <div className="flex items-center gap-2">
                                    <div className="inline-flex items-center rounded-md border">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-none"
                                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                        >
                                            <Minus className="h-3 w-3" />
                                            <span className="sr-only">Decrease quantity</span>
                                        </Button>
                                        <div className="h-8 w-8 flex items-center justify-center text-sm">{item.quantity}</div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-none"
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        >
                                            <Plus className="h-3 w-3" />
                                            <span className="sr-only">Increase quantity</span>
                                        </Button>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeFromCart(item.id)}>
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Remove item</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <Separator className="mt-6" />
                    </div>
                ))}
            </div>
            {cartItems.length > 0 ? (
                <div className="absolute bottom-0 left-0 right-0 p-6">
                    <Button className="w-full bg-black text-white hover:bg-black/90" size="lg">
                        Proceder al Pago
                    </Button>
                </div>
            ) : (
                <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">Tu carrito está vacío</p>
                </div>
            )}
        </SheetContent>
    )
}

