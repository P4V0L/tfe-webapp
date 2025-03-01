"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { CartItem, Size, Color } from "@prisma/client"
import type { AddToCartFormData } from "@/schemas/cart"
import { getColorByName, getSizeByValue } from "@/actions/data/db"
import { useRouter } from "next/navigation"

export interface ExtendedCartItem extends Omit<CartItem, "id"> {
    id: string
    image: string
    name: string
    color: Color
    size: Size | null
    productId: string
    price: number
    quantity: number
    createdAt: Date
    updatedAt: Date
}

interface CartContextType {
    cartItems: ExtendedCartItem[]
    addToCart: (formData: AddToCartFormData) => Promise<void>
    removeFromCart: (itemId: string) => void
    updateQuantity: (itemId: string, quantity: number) => void
    clearCart: () => void
    proceedToCheckout: () => void
    subtotal: number
    tax: number
    shippingCost: number
    discount: number
    updateShippingCost: (cost: number) => void
    applyDiscountCode: (code: string) => Promise<boolean>
    total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const TAX_RATE = 0.21 // 21% IVA
const SHIPPING_THRESHOLD = 100 // Free shipping for orders over 100€

const generateUniqueId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<ExtendedCartItem[]>([])
    const [shippingCost, setShippingCost] = useState(0)
    const [discount, setDiscount] = useState(0)
    const router = useRouter()

    const calculateSubtotal = useCallback(() => {
        return cartItems.reduce((total, item) => total + (item.price / (1 + TAX_RATE)) * item.quantity, 0)
    }, [cartItems])

    const calculateTax = useCallback((subtotal: number) => {
        return subtotal * TAX_RATE
    }, [])

    const calculateShippingCost = useCallback(
        (subtotal: number) => {
            return subtotal > SHIPPING_THRESHOLD ? 0 : shippingCost
        },
        [shippingCost],
    )

    const calculateTotal = useCallback((subtotal: number, tax: number, shipping: number, discount: number) => {
        return subtotal + tax + shipping - discount
    }, [])

    const subtotal = calculateSubtotal()
    const tax = calculateTax(subtotal)
    const calculatedShippingCost = calculateShippingCost(subtotal)
    const total = calculateTotal(subtotal, tax, calculatedShippingCost, discount)

    useEffect(() => {
        const storedCart = localStorage.getItem("cart")
        if (storedCart) {
            setCartItems(JSON.parse(storedCart))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cartItems))
    }, [cartItems])

    const addToCart = async (formData: AddToCartFormData) => {
        const { color, size, productId, quantity, image, productName, price } = formData

        const colorType = await getColorByName(color)
        if (!colorType) {
            throw new Error("Color not found")
        }
        const sizeType = await getSizeByValue(size || "")

        try {
            setCartItems((prevItems) => {
                const existingItemIndex = prevItems.findIndex((item) => {
                    const sameProduct = item.productId === productId
                    const sameColor = item.color.name === colorType.name
                    const sameSize = (item.size?.value ?? null) === (sizeType?.value ?? null)
                    return sameProduct && sameColor && sameSize
                })

                if (existingItemIndex !== -1) {
                    const updatedItems = [...prevItems]
                    updatedItems[existingItemIndex] = {
                        ...updatedItems[existingItemIndex],
                        quantity: updatedItems[existingItemIndex].quantity + quantity,
                        updatedAt: new Date(),
                    }
                    return updatedItems
                }

                const newItem: ExtendedCartItem = {
                    id: generateUniqueId(),
                    cartId: "",
                    productId: productId,
                    name: productName,
                    image: image,
                    color: colorType,
                    size: sizeType || null,
                    price: price,
                    quantity,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    productVariantId: "",
                }
                return [...prevItems, newItem]
            })
        } catch (error) {
            console.error("Error adding item to cart:", error)
        }
    }

    const removeFromCart = (itemId: string) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId))
    }

    const updateQuantity = (itemId: string, quantity: number) => {
        setCartItems((prevItems) =>
            prevItems.map((item) => (item.id === itemId ? { ...item, quantity, updatedAt: new Date() } : item)),
        )
    }

    const clearCart = () => {
        setCartItems([])
        setDiscount(0)
        setShippingCost(0)
    }

    const proceedToCheckout = () => {
        if (cartItems.length > 0) {
            router.push("/checkout")
        }
    }

    const updateShippingCost = (cost: number) => {
        setShippingCost(cost)
    }

    const applyDiscountCode = async (code: string): Promise<boolean> => {
        // This is a placeholder for discount code logic
        // In a real application, you would validate the code against a database or API
        if (code === "SUMMER10") {
            setDiscount(subtotal * 0.1) // 10% discount
            return true
        }
        return false
    }

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                proceedToCheckout,
                subtotal,
                tax,
                shippingCost: calculatedShippingCost,
                discount,
                updateShippingCost,
                applyDiscountCode,
                total,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider")
    }
    return context
}

