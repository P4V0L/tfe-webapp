"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, User, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { SearchBar } from "@/components/SearchBar"
import { CartSheet } from "@/components/cart/CartSheet"
import { useCart } from "@/providers/CartProvider"

export function Header() {
  const pathname = usePathname()
  const { cartItems } = useCart()

  // Si la ruta empieza con /checkout, se muestra solo el título centrado y clicable.
  if (pathname.startsWith("/checkout")) {
    return (
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4 text-center">
            <Link href="/">
              <h1 className="text-2xl font-serif font-bold text-black cursor-pointer">
                CONCHI GIMENO
              </h1>
            </Link>
          </div>
        </header>
    )
  }

  return (
      <>
        <div className="w-full bg-accent text-primary-foreground text-center py-2 text-sm">
          Envíos gratis en pedidos superiores a 50€
        </div>
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="hidden md:grid grid-cols-3 items-center">
              <Link href="/" className="text-2xl font-serif font-bold text-black">
                CONCHI GIMENO
              </Link>
              <nav className="flex items-center justify-center space-x-8">
                <Link
                    href="/"
                    className="text-black hover:text-accent transition-colors"
                >
                  INICIO
                </Link>
                <Link
                    href="/catalogo"
                    className="text-black hover:text-accent transition-colors"
                >
                  CATÁLOGO
                </Link>
              </nav>
              {/* Columna derecha: Iconos */}
              <div className="flex items-center justify-end space-x-4">
                <SearchBar />
                <Link href="/profile">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <div className="relative">
                        <ShoppingBag className="h-5 w-5" />
                        {cartItems.length > 0 && (
                            <span className="absolute bottom-3 left-3 bg-secondary-foreground text-white rounded-full w-4 h-4 text-xs">
                          {cartItems.length}
                        </span>
                        )}
                      </div>
                    </Button>
                  </SheetTrigger>
                  <CartSheet />
                </Sheet>
              </div>
            </div>
            <div className="flex items-center justify-between md:hidden">
              <div>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-5 w-5 mr-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="p-4">
                    <SheetHeader>
                      <SheetTitle>Menú</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4 flex flex-col space-y-2">
                      <Link
                          href="/"
                          className="text-black hover:text-accent transition-colors"
                      >
                        Inicio
                      </Link>
                      <Link
                          href="/catalogo"
                          className="text-black hover:text-accent transition-colors"
                      >
                        Catálogo
                      </Link>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
              <Link href="/" className="text-xl font-serif font-bold text-black">
                CONCHI GIMENO
              </Link>
              <div className="flex items-center space-x-4">
                <SearchBar />
                <Link href="/profile">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <div className="relative">
                        {cartItems.length > 0 && (
                            <span className="absolute left-3 bottom-3 bg-secondary-foreground text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                          {cartItems.length}
                        </span>
                        )}
                        <ShoppingBag className="h-5 w-5" />
                      </div>
                    </Button>
                  </SheetTrigger>
                  <CartSheet />
                </Sheet>
              </div>
            </div>
          </div>
        </header>
      </>
  )
}