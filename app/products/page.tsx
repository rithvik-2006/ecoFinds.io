import ProductFeed from "@/components/product-feed"

export default function ProductsPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>
      <ProductFeed />
    </div>
  )
}
