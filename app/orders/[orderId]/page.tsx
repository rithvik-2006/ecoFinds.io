// app/orders/[orderId]/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { formatCurrency, formatDate } from "@/lib/utils"
import { 
  Loader2, 
  CheckCircle2, 
  Clock, 
  Package, 
  Truck, 
  AlertCircle,
  Copy,
  ArrowLeft
} from "lucide-react"

interface OrderItem {
  productId: {
    _id: string
    title: string
    image?: string
    category?: string
    price: number
  } | null
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
  buyerEmail: string
  buyerPhone?: string
  shippingAddress?: {
    fullName: string
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    pincode: string
    phone: string
  }
  paymentProof?: {
    transactionId: string
    upiId?: string
    phoneNumber?: string
    transactionTimestamp: string
    hasOrderIdInRemark: boolean
    submittedAt: string
  }
  createdAt: string
  updatedAt: string
}

export default function OrderDetailsPage() {
  const params = useParams<{ orderId: string }>()
  const router = useRouter()
  const { toast } = useToast()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (params.orderId) {
      fetchOrder()
    }
  }, [params.orderId])

  const fetchOrder = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('ecofinds_token')

      const response = await fetch(`/api/orders/${params.orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to fetch order')
      }

      const data = await response.json()
      setOrder(data.order)
    } catch (error) {
      console.error('Error fetching order:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load order details"
      })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { 
      label: string
      variant: "default" | "secondary" | "destructive" | "outline"
      icon: React.ReactNode
      description: string
    }> = {
      pending: {
        label: "Pending Payment",
        variant: "outline",
        icon: <Clock className="h-4 w-4" />,
        description: "Awaiting payment submission"
      },
      payment_submitted: {
        label: "Payment Submitted",
        variant: "secondary",
        icon: <Clock className="h-4 w-4" />,
        description: "Payment proof under verification (usually within 24 hours)"
      },
      verified: {
        label: "Payment Verified",
        variant: "default",
        icon: <CheckCircle2 className="h-4 w-4" />,
        description: "Payment verified, preparing order"
      },
      processing: {
        label: "Processing",
        variant: "default",
        icon: <Package className="h-4 w-4" />,
        description: "Order is being prepared"
      },
      shipped: {
        label: "Shipped",
        variant: "default",
        icon: <Truck className="h-4 w-4" />,
        description: "Order has been shipped"
      },
      delivered: {
        label: "Delivered",
        variant: "default",
        icon: <CheckCircle2 className="h-4 w-4" />,
        description: "Order delivered successfully"
      },
      cancelled: {
        label: "Cancelled",
        variant: "destructive",
        icon: <AlertCircle className="h-4 w-4" />,
        description: "Order has been cancelled"
      },
      manual_review: {
        label: "Under Review",
        variant: "secondary",
        icon: <AlertCircle className="h-4 w-4" />,
        description: "Payment is being manually reviewed"
      }
    }

    return configs[status] || configs.pending
  }

  if (loading) {
    return (
      <div className="container py-8 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container py-8 max-w-4xl">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Order Not Found</h3>
              <p className="text-muted-foreground mb-6">
                The order you're looking for doesn't exist or you don't have access to it.
              </p>
              <Button asChild>
                <Link href="/purchases">View All Orders</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const statusConfig = getStatusConfig(order.status)

  return (
    <div className="container py-8 max-w-4xl">
      <Button variant="ghost" className="mb-4" onClick={() => router.push('/purchases')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="space-y-6">
        {/* Order Header */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl mb-2">Order Details</CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Order ID:</span>
                  <code className="text-lg font-mono font-semibold">{order.orderId}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(order.orderId, "Order ID")}
                  >
                    {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge variant={statusConfig.variant} className="flex items-center gap-2">
                  {statusConfig.icon}
                  {statusConfig.label}
                </Badge>
                <p className="text-sm text-muted-foreground">{statusConfig.description}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Date:</span>
                <span className="font-medium">{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated:</span>
                <span className="font-medium">{formatDate(order.updatedAt)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {order.items.map((item, index) => {
                const product = item.productId
                return (
                  <div key={index} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 relative rounded overflow-hidden flex-shrink-0 border">
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
                            className="hover:underline font-medium"
                          >
                            {item.title || product.title}
                          </Link>
                        ) : (
                          <h3 className="font-medium">{item.title}</h3>
                        )}
                        {product?.category && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {product.category}
                          </p>
                        )}
                        <div className="flex justify-between mt-2">
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity} × {formatCurrency(item.price)}
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
            <Separator className="my-4" />
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total Amount</span>
              <span className="text-2xl font-bold text-primary">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        {order.paymentProof && (
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction ID:</span>
                  <span className="font-mono font-medium">{order.paymentProof.transactionId}</span>
                </div>
                {order.paymentProof.upiId && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">UPI ID:</span>
                    <span className="font-medium">{order.paymentProof.upiId}</span>
                  </div>
                )}
                {order.paymentProof.phoneNumber && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone Number:</span>
                    <span className="font-medium">{order.paymentProof.phoneNumber}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction Time:</span>
                  <span className="font-medium">
                    {formatDate(order.paymentProof.transactionTimestamp)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Proof Submitted:</span>
                  <span className="font-medium">{formatDate(order.paymentProof.submittedAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order ID in Remark:</span>
                  <span className="font-medium">
                    {order.paymentProof.hasOrderIdInRemark ? (
                      <Badge variant="default" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Yes
                      </Badge>
                    ) : (
                      <Badge variant="destructive">No</Badge>
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Shipping Address */}
        {order.shippingAddress && (
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm">
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && (
                  <p>{order.shippingAddress.addressLine2}</p>
                )}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                </p>
                <p className="pt-2">Phone: {order.shippingAddress.phone}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        {order.status === 'pending' && (
          <Card className="border-primary">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="font-semibold mb-2">Payment Required</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Complete your payment to proceed with this order
                </p>
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href={`/orders/${order.orderId}/payment`}>
                    Complete Payment
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
