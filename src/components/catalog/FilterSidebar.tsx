"use client"

import type { Category, Color } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronDown, ChevronUp, X } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import {useProducts} from "@/components/catalog/ProductsContext";

interface FilterSidebarProps {
    categories: (Category & {
        children: Category[]
    })[]
    colors: Color[]
}

export function FilterSidebar({ categories, colors }: FilterSidebarProps) {
    const { searchParams, updateFilters } = useProducts()
    const [expandedCategories, setExpandedCategories] = useState<string[]>([])

    const toggleCategory = (categoryId: string) => {
        setExpandedCategories((current) =>
            current.includes(categoryId) ? current.filter((id) => id !== categoryId) : [...current, categoryId],
        )
    }

    const priceRanges = [
        { label: "€0 - €25", min: 0, max: 25 },
        { label: "€25 - €50", min: 25, max: 50 },
        { label: "€50 - €100", min: 50, max: 100 },
        { label: "€100 - €200", min: 100, max: 200 },
        { label: "Más de €200", min: 200, max: undefined },
    ]

    const handleCategoryChange = (slug: string) => {
        const newCategories = searchParams.category.includes(slug)
            ? searchParams.category.filter((c: string) => c !== slug)
            : [...searchParams.category, slug]
        updateFilters({ category: newCategories })
    }

    const handleColorChange = (name: string) => {
        const newColors = searchParams.color.includes(name)
            ? searchParams.color.filter((c: string) => c !== name)
            : [...searchParams.color, name]
        updateFilters({ color: newColors })
    }

    const clearAllFilters = () => {
        updateFilters({
            category: [],
            color: [],
            minPrice: undefined,
            maxPrice: undefined,
        })
    }

    return (
        <div className="relative bg-secondary-foreground p-6 text-primary-foreground rounded-xl h-fit">
            <div className={cn("space-y-8", "lg:block")}>
                <div className="flex justify-between items-center">
                    <Button variant="default" onClick={clearAllFilters} className="text-sm">
                        Limpiar filtros
                    </Button>
                </div>

                {(searchParams?.category.length > 0 ||
                    searchParams?.color.length > 0 ||
                    searchParams?.minPrice !== undefined ||
                    searchParams?.maxPrice !== undefined) && (
                    <div className="space-y-2">
                        <h3 className="font-semibold">Filtros seleccionados:</h3>
                        <div className="flex flex-wrap gap-2">
                            {searchParams?.category.map((slug: string) => {
                                const category =
                                    categories.find((c) => c.slug === slug) ||
                                    categories.flatMap((c) => c.children).find((c) => c.slug === slug)
                                return (
                                    category && (
                                        <Button
                                            key={slug}
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => handleCategoryChange(slug)}
                                            className="flex items-center gap-1"
                                        >
                                            {category.name}
                                            <X className="h-3 w-3" />
                                        </Button>
                                    )
                                )
                            })}
                            {searchParams.color.map((colorName: string) => {
                                const color = colors.find((c) => c.name === colorName)
                                return (
                                    color && (
                                        <Button
                                            key={colorName}
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => handleColorChange(colorName)}
                                            className="flex items-center gap-1"
                                        >
                                            {color.name}
                                            <X className="h-3 w-3" />
                                        </Button>
                                    )
                                )
                            })}
                            {(searchParams.minPrice !== undefined || searchParams.maxPrice !== undefined) && (
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => updateFilters({ minPrice: undefined, maxPrice: undefined })}
                                    className="flex items-center gap-1"
                                >
                                    {searchParams.minPrice !== undefined && searchParams.maxPrice !== undefined
                                        ? `€${searchParams.minPrice} - €${searchParams.maxPrice}`
                                        : searchParams.minPrice !== undefined
                                            ? `Desde €${searchParams.minPrice}`
                                            : `Hasta €${searchParams.maxPrice}`}
                                    <X className="h-3 w-3" />
                                </Button>
                            )}
                        </div>
                    </div>
                )}

                <div>
                    <h3 className="font-semibold mb-4">Categorías</h3>
                    <div className="space-y-3">
                        {categories.map((category) => (
                            <div key={category.id}>
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id={category.id}
                                        checked={searchParams?.category.includes(category.slug)}
                                        onCheckedChange={() => handleCategoryChange(category.slug)}
                                    />
                                    <Label htmlFor={category.id} className="flex-1">
                                        {category.name}
                                    </Label>
                                    {category.children.length > 0 && (
                                        <Button variant="ghost" size="sm" onClick={() => toggleCategory(category.id)}>
                                            {expandedCategories.includes(category.id) ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            )}
                                        </Button>
                                    )}
                                </div>
                                {expandedCategories.includes(category.id) && (
                                    <div className="ml-6 mt-2 space-y-2">
                                        {category.children.map((child) => (
                                            <div key={child.id} className="flex items-center gap-2">
                                                <Checkbox
                                                    id={child.id}
                                                    checked={searchParams?.category.includes(child.slug)}
                                                    onCheckedChange={() => handleCategoryChange(child.slug)}
                                                />
                                                <Label htmlFor={child.id}>{child.name}</Label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold mb-4">Colores</h3>
                    <div className="grid grid-cols-4 gap-2">
                        {colors.map((color) => (
                            <button
                                key={color.id}
                                onClick={() => handleColorChange(color.name)}
                                className={cn(
                                    "w-8 aspect-square rounded-full border-2",
                                    searchParams?.color.includes(color.name) ? "ring-2 ring-black ring-offset-1" : "",
                                )}
                                style={{ backgroundColor: color.hexCode }}
                                title={color.name}
                            />
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold mb-4">Precio</h3>
                    <div className="space-y-2">
                        {priceRanges.map((range) => (
                            <div key={range.label} className="flex items-center gap-2">
                                <Checkbox
                                    id={range.label}
                                    checked={searchParams?.minPrice === range.min && searchParams?.maxPrice === range.max}
                                    onCheckedChange={() =>
                                        updateFilters({
                                            minPrice: searchParams?.minPrice === range.min ? undefined : range.min,
                                            maxPrice: searchParams?.maxPrice === range.max ? undefined : range.max,
                                        })
                                    }
                                />
                                <Label htmlFor={range.label}>{range.label}</Label>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold mb-4">Rango personalizado</h3>
                    <div className="flex gap-2">
                        <div>
                            <Label htmlFor="min-price">Desde</Label>
                            <Input
                                id="min-price"
                                type="number"
                                min="0"
                                placeholder="Min"
                                value={searchParams?.minPrice || ""}
                                onChange={(e) => updateFilters({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="max-price">Hasta</Label>
                            <Input
                                id="max-price"
                                type="number"
                                min="0"
                                placeholder="Max"
                                value={searchParams?.maxPrice || ""}
                                onChange={(e) => updateFilters({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
