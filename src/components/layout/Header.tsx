"use client"

import Link from "next/link"
import { Menu, Search, User, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

export function Header() {
  return (
      <>
        <div className="w-full bg-accent text-primary-foreground text-center py-2 text-sm">
          Envíos gratis en pedidos superiores a 50€
        </div>
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="hidden md:grid grid-cols-3 items-center">
              <Link
                  href="/"
                  className="text-2xl font-serif font-bold text-black"
              >
                CONCHI GIMENO
              </Link>
              <nav className="flex items-center justify-center space-x-8">
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
              </nav>

              {/* Right column: Icons */}
              <div className="flex items-center justify-end space-x-4">
                <Button variant="ghost" size="icon">
                  <Search className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <ShoppingBag className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between md:hidden">
              <div>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-5 w-5" />
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
              <Link
                  href="/"
                  className="text-xl font-serif font-bold text-black"
              >
                CONCHI GIMENO
              </Link>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon">
                  <Search className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <ShoppingBag className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </header>
      </>
  )
}
