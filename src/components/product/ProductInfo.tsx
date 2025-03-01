"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, ShoppingCart } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { ColorType, FullProduct } from "@/models/product"
import { useCart } from "@/providers/CartProvider"
import { addToCartSchema, type AddToCartFormData } from "@/schemas/cart"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"

interface ProductInfoProps {
    product: FullProduct
}

export function ProductInfo({ product }: ProductInfoProps) {
    const { addToCart } = useCart()
    // const [selectedVariant, setSelectedVariant] = useState(product.variants[0])

    const form = useForm<AddToCartFormData>({
        resolver: zodResolver(addToCartSchema),
        defaultValues: {
            productId: product.id,
            variantId: "",
            quantity: 1,
            color: product.variants[0].color?.name || "",
            size: product.variants[0].size?.value || "",
            price: product.basePrice || 0,
            image: product.images[0].url,
            productName: product.name,
        },
    })

    const colors: ColorType[] = product.variants
        .map((v) => v.color)
        .filter((color): color is NonNullable<typeof color> => Boolean(color))
        .filter((color, index, self) => index === self.findIndex((t) => t.id === color.id))

    const sizes = Array.from(
        new Set(
            product.variants.map((variant) => variant.size).filter((size): size is NonNullable<typeof size> => Boolean(size)),
        ),
    ).reverse()
    const hasSizes = sizes.length > 0

    const onSubmit = (data: AddToCartFormData) => {
        console.log(data)
        addToCart({
            ...data
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-secondary-foreground">{product.name.split("-")[0]}</h1>
                    <div className="flex items-center gap-4 mt-2">
            <span className="text-2xl font-black text-secondary-foreground font-serif">
              {product.basePrice?.toFixed(2)}€
            </span>
                        {product.type && <Badge variant="destructive">{product.type.replace("_", " ")}</Badge>}
                    </div>
                </div>

                <Separator />

                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="color"
                        render={({ field }) => (
                            <FormItem>
                                <Label className="text-base text-foreground">Colores</Label>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={(value) => {
                                            field.onChange(value)
                                        }}
                                        value={field.value}
                                        className="flex gap-2 mt-3"
                                    >
                                        {colors.map((color) => (
                                            <div key={color.name} className="flex flex-col items-center gap-1.5">
                                                <RadioGroupItem value={color.name} id={`color-${color.name}`} className="peer sr-only" />
                                                <Label
                                                    htmlFor={`color-${color.name}`}
                                                    className="h-8 w-8 rounded-full border peer-data-[state=checked]:ring-2 ring-accent cursor-pointer"
                                                    style={{ backgroundColor: color.hexCode }}
                                                />
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {hasSizes && (
                        <FormField
                            control={form.control}
                            name="size"
                            render={({ field }) => (
                                <FormItem>
                                    <Label className="text-base text-foreground">Talla</Label>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={(value) => {
                                                field.onChange(value)
                                            }}
                                            value={field.value as string | undefined}
                                            className="flex flex-wrap gap-2 mt-3"
                                        >
                                            {sizes.map((size) => (
                                                <div key={size.value}>
                                                    <RadioGroupItem value={size.value} id={`size-${size.value}`} className="peer sr-only" />
                                                    <Label
                                                        htmlFor={`size-${size.value}`}
                                                        className="px-4 py-2 border rounded-md peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/60 cursor-pointer hover:bg-secondary text-foreground"
                                                    >
                                                        {size.value}
                                                    </Label>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                            <FormItem>
                                <Label className="text-base text-foreground">Cantidad</Label>
                                <FormControl>
                                    <div className="flex items-center gap-2 mt-3">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => field.onChange(Math.max(1, field.value - 1))}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <Input
                                            type="number"
                                            {...field}
                                            onChange={(e) => field.onChange(Math.max(1, Number.parseInt(e.target.value) || 1))}
                                            className="w-20 text-center"
                                            readOnly
                                        />
                                        <Button type="button" variant="outline" size="icon" onClick={() => field.onChange(field.value + 1)}>
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" className="w-full" size="lg">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Añadir al carrito
                </Button>

                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="description">
                        <AccordionTrigger>Información del Producto</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                            {product.description || "No hay descripción disponible"}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </form>
        </Form>
    )
}

