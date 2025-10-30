// app/purchases/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"
import { ShoppingBag, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface OrderItem {
  productId: {
    _id: string
    title: string
    image?: string
    category?: string
    price: number
  }
  title: string
  price: number
  quantity: number
  image?: string
}

interface Order {
  _id: string
  orderId: string
  status: string
  totalAmount: number
  items: OrderItem[]
  createdAt: string
  paymentProof?: {
    transactionId: string
    submittedAt: string
  }
}

export default function PurchasesPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login")
    } else if (user) {
      fetchOrders()
    }
  }, [user, authLoading, router])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('ecofinds_token')
      
      const response = await fetch('/api/purchases', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch orders')
      }

      setOrders(data.purchases || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load purchase history"
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      pending: { label: "Pending Payment", variant: "outline" },
      payment_submitted: { label: "Payment Submitted", variant: "secondary" },
      verified: { label: "Verified", variant: "default" },
      processing: { label: "Processing", variant: "default" },
      shipped: { label: "Shipped", variant: "default" },
      delivered: { label: "Delivered", variant: "default" },
      cancelled: { label: "Cancelled", variant: "destructive" },
      manual_review: { label: "Under Review", variant: "secondary" }
    }

    const config = statusConfig[status] || { label: status, variant: "outline" }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  if (authLoading || loading) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Purchase History</h1>
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Purchase History</h1>
        <Button variant="outline" onClick={fetchOrders}>
          Refresh
        </Button>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order._id}>
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-lg">Order #{order.orderId}</CardTitle>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="divide-y">
                    {order.items.map((item, index) => {
                      const product = item.productId
                      return (
                        <div key={index} className="py-4 first:pt-0">
                          <div className="flex gap-4">
                            <div className="w-16 h-16 relative rounded overflow-hidden flex-shrink-0 border">
                              <Image
                                src={item.image || product?.image || "/placeholder.svg"}
                                alt={item.title || product?.title || "Product"}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              {product && product._id ? (
                                <Link 
                                  href={`/products/${product._id}`} 
                                  className="hover:underline"
                                >
                                  <h3 className="font-medium">
                                    {item.title || product.title}
                                  </h3>
                                </Link>
                              ) : (
                                <h3 className="font-medium">{item.title}</h3>
                              )}
                              {(item.productId?.category) && (
                                <p className="text-sm text-muted-foreground">
                                  {product.category}
                                </p>
                              )}
                              <div className="flex justify-between mt-1">
                                <p className="text-sm">
                                  Qty: {item.quantity} × {formatCurrency(item.price)}
                                </p>
                                <p className="font-semibold text-primary">
                                  {formatCurrency(item.price * item.quantity)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t gap-2">
                    <div>
                      {order.paymentProof && (
                        <p className="text-sm text-muted-foreground">
                          Transaction ID: {order.paymentProof.transactionId}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-medium">Total:</span>
                      <span className="text-xl font-bold text-primary">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>
                  </div>

                  {order.status === 'pending' && (
                    <div className="flex justify-end">
                      <Button asChild>
                        <Link href={`/orders/${order.orderId}/payment`}>
                          Complete Payment
                        </Link>
                      </Button>
                    </div>
                  )}

                  {order.status === 'payment_submitted' && (
                    <div className="flex justify-end">
                      <Button variant="outline" asChild>
                        <Link href={`/orders/${order.orderId}`}>
                          View Order Details
                        </Link>
                      </Button>
                    </div>
                  )}
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
