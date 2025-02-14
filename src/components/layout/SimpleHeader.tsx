"use client"

import Link from "next/link"

export function SimpleHeader() {

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
            </div>
          </div>
        </header>
      </>
  )
}

