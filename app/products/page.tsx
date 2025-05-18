"use client"

import { useSearchParams } from "next/navigation"
import ProductFeed from "@/components/product-feed"

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("search")

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">
        {searchQuery ? `Search Results for "${searchQuery}"` : "All Products"}
      </h1>
      <ProductFeed searchQuery={searchQuery} />
    </div>
  )
}
