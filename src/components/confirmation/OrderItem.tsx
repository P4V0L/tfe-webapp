import Image from "next/image"
import type { ExtendedCartItem } from "@/providers/CartProvider"

interface OrderItemProps {
    item: ExtendedCartItem
}

export function OrderItem({ item }: OrderItemProps) {
    return (
        <div className="flex items-center py-4 border-b last:border-b-0">
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                <Image
                    src={item.image || "/placeholder.svg?height=64&width=64"}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover object-center"
                />
            </div>
            <div className="ml-4 flex flex-1 flex-col">
                <div className="flex justify-between text-base font-sans font-bold">
                    <h3>{item.name.split("-")[0]}</h3>
                    <p className="ml-4">{item.price.toFixed(2)}€</p>
                </div>
                <div className="flex justify-between mt-1 items-end">
                    <div className="text-sm text-gray-500">
                        <p>Talla: {item.size?.value || "N/A"}</p>
                        <div className="flex items-center mt-1">
                            <span className="mr-1">Color:</span>
                            <span
                                className="inline-block h-4 w-4 rounded-full border border-gray-300"
                                style={{ backgroundColor: item.color?.hexCode || "#000000" }}
                            />
                        </div>
                    </div>
                    <div className="text-sm text-right text-gray-500">
                        <p>Cantidad: {item.quantity}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

