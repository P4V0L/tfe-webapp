"use client"

import { createContext, type ReactNode, useContext, useState, useEffect, useMemo, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CatalogSearchParams, catalogSearchParamsSchema } from "@/schemas/catalog"

interface ProductsContextType {
    searchParams: CatalogSearchParams
    updateFilters: (params: Partial<CatalogSearchParams>) => void
    isMobileFiltersOpen: boolean
    toggleMobileFilters: () => void
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

const parseSearchParams = (params: Record<string, string | string[] | undefined>): CatalogSearchParams => {
    try {
        return catalogSearchParamsSchema.parse(params)
    } catch (error) {
        console.error("Error parsing search params:", error)
        return catalogSearchParamsSchema.parse({})
    }
}

export function ProductsProvider({
                                     children,
                                     initialSearchParams,
                                 }: { children: ReactNode; initialSearchParams: Record<string, string | string[] | undefined> }) {
    const [searchParams, setSearchParams] = useState<CatalogSearchParams>(() => {
        try {
            return parseSearchParams(initialSearchParams)
        } catch (error) {
            console.error("Error parsing initial search params:", error)
            return catalogSearchParamsSchema.parse({})
        }
    })
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
    const router = useRouter()
    const searchParamsHook = useSearchParams()

    useEffect(() => {
        const params = Object.fromEntries(searchParamsHook.entries())
        setSearchParams(parseSearchParams(params))
    }, [searchParamsHook])

    const toggleMobileFilters = () => {
        setIsMobileFiltersOpen((prev) => !prev)
    }

    const updateFilters = useCallback((params: Partial<CatalogSearchParams>) => {
        const newSearchParams = { ...searchParams, ...params }

        if (Object.keys(params).some((key) => key !== "page")) {
            newSearchParams.page = 1
        }

        setSearchParams(newSearchParams)

        const queryString = new URLSearchParams()
        Object.entries(newSearchParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                if (Array.isArray(value)) {
                    if (value.length > 0) {
                        queryString.set(key, value.join(","))
                    }
                } else {
                    queryString.set(key, value.toString())
                }
            }
        })

        const search = queryString.toString()
        const query = search ? `?${search}` : ""

        router.push(`/catalogo${query}`)
    }, [searchParams, router])

    const contextValue = useMemo(
        () => ({
            searchParams,
            updateFilters,
            isMobileFiltersOpen,
            toggleMobileFilters,
        }),
        [searchParams, updateFilters, isMobileFiltersOpen],
    )

    return <ProductsContext.Provider value={contextValue}>{children}</ProductsContext.Provider>
}

export function useProducts() {
    const context = useContext(ProductsContext)
    if (context === undefined) {
        throw new Error("useProducts must be used within a ProductsProvider")
    }
    return context
}