"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useProducts } from "@/lib/product-context"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"

export default function CartPage() {
  const { products, cart, removeFromCart, updateCartItemQuantity } = useProducts()
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
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  // Get cart items with product details
  const cartItemsWithDetails = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.productId)
      return {
        ...item,
        product,
      }
    })
    .filter((item) => item.product) // Filter out any items where product wasn't found

  // Calculate total
  const subtotal = cartItemsWithDetails.reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0)

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      {cartItemsWithDetails.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Cart Items ({cartItemsWithDetails.length})</CardTitle>
              </CardHeader>
              <CardContent className="divide-y">
                {cartItemsWithDetails.map(({ productId, quantity, product }) => (
                  <div key={productId} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 relative rounded overflow-hidden flex-shrink-0">
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
                        <p className="font-semibold text-primary mt-1">{formatCurrency(product?.price || 0)}</p>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <Button variant="ghost" size="icon" onClick={() => removeFromCart(productId)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateCartItemQuantity(productId, quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateCartItemQuantity(productId, quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-medium text-lg pt-4 border-t">
                  <span>Total</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" disabled={cartItemsWithDetails.length === 0}>
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Checkout
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Your cart is empty</h3>
          <p className="text-muted-foreground mt-2 mb-6">Looks like you haven't added any products to your cart yet</p>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
