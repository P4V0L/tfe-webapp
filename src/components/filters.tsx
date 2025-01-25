'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function Filters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [categories, setCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<string>('')
  const [minPrice, setMinPrice] = useState<string>('')
  const [maxPrice, setMaxPrice] = useState<string>('')
  const [sort, setSort] = useState<string>('')

  // Initialize filters from URL params
  useEffect(() => {
    const categoriesParam = searchParams.get('categories')
    setCategories(categoriesParam ? categoriesParam.split(',').filter(Boolean) : [])
    setPriceRange(searchParams.get('priceRange') || '')
    setMinPrice(searchParams.get('minPrice') || '')
    setMaxPrice(searchParams.get('maxPrice') || '')
    setSort(searchParams.get('sort') || '')
  }, [searchParams])

  const updateURL = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (categories.length) params.set('categories', categories.join(','))
    else params.delete('categories')
    
    if (priceRange) params.set('priceRange', priceRange)
    else params.delete('priceRange')
    
    if (minPrice) params.set('minPrice', minPrice)
    else params.delete('minPrice')
    
    if (maxPrice) params.set('maxPrice', maxPrice)
    else params.delete('maxPrice')
    
    if (sort) params.set('sort', sort)
    else params.delete('sort')

    const newUrl = `${window.location.pathname}?${params.toString()}`
    router.push(newUrl, { scroll: false })
  }, [categories, priceRange, minPrice, maxPrice, sort, searchParams, router])

  useEffect(() => {
    updateURL()
  }, [updateURL])

  const handleCategoryChange = useCallback((category: string) => {
    setCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }, [])

  const handlePriceRangeChange = useCallback((value: string) => {
    setPriceRange(value)
    setMinPrice('')
    setMaxPrice('')
  }, [])

  const handleCustomPriceApply = useCallback(() => {
    setPriceRange('')
  }, [])

  return (
    <Accordion type="multiple" className="w-full">
      <AccordionItem value="categories">
        <AccordionTrigger>Categorías</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            {['Mujer', 'Hombre', 'Accesorios', 'Zapatos'].map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox 
                  id={category} 
                  checked={categories.includes(category)}
                  onCheckedChange={() => handleCategoryChange(category)}
                />
                <Label htmlFor={category}>{category}</Label>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="price">
        <AccordionTrigger>Filtrar por Precio</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <RadioGroup value={priceRange} onValueChange={handlePriceRangeChange}>
              {['0-25', '25-50', '50-100', '100-200', '200+'].map((range) => (
                <div key={range} className="flex items-center space-x-2">
                  <RadioGroupItem value={range} id={range} />
                  <Label htmlFor={range}>
                    {range === '200+' ? 'Más de €200' : `€${range.split('-').join(' - €')}`}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Input 
                  placeholder="Desde" 
                  className="w-20" 
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <span>to</span>
                <Input 
                  placeholder="Hasta" 
                  className="w-20" 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
              <Button size="sm" className="w-full" onClick={handleCustomPriceApply}>
                Aplicar
              </Button>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="sort">
        <AccordionTrigger>Ordenar por</AccordionTrigger>
        <AccordionContent>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar orden" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
              <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
              <SelectItem value="newest">Más Recientes</SelectItem>
              <SelectItem value="popular">Más Populares</SelectItem>
            </SelectContent>
          </Select>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

