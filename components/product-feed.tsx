"use client"

import { useState } from "react"
import { useProducts } from "@/lib/product-context"
import ProductCard from "@/components/product-card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

type ProductFeedProps = {
  featured?: boolean
  limit?: number
  userId?: string
}

export default function ProductFeed({ featured = false, limit, userId }: ProductFeedProps) {
  const { products } = useProducts()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")

  // Get unique categories from products
  const categories = Array.from(new Set(products.map((product) => product.category)))

  // Filter products based on search, category, and other criteria
  const filteredProducts = products.filter((product) => {
    // Filter by search query
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by category
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true

    // Filter by user ID if provided
    const matchesUser = userId ? product.userId === userId : true

    // Filter featured products if needed
    const isFeatured = featured ? true : true // In a real app, you'd have a featured flag

    return matchesSearch && matchesCategory && matchesUser && isFeatured
  })

  // Apply limit if provided
  const displayedProducts = limit ? filteredProducts.slice(0, limit) : filteredProducts

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {displayedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No products found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  )
}
