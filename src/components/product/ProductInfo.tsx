"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Heart, Minus, Plus, ShoppingCart } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface ProductInfoProps {
    product: any
}

export function ProductInfo({ product }: ProductInfoProps) {
    const [selectedColor, setSelectedColor] = useState<string | null>(null)
    const [selectedSize, setSelectedSize] = useState<string | null>(null)
    const [quantity, setQuantity] = useState(1)

    const colors = Array.from(new Set(product.variants.map((v: any) => v.color).filter(Boolean)))
    const sizes = Array.from(new Set(product.variants.map((v: any) => v.size).filter(Boolean)))

    const incrementQuantity = () => setQuantity((prev) => prev + 1)
    const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1))

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">{product.name.split('-')[0]}</h1>
                <div className="flex items-center gap-4 mt-2">
                    <span className="text-2xl font-bold text-primary">€{product.basePrice?.toFixed(2)}</span>
                    {product.type && <Badge variant="destructive">{product.type}</Badge>}
                </div>
            </div>

            <Separator />

            <div className="space-y-4">
                <div>
                    <Label className="text-base text-foreground">Color</Label>
                    <RadioGroup value={selectedColor || ""} onValueChange={setSelectedColor} className="flex gap-2 mt-3">
                        {colors.map((color: any) => (
                            <div key={color?.name} className="flex flex-col items-center gap-1.5">
                                <RadioGroupItem value={color?.name || ""} id={`color-${color?.name}`} className="peer sr-only" />
                                <Label
                                    htmlFor={`color-${color?.name}`}
                                    className="h-8 w-8 rounded-full border peer-data-[state=checked]:ring-2 ring-primary cursor-pointer"
                                    style={{ backgroundColor: color?.hexCode }}
                                />
                                <span className="text-xs text-secondary-foreground">{color?.name}</span>
                            </div>
                        ))}
                    </RadioGroup>
                </div>

                <div>
                    <Label className="text-base text-foreground">Talla</Label>
                    <RadioGroup value={selectedSize || ""} onValueChange={setSelectedSize} className="flex flex-wrap gap-2 mt-3">
                        {sizes.reverse().map((size: any) => (
                            <div key={size?.value}>
                                <RadioGroupItem value={size?.value || ""} id={`size-${size?.value}`} className="peer sr-only" />
                                <Label
                                    htmlFor={`size-${size?.value}`}
                                    className="px-4 py-2 border rounded-md peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/60 cursor-pointer hover:bg-secondary text-foreground"
                                >
                                    {size?.value}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>

                <div>
                    <Label className="text-base text-foreground">Cantidad</Label>
                    <div className="flex items-center gap-2 mt-3">
                        <Button variant="outline" size="icon" onClick={decrementQuantity} disabled={quantity <= 1}>
                            <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                            className="w-20 text-center"
                        />
                        <Button variant="outline" size="icon" onClick={incrementQuantity}>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex gap-4">
                <Button className="flex-1" size="lg">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Añadir al carrito
                </Button>
            </div>

            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="description">
                    <AccordionTrigger>Información del Producto</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{product.description || "No hay descripción disponible"}</AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}

