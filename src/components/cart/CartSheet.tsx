import { useState } from "react";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/providers/CartProvider";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";

export function CartSheet() {
    const { cartItems, removeFromCart, updateQuantity, proceedToCheckout, subtotal, tax, total } = useCart();
    const [isSheetOpen, setIsSheetOpen] = useState(true);

    const handleProceedToCheckout = () => {
        setIsSheetOpen(false);
        proceedToCheckout();
    };

    return (
        isSheetOpen && (
            <SheetContent className="w-full sm:max-w-lg flex flex-col h-full bg-primary text-primary-foreground">
                <SheetHeader className="space-y-2.5 pb-6">
                    <SheetTitle className="text-xl">Carrito</SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto">
                    <AnimatePresence>
                        <div className="space-y-6">
                            {cartItems.map((item) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="flex gap-4">
                                        <div className="relative h-[120px] w-[120px] bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                            <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <div>
                                                <h3 className="font-medium">{item.name.split("-")[0]}</h3>
                                                <p className="text-sm text-secondary-foreground">
                                                    {item.color && `Color: ${item.color.name}`}
                                                    {item.size && item.color && ", "}
                                                    {item.size && `Talla: ${item.size.value}`}
                                                </p>
                                                <p className="font-semibold ">{item.price?.toFixed(2)} €</p>
                                            </div>
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
                                </motion.div>
                            ))}
                        </div>
                    </AnimatePresence>
                </div>
                {cartItems.length > 0 ? (
                    <div className="p-6 border-t space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span>Subtotal:</span>
                                <span>{subtotal.toFixed(2)} €</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span>IVA (21%):</span>
                                <span>{tax.toFixed(2)} €</span>
                            </div>
                            <div className="flex justify-between items-center font-bold">
                                <span>Total:</span>
                                <span>{total.toFixed(2)} €</span>
                            </div>
                        </div>
                        <Button className="w-full text-secondary-foreground" variant="outline" size="lg" onClick={handleProceedToCheckout}>
                            Proceder al pago
                        </Button>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-muted-foreground">Tu carrito está vacío</p>
                    </div>
                )}
            </SheetContent>
        )
    );
}