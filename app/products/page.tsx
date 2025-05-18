

"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import ProductFeed from "@/components/product-feed"


function ProductsContent() {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("search")

  return (
    <>
      <h1 className="text-3xl font-bold mb-8">
        {searchQuery ? `Search Results for "${searchQuery}"` : "All Products"}
      </h1>
      <ProductFeed searchQuery={searchQuery} />
    </>
  )
}


export default function ProductsPage() {
  return (
    <div className="container py-8">
      <Suspense fallback={<div className="text-3xl font-bold mb-8">Loading products...</div>}>
        <ProductsContent />
      </Suspense>
    </div>
  )
}
