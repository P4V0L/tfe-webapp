"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { CartItem, ProductVariant, Product } from "@prisma/client"

interface ExtendedCartItem extends CartItem {
    productVariant: ProductVariant & {
        product: Product & {
            images: { url: string }[]
        }
        size?: {
            value: string
        }
    }
}

interface CartContextType {
    cartItems: ExtendedCartItem[]
    addToCart: (item: ExtendedCartItem) => void
    removeFromCart: (itemId: string) => void
    updateQuantity: (itemId: string, quantity: number) => void
    clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<ExtendedCartItem[]>([])

    useEffect(() => {
        const storedCart = localStorage.getItem("cart")
        if (storedCart) {
            setCartItems(JSON.parse(storedCart))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cartItems))
    }, [cartItems])

    const addToCart = (item: ExtendedCartItem) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((i) => i.productVariantId === item.productVariantId)
            if (existingItem) {
                return prevItems.map((i) =>
                    i.productVariantId === item.productVariantId ? { ...i, quantity: i.quantity + item.quantity } : i,
                )
            }
            return [...prevItems, item]
        })
    }

    const removeFromCart = (itemId: string) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId))
    }

    const updateQuantity = (itemId: string, quantity: number) => {
        setCartItems((prevItems) => prevItems.map((item) => (item.id === itemId ? { ...item, quantity } : item)))
    }

    const clearCart = () => {
        setCartItems([])
    }

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
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

