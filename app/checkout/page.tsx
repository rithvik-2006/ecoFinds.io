// app/checkout/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useProducts } from "@/lib/product-context"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export default function CheckoutPage() {
  const { products, cart } = useProducts()
  const { user, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    buyerEmail: "",
    buyerPhone: "",
    shippingAddress: {
      fullName: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      phone: ""
    }
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, authLoading, router])

  if (authLoading || !user) {
    return <div className="container py-8">Loading...</div>
  }

  if (cart.length === 0) {
    router.push("/cart")
    return null
  }

  const cartItemsWithDetails = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.productId)
      return { ...item, product }
    })
    .filter((item) => item.product)

  const totalAmount = cartItemsWithDetails.reduce(
    (total, item) => total + (item.product?.price || 0) * item.quantity,
    0
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('ecofinds_token')
      
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cart.map(item => ({
            productId: item.productId,
            quantity: item.quantity
          })),
          ...formData
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create order')
      }

      toast({
        title: "Order Created!",
        description: `Order ${data.order.orderId} created successfully`,
      })

      // Redirect to payment page
      router.push(`/orders/${data.order.orderId}/payment`)

    } catch (error) {
      console.error('Checkout error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create order"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.buyerEmail}
                onChange={(e) => setFormData({ ...formData, buyerEmail: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.buyerPhone}
                onChange={(e) => setFormData({ ...formData, buyerPhone: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                required
                value={formData.shippingAddress.fullName}
                onChange={(e) => setFormData({
                  ...formData,
                  shippingAddress: { ...formData.shippingAddress, fullName: e.target.value }
                })}
              />
            </div>
            <div>
              <Label htmlFor="addressLine1">Address Line 1 *</Label>
              <Input
                id="addressLine1"
                required
                value={formData.shippingAddress.addressLine1}
                onChange={(e) => setFormData({
                  ...formData,
                  shippingAddress: { ...formData.shippingAddress, addressLine1: e.target.value }
                })}
              />
            </div>
            <div>
              <Label htmlFor="addressLine2">Address Line 2</Label>
              <Input
                id="addressLine2"
                value={formData.shippingAddress.addressLine2}
                onChange={(e) => setFormData({
                  ...formData,
                  shippingAddress: { ...formData.shippingAddress, addressLine2: e.target.value }
                })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  required
                  value={formData.shippingAddress.city}
                  onChange={(e) => setFormData({
                    ...formData,
                    shippingAddress: { ...formData.shippingAddress, city: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  required
                  value={formData.shippingAddress.state}
                  onChange={(e) => setFormData({
                    ...formData,
                    shippingAddress: { ...formData.shippingAddress, state: e.target.value }
                  })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  required
                  value={formData.shippingAddress.pincode}
                  onChange={(e) => setFormData({
                    ...formData,
                    shippingAddress: { ...formData.shippingAddress, pincode: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="shippingPhone">Phone *</Label>
                <Input
                  id="shippingPhone"
                  type="tel"
                  required
                  value={formData.shippingAddress.phone}
                  onChange={(e) => setFormData({
                    ...formData,
                    shippingAddress: { ...formData.shippingAddress, phone: e.target.value }
                  })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {cartItemsWithDetails.map(({ productId, quantity, product }) => (
                <div key={productId} className="flex justify-between">
                  <span>{product?.title} × {quantity}</span>
                  <span>{formatCurrency((product?.price || 0) * quantity)}</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Proceed to Payment
        </Button>
      </form>
    </div>
  )
}
