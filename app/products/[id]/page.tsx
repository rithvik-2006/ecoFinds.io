"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { useProducts } from "@/lib/product-context"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { formatCurrency, formatDate } from "@/lib/utils"
import { CheckCircle2, Minus, Plus, ShoppingCart, X } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"

export default function ProductDetailPage() {
  const { toast } = useToast()
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const { products, addToCart } = useProducts()
  const { user } = useAuth()
  const [quantity, setQuantity] = useState(1)
  const [showCartPopup, setShowCartPopup] = useState(false)

  const product = products.find((p) => p.id === id)

  if (!product) {
    return (
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    addToCart(product.id, quantity)
    
    // Show custom popup instead of toast
    setShowCartPopup(true)
    
    // Also show toast for additional confirmation
    toast({
      title: "Added to cart!",
      description: `${quantity} × ${product.title} has been added to your cart.`,
    })
    
    // Automatically hide popup after 5 seconds
    setTimeout(() => {
      setShowCartPopup(false)
    }, 5000)
  }

  const handleClosePopup = () => {
    setShowCartPopup(false)
  }

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
  }

  return (
    <div className="container py-12">
      {/* Cart Success Popup */}
      {showCartPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-black rounded-lg shadow-lg max-w-md w-full mx-4 overflow-hidden relative">
            <div className="absolute top-2 right-2">
              <Button variant="ghost" size="icon" onClick={handleClosePopup}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Added to Cart!</h3>
              <div className="flex items-center justify-center gap-4 my-4">
                {product.image && (
                  <div className="w-20 h-20 relative rounded overflow-hidden border">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="text-left">
                  <p className="font-medium">{product.title}</p>
                  <p className="text-sm text-muted-foreground">Quantity: {quantity}</p>
                  <p className="text-sm font-medium">{formatCurrency(product.price * quantity)}</p>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="outline" className="flex-1" onClick={handleClosePopup}>
                  Continue Shopping
                </Button>
                <Button className="flex-1" onClick={() => router.push('/cart')}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  View Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square relative rounded-lg overflow-hidden border">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{product.title}</h1>
              <p className="text-lg font-semibold text-primary mt-2">{formatCurrency(product.price)}</p>
            </div>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Category</span>
                <span>{product.category}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-muted-foreground">Listed on</span>
                <span>{formatDate(product.createdAt)}</span>
              </div>
            </Card>

            <div>
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            {user && user.id !== product.userId && (
              <div className="space-y-4">
                <div className="flex items-center">
                  <Button variant="outline" size="icon" onClick={decrementQuantity} disabled={quantity <= 1}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button variant="outline" size="icon" onClick={incrementQuantity}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <Button className="w-full" onClick={handleAddToCart}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}