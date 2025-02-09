"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { CartItem, Size, Color } from "@prisma/client"
import type { AddToCartFormData } from "@/schemas/cart"
import {getColorByName, getSizeByValue} from "@/actions/data/db"


interface ExtendedCartItem extends Omit<CartItem, "id"> {
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
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const generateUniqueId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

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

    const addToCart = async (formData: AddToCartFormData) => {
        const { color, size, productId, quantity, image, productName, price} = formData

        const colorType = await getColorByName(color)
        if (!colorType) {
            throw new Error("Color not found")
        }
        const sizeType = await getSizeByValue(size || "")

        try {
            setCartItems((prevItems) => {
                console.log(prevItems)
                const existingItemIndex = prevItems.findIndex((item) => {

                    const sameProduct = item.productId === productId;
                    const sameColor = item.color.name === colorType.name;
                    const sameSize = (item.size?.value ?? null) === (sizeType?.value ?? null);

                    // console.log(sameProduct, sameColor, sameSize);
                    return sameProduct && sameColor && sameSize;
                });
                console.log(existingItemIndex);

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
                    cartId: "", // This should be set when creating an order
                    productId: productId,
                    name: productName,
                    image: image,
                    color: colorType,
                    size: sizeType || null,
                    price: price,
                    quantity,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    productVariantId: ""
                }
                return [...prevItems, newItem]
            })
        } catch (error) {
            console.error("Error adding item to cart:", error)
            // Here you might want to show an error message to the user
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

