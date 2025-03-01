"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { Package, Calendar, CreditCard, ShoppingCartIcon as Paypal, Loader } from "lucide-react"
import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { type CheckoutFormData, checkoutSchema } from "@/schemas/checkout"
import { useCart } from "@/providers/CartProvider"
import { useSession } from "next-auth/react"
import { createOrder } from "@/actions/order"

const PROMO_CODES = [
    { code: "PABLO10", discount: 0.1 },
    { code: "JULIA20", discount: 0.2 },
    { code: "MARIA30", discount: 0.3 },
    { code: "PEDRO40", discount: 0.22 },
    { code: "REBAJAS", discount: 0.35 },
    { code: "VERANO", discount: 0.15 },
]

const shippingCost = (deliveryMethod: string, deliverySpeed: string): number => {
    return deliveryMethod === "pickup"
        ? 0.0
        : deliverySpeed === "standard"
            ? 5.0
            : deliverySpeed === "express"
                ? 10.0
                : 20.0
}

export function CheckoutForm() {
    const { cartItems, subtotal, tax, total, updateShippingCost } = useCart()
    const router = useRouter()
    const { data: session } = useSession()

    const [isLoading, setIsLoading] = useState(false)
    const [promoCode, setPromoCode] = useState("")
    const [discount, setDiscount] = useState(0)
    const [promoError, setPromoError] = useState("")

    const form = useForm<CheckoutFormData>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            contact: {
                fullName: session?.user?.name || "",
                email: session?.user?.email || "",
                phone: "",
                smsUpdates: false,
            },
            shipping: {
                deliveryMethod: "delivery",
                deliverySpeed: "standard",
            },
            payment: {
                paymentMethod: "card",
                useShippingAsBilling: true,
            },
        },
    })

    const deliveryMethod = form.watch("shipping.deliveryMethod")
    const deliverySpeed = form.watch("shipping.deliverySpeed")

    useEffect(() => {
        let shippingCostValue = 0
        if (deliveryMethod === "delivery") {
            switch (deliverySpeed) {
                case "express":
                    shippingCostValue = 10
                    break
                case "fast":
                    shippingCostValue = 20
                    break
                default:
                    shippingCostValue = 5
            }
        }
        updateShippingCost(shippingCostValue)
    }, [deliveryMethod, deliverySpeed, updateShippingCost])

    const applyPromoCode = () => {
        const promoCodeFound = PROMO_CODES.find((code) => code.code === promoCode)
        if (promoCodeFound) {
            setDiscount(total * promoCodeFound.discount)
            setPromoError("")
        } else {
            setDiscount(0)
            setPromoError("Código promocional inválido o expirado")
        }
    }

    const onSubmit = async (data: CheckoutFormData) => {
        setIsLoading(true)
        try {
            if (!session?.user?.id) {
                throw new Error("User not authenticated")
            }

            const order = await createOrder(
                cartItems,
                data,
                session.user.id,
                shippingCost(deliveryMethod, deliverySpeed),
                discount,
            )
            if (!order) {
                throw new Error("Error creating order")
            }

            router.push(`/checkout/confirmation?orderId=${order.id}`)
        } catch (error) {
            console.error("Error creating order:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="grid gap-8 lg:grid-cols-[1fr,380px]">
            <Form {...form}>
                <form id="checkout-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold mb-4">1. Contacto</h2>
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="contact.fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre completo*</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="contact.email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email*</FormLabel>
                                        <FormControl>
                                            <Input type="email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="contact.phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Teléfono*</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="contact.smsUpdates"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>
                                                Consiento recibir mensajes de texto para actualizaciones de pedidos
                                            </FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h2 className="text-lg font-semibold mb-4">2. Envío</h2>
                        <FormField
                            control={form.control}
                            name="shipping.deliveryMethod"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="grid grid-cols-2 gap-4 mb-6"
                                        >
                                            <FormItem>
                                                <FormControl>
                                                    <RadioGroupItem value="delivery" className="sr-only" id="delivery" />
                                                </FormControl>
                                                <Label
                                                    htmlFor="delivery"
                                                    className={`flex items-center justify-between h-full p-4 border rounded-md cursor-pointer hover:bg-primary hover:text-primary-foreground ${
                                                        field.value === "delivery" ? "bg-accent text-accent-foreground" : ""
                                                    }`}
                                                >
                                                    <div className="flex items-center">
                                                        <Package className="mr-2 h-4 w-4" />
                                                        Envío a domicilio
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">Desde €5</span>
                                                </Label>
                                            </FormItem>
                                            <FormItem>
                                                <FormControl>
                                                    <RadioGroupItem value="pickup" className="sr-only" id="pickup" />
                                                </FormControl>
                                                <Label
                                                    htmlFor="pickup"
                                                    className={`flex items-center justify-between h-full p-4 border rounded-md cursor-pointer hover:bg-primary hover:text-primary-foreground ${
                                                        field.value === "pickup" ? "bg-accent text-accent-foreground" : ""
                                                    }`}
                                                >
                                                    <div className="flex items-center">
                                                        <Calendar className="mr-2 h-4 w-4" />
                                                        Recoger en tienda
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">Gratis</span>
                                                </Label>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        {deliveryMethod === "delivery" && (
                            <>
                                <h3 className="font-medium mb-2">Opciones de entrega</h3>
                                <FormField
                                    control={form.control}
                                    name="shipping.deliverySpeed"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="grid gap-4 mb-6"
                                                >
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="standard" />
                                                        </FormControl>
                                                        <Label htmlFor="standard">Estándar (€5)</Label>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="express" />
                                                        </FormControl>
                                                        <Label htmlFor="express">Express (€10)</Label>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="urgent" />
                                                        </FormControl>
                                                        <Label htmlFor="urgent">Urgente (€20)</Label>
                                                    </FormItem>
                                                </RadioGroup>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <h3 className="font-medium mb-2">Información de entrega</h3>
                                <div className="grid gap-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="shipping.firstName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Nombre*</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="shipping.lastName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Apellido*</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="shipping.address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Dirección*</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="shipping.city"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Ciudad*</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="shipping.postalCode"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Código postal*</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="shipping.state"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Estado / Provincia*</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecciona una provincia" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="madrid">Madrid</SelectItem>
                                                        <SelectItem value="barcelona">Barcelona</SelectItem>
                                                        <SelectItem value="valencia">Valencia</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </>
                        )}
                    </Card>

                    <Card className="p-6">
                        <h2 className="text-lg font-semibold mb-4">3. Pago</h2>
                        <FormField
                            control={form.control}
                            name="payment.paymentMethod"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Método de pago</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="grid grid-cols-2 gap-4"
                                        >
                                            <FormItem>
                                                <FormControl>
                                                    <RadioGroupItem value="card" className="sr-only" id="card" />
                                                </FormControl>
                                                <Label
                                                    htmlFor="card"
                                                    className={`flex items-center justify-center h-full p-4 border rounded-md cursor-pointer hover:bg-primary hover:text-primary-foreground ${
                                                        field.value === "card" ? "bg-accent text-accent-foreground" : ""
                                                    }`}
                                                >
                                                    <CreditCard className="w-5 h-5 mr-2" />
                                                    Pago con tarjeta
                                                </Label>
                                            </FormItem>
                                            <FormItem>
                                                <FormControl>
                                                    <RadioGroupItem value="paypal" className="sr-only" id="paypal" />
                                                </FormControl>
                                                <Label
                                                    htmlFor="paypal"
                                                    className={`flex items-center justify-center h-full p-4 border rounded-md cursor-pointer hover:bg-primary hover:text-primary-foreground ${
                                                        field.value === "paypal" ? "bg-accent text-accent-foreground" : ""
                                                    }`}
                                                >
                                                    <Paypal className="w-5 h-5 mr-2" />
                                                    PayPal
                                                </Label>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {form.watch("payment.paymentMethod") === "card" && (
                            <div className="space-y-4 mt-4">
                                <FormField
                                    control={form.control}
                                    name="payment.cardNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Número de tarjeta*</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="payment.expiryDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Fecha de vencimiento*</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="MM/YY" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="payment.cvv"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>CVV*</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="123" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="payment.useShippingAsBilling"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
                                            <FormControl>
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>
                                                    Usar dirección de envío como dirección de facturación
                                                </FormLabel>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}
                    </Card>
                </form>
            </Form>

            <div className="lg:sticky lg:top-4 lg:h-fit">
                <Card className="p-6">
                    <h2 className="mb-4 text-lg font-semibold">Finalizar compra</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>{subtotal.toFixed(2)}€</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Impuestos</span>
                            <span>{tax.toFixed(2)}€</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Envío</span>
                            <span>{shippingCost(deliveryMethod, deliverySpeed).toFixed(2)}€</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between text-primary">
                                <span>Descuento</span>
                                <span>-{discount.toFixed(2)}€</span>
                            </div>
                        )}
                        <div className="flex justify-between border-t pt-4 font-semibold">
                            <span>Total</span>
                            <span>{(total - discount).toFixed(2)}€</span>
                        </div>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Código promocional"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                            />
                            <Button variant="outline" onClick={applyPromoCode}>
                                Aplicar
                            </Button>
                        </div>
                        {promoError && <p className="text-accent">{promoError}</p>}
                        <Button
                            form="checkout-form"
                            className="w-full"
                            type="submit"
                            variant="default"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader className="mr-2 h-5 w-5 animate-spin" />
                                    Finalizando...
                                </>
                            ) : (
                                "Finalizar pedido"
                            )}
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    )
}