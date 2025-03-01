"use client"

import type { Category, Color } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { FilterSidebar } from "@/components/catalog/FilterSidebar"
import { useProducts } from "@/components/catalog/ProductsContext"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSearchParams } from "next/navigation"
import {FilterIcon} from "lucide-react";
import {ScrollArea} from "@/components/ui/scroll-area";

interface FilterSheetProps {
    categories: (Category & {
        children: Category[]
    })[]
    colors: Color[]
}

export function FilterSheet({ categories, colors }: FilterSheetProps) {
    const { updateFilters } = useProducts()
    const searchParams = useSearchParams()

    return (
        <div className="flex justify-between items-end border-accent">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="default">
                        <FilterIcon />
                        Filtrar
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-accent-foreground">
                    <SheetHeader >
                        <SheetTitle className="text-primary-foreground">Filtros</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4 h-[calc(100vh-8rem)]">
                        <ScrollArea className="h-full pr-4">
                            <FilterSidebar categories={categories} colors={colors} />
                        </ScrollArea>
                    </div>
                </SheetContent>
            </Sheet>

            <div>
                <p className="text-sm text-secondary-foreground mb-0.5">Ordenar por</p>
                <Select
                    value={(searchParams.get("sort") as "newest" | "price-asc" | "price-desc") || "newest"}
                    onValueChange={(value: string) => {
                        if (value === "newest" || value === "price-asc" || value === "price-desc") {
                            updateFilters({ sort: value })
                        }
                    }}
                >
                    <SelectTrigger className="w-fit bg-primary text-primary-foreground">
                        <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Más recientes</SelectItem>
                        <SelectItem value="price-asc">Precio: menor a mayor</SelectItem>
                        <SelectItem value="price-desc">Precio: mayor a menor</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}

