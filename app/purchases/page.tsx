"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useProducts } from "@/lib/product-context"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatDate } from "@/lib/utils"
import { ShoppingBag } from "lucide-react"

export default function PurchasesPage() {
  const { products, purchases } = useProducts()
  const { user, loading } = useAuth()
  const router = useRouter()

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Purchase History</h1>
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  // Filter purchases by user
  const userPurchases = purchases.filter((purchase) => purchase.userId === user.id)

  // Get product details for each purchase
  const purchasesWithDetails = userPurchases.map((purchase) => {
    const productsWithDetails = purchase.products
      .map((item) => {
        const product = products.find((p) => p.id === item.productId)
        return {
          ...item,
          product,
        }
      })
      .filter((item) => item.product) // Filter out any items where product wasn't found

    return {
      ...purchase,
      productsWithDetails,
    }
  })

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Purchase History</h1>

      {purchasesWithDetails.length > 0 ? (
        <div className="space-y-8">
          {purchasesWithDetails.map((purchase) => (
            <Card key={purchase.id}>
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <CardTitle className="text-lg">Order #{purchase.id}</CardTitle>
                  <div className="text-sm text-muted-foreground">{formatDate(purchase.date)}</div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="divide-y">
                    {purchase.productsWithDetails.map(({ productId, quantity, product }) => (
                      <div key={productId} className="py-4 first:pt-0">
                        <div className="flex gap-4">
                          <div className="w-16 h-16 relative rounded overflow-hidden flex-shrink-0">
                            <Image
                              src={product?.image || "/placeholder.svg"}
                              alt={product?.title || "Product"}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link href={`/products/${productId}`} className="hover:underline">
                              <h3 className="font-medium">{product?.title}</h3>
                            </Link>
                            <p className="text-sm text-muted-foreground">{product?.category}</p>
                            <div className="flex justify-between mt-1">
                              <p className="text-sm">
                                Qty: {quantity} × {formatCurrency(product?.price || 0)}
                              </p>
                              <p className="font-semibold text-primary">
                                {formatCurrency((product?.price || 0) * quantity)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between pt-4 border-t font-medium">
                    <span>Total</span>
                    <span>{formatCurrency(purchase.total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No purchase history</h3>
          <p className="text-muted-foreground mt-2 mb-6">You haven't made any purchases yet</p>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
