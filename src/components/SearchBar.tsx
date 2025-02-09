"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {useDebounce} from "@/hooks/use-debounce";
import {searchProducts} from "@/actions/search-products";

interface SearchResult {
    id: string
    name: string
    slug: string
    price: number | null
    images: { url: string }[]
    category: {
        name: string
    }
}

export function SearchBar() {
    const [isExpanded, setIsExpanded] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [searchResults, setSearchResults] = useState<SearchResult[]>([])
    const router = useRouter()
    const debouncedSearchTerm = useDebounce(searchTerm, 300)
    const searchRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchResults = async () => {
            if (debouncedSearchTerm) {
                const results = await searchProducts(debouncedSearchTerm)
                setSearchResults(results)
            } else {
                setSearchResults([])
            }
        }

        fetchResults()
    }, [debouncedSearchTerm])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsExpanded(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleProductClick = (productSlug: string) => {
        router.push(`/product/${productSlug}`)
        setIsExpanded(false)
        setSearchTerm("")
        setSearchResults([])
    }

    return (
        <div ref={searchRef} className="relative w-full max-w-[300px]">
            <div className="relative">
                <Input
                    type="text"
                    placeholder="Buscar"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value)
                        setIsExpanded(true)
                    }}
                    onClick={() => setIsExpanded(true)}
                    className="w-full max-w-[20px] sm:max-w-none bg-gray-100 border-none focus-visible:ring-0 focus-visible:ring-offset-0 pr-8"                />
                {searchTerm ? (
                    <button
                        onClick={() => {
                            setSearchTerm("")
                            setSearchResults([])
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                    >
                        <X className="h-4 w-4 text-gray-500" />
                    </button>
                ) : (
                    <Search className="h-4 w-4 text-gray-500 absolute right-2 top-1/2 -translate-y-1/2" />
                )}
            </div>

            {isExpanded && (searchResults.length > 0 || searchTerm) && (
                <div className="absolute top-full left-1/3 -translate-x-1/2 bg-white shadow-lg mt-2 rounded-lg border z-50 w-screen max-w-[400px] sm:max-w-[600px]">
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-lg">PRODUCTOS</h2>
                        </div>
                    </div>

                    {searchResults.length > 0 ? (
                        <div className="px-4 pb-4">
                            <div className="grid grid-cols-1 gap-4">
                                {searchResults.map((product) => (
                                    <div
                                        key={product.id}
                                        onClick={() => handleProductClick(product.slug)}
                                        className="flex items-center gap-4 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                                    >
                                        <div className="relative h-[72px] w-[72px] bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                            <Image
                                                src={product.images[0]?.url || "/placeholder.svg"}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <div className="flex items-baseline justify-between gap-2">
                                                <p className="text-sm text-gray-500 truncate">{product.category.name}</p>
                                                <p className="text-sm font-bold whitespace-nowrap">
                                                    {product.price !== null ? product.price.toFixed(2) + " €" : "N/A"}
                                                </p>
                                            </div>
                                            <h3 className="font-medium truncate mt-1">{product.name.split('-')[0]}</h3>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : searchTerm ? (
                        <div className="p-4 text-center text-gray-500">No se encontraron resultados para &#34;{searchTerm}&#34;</div>
                    ) : null}
                </div>
            )}
        </div>
    )
}