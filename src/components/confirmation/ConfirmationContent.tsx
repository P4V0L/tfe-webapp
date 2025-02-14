"use client"

import { useCart } from "@/providers/CartProvider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Download } from "lucide-react"
import Image from "next/image"

export function ConfirmationContent() {
    const { cartItems } = useCart()

    const handleDownloadInvoice = () => {
        const link = document.createElement("a")
        link.href = "/factura.pdf"  // Ruta al archivo en la carpeta public
        link.download = "factura.pdf"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="space-y-8">
            <div className="relative h-[300px] rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-primary flex flex-col items-center justify-center text-white">
                    <h1 className="text-4xl font-bold mb-6">¡Gracias por tu compra!</h1>
                    <Button onClick={handleDownloadInvoice} variant="destructive" className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Descargar factura
                    </Button>
                </div>
            </div>
            <Card>
                <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Artículos del pedido</h2>
                    <ScrollArea className="h-120 pr-4">
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <Card key={item.id} className="flex items-center gap-4 p-4 bg-secondary-foreground text-primary-foreground">
                                    <div className="relative h-24 w-24 flex-shrink-0">
                                        <Image
                                            src={item.image || "/placeholder.svg"}
                                            alt={item.name}
                                            fill
                                            className="object-cover rounded-md"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-black">{item.name.split("-")[0]}</h3>
                                        <p className="text-sm ">Color: {item.color.name}</p>
                                        {item.size && <p className="text-sm text">Talla: {item.size.value}</p>}
                                        <p className="text-sm ">Cantidad: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">{(item.price * item.quantity).toFixed(2)}€</p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    )
}

