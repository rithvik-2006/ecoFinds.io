// // app/orders/[orderId]/payment/page.tsx
// "use client"

// import { useEffect, useState } from "react"
// import { useParams, useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Checkbox } from "@/components/ui/checkbox"
// import { useToast } from "@/components/ui/use-toast"
// import { formatCurrency } from "@/lib/utils"
// import { Copy, CheckCircle2, Loader2, AlertCircle } from "lucide-react"
// import { Alert, AlertDescription } from "@/components/ui/alert"

// export default function PaymentPage() {
//   const { orderId } = useParams<{ orderId: string }>()
//   const { toast } = useToast()
//   const router = useRouter()
//   const [order, setOrder] = useState<any>(null)
//   const [loading, setLoading] = useState(true)
//   const [submitting, setSubmitting] = useState(false)
//   const [copied, setCopied] = useState(false)
  
//   const [paymentProof, setPaymentProof] = useState({
//     transactionId: "",
//     upiId: "",
//     phoneNumber: "",
//     transactionTimestamp: "",
//     hasOrderIdInRemark: false
//   })

//   useEffect(() => {
//     fetchOrder()
//   }, [orderId])

//   const fetchOrder = async () => {
//     try {
//       const token = localStorage.getItem('ecofinds_token')
//       const response = await fetch(`/api/orders/${orderId}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       })

//       if (!response.ok) {
//         throw new Error('Failed to fetch order')
//       }

//       const data = await response.json()
//       setOrder(data.order)
//     } catch (error) {
//       console.error('Error fetching order:', error)
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: "Failed to load order details"
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const copyToClipboard = (text: string, label: string) => {
//     navigator.clipboard.writeText(text)
//     setCopied(true)
//     toast({
//       title: "Copied!",
//       description: `${label} copied to clipboard`
//     })
//     setTimeout(() => setCopied(false), 2000)
//   }

//   const handleSubmitProof = async (e: React.FormEvent) => {
//     e.preventDefault()
    
//     if (!paymentProof.hasOrderIdInRemark) {
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: "Please confirm you included the Order ID in UPI remark"
//       })
//       return
//     }

//     setSubmitting(true)

//     try {
//       const token = localStorage.getItem('ecofinds_token')
      
//       const response = await fetch(`/api/orders/${orderId}/payment-proof`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(paymentProof)
//       })

//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to submit payment proof')
//       }

//       toast({
//         title: "Success!",
//         description: "Payment proof submitted. Your order is under verification.",
//       })

//       router.push(`/orders/${orderId}`)

//     } catch (error) {
//       console.error('Payment proof error:', error)
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: error instanceof Error ? error.message : "Failed to submit payment proof"
//       })
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="container py-8 flex justify-center">
//         <Loader2 className="h-8 w-8 animate-spin" />
//       </div>
//     )
//   }

//   if (!order) {
//     return (
//       <div className="container py-8">
//         <Alert variant="destructive">
//           <AlertCircle className="h-4 w-4" />
//           <AlertDescription>Order not found</AlertDescription>
//         </Alert>
//       </div>
//     )
//   }

//   return (
//     <div className="container py-8 max-w-3xl">
//       <h1 className="text-3xl font-bold mb-2">Pay via UPI</h1>
//       <p className="text-muted-foreground mb-8">PhonePe / Google Pay / Paytm / Any UPI App</p>

//       <Alert className="mb-6">
//         <AlertCircle className="h-4 w-4" />
//         <AlertDescription>
//           <strong>Important:</strong> Orders ship after payment verification (usually within 24 hours). 
//           Please include the Order ID in your UPI transaction remark/note.
//         </AlertDescription>
//       </Alert>

//       <div className="grid gap-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Payment Details</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
//               <div>
//                 <p className="text-sm text-muted-foreground">Order ID</p>
//                 <p className="text-2xl font-bold font-mono">{order.orderId}</p>
//               </div>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => copyToClipboard(order.orderId, "Order ID")}
//               >
//                 {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
//               </Button>
//             </div>

//             <div className="p-4 border rounded-lg">
//               <p className="text-sm text-muted-foreground">Amount to Pay</p>
//               <p className="text-3xl font-bold text-primary">{formatCurrency(order.totalAmount)}</p>
//             </div>

//             <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
//               <p className="text-sm font-medium mb-2">📱 Payment Instructions:</p>
//               <ol className="text-sm space-y-1 list-decimal list-inside">
//                 <li>Copy the Order ID above</li>
//                 <li>Open your UPI app (PhonePe/GPay/Paytm)</li>
//                 <li>Pay <strong>{formatCurrency(order.totalAmount)}</strong> to our UPI ID</li>
//                 <li>**Paste Order ID in the UPI remark/note field**</li>
//                 <li>Complete the payment</li>
//                 <li>Submit proof below</li>
//               </ol>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Submit Payment Proof</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmitProof} className="space-y-4">
//               <div>
//                 <Label>Order ID (Pre-filled)</Label>
//                 <Input value={order.orderId} disabled />
//               </div>

//               <div>
//                 <Label>Amount (Pre-filled)</Label>
//                 <Input value={formatCurrency(order.totalAmount)} disabled />
//               </div>

//               <div>
//                 <Label htmlFor="upiId">UPI ID / VPA (Optional)</Label>
//                 <Input
//                   id="upiId"
//                   placeholder="yourname@paytm"
//                   value={paymentProof.upiId}
//                   onChange={(e) => setPaymentProof({ ...paymentProof, upiId: e.target.value })}
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="phoneNumber">Phone Number Used (Optional)</Label>
//                 <Input
//                   id="phoneNumber"
//                   type="tel"
//                   placeholder="9876543210"
//                   value={paymentProof.phoneNumber}
//                   onChange={(e) => setPaymentProof({ ...paymentProof, phoneNumber: e.target.value })}
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="transactionTimestamp">Transaction Date & Time *</Label>
//                 <Input
//                   id="transactionTimestamp"
//                   type="datetime-local"
//                   required
//                   value={paymentProof.transactionTimestamp}
//                   onChange={(e) => setPaymentProof({ ...paymentProof, transactionTimestamp: e.target.value })}
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="transactionId">Transaction ID / UPI Ref No *</Label>
//                 <Input
//                   id="transactionId"
//                   required
//                   placeholder="Enter the transaction reference number"
//                   value={paymentProof.transactionId}
//                   onChange={(e) => setPaymentProof({ ...paymentProof, transactionId: e.target.value })}
//                 />
//               </div>

//               <div className="flex items-start space-x-2 p-4 border rounded-lg bg-muted">
//                 <Checkbox
//                   id="hasOrderIdInRemark"
//                   checked={paymentProof.hasOrderIdInRemark}
//                   onCheckedChange={(checked) => 
//                     setPaymentProof({ ...paymentProof, hasOrderIdInRemark: checked as boolean })
//                   }
//                 />
//                 <Label htmlFor="hasOrderIdInRemark" className="cursor-pointer text-sm leading-relaxed">
//                   I confirm that I have included the Order ID <strong>({order.orderId})</strong> in the UPI transaction remark/note field *
//                 </Label>
//               </div>

//               <Button 
//                 type="submit" 
//                 className="w-full" 
//                 size="lg"
//                 disabled={submitting || !paymentProof.hasOrderIdInRemark}
//                 onClick={()=>router.push('/purchases')}
//               >
//                 {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                 Submit Payment Proof
//               </Button>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }

// app/orders/[orderId]/payment/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/utils"
import { Copy, CheckCircle2, Loader2, AlertCircle, QrCode } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function PaymentPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const { toast } = useToast()
  const router = useRouter()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)
  
  const [paymentProof, setPaymentProof] = useState({
    transactionId: "",
    upiId: "",
    phoneNumber: "",
    transactionTimestamp: "",
    hasOrderIdInRemark: false
  })

  useEffect(() => {
    fetchOrder()
  }, [orderId])

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem('ecofinds_token')
      const response = await fetch(`/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch order')
      }

      const data = await response.json()
      setOrder(data.order)
    } catch (error) {
      console.error('Error fetching order:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load order details"
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

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!paymentProof.hasOrderIdInRemark) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please confirm you included the Order ID in UPI remark"
      })
      return
    }

    setSubmitting(true)

    try {
      const token = localStorage.getItem('ecofinds_token')
      
      const response = await fetch(`/api/orders/${orderId}/payment-proof`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(paymentProof)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit payment proof')
      }

      toast({
        title: "Success!",
        description: "Payment proof submitted. Your order is under verification.",
      })

      router.push(`/orders/${orderId}`)

    } catch (error) {
      console.error('Payment proof error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit payment proof"
      })
    } finally {
      setSubmitting(false)
    }
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
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Order not found</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Pay via UPI</h1>
      <p className="text-muted-foreground mb-8">PhonePe / Google Pay / Paytm / Any UPI App</p>

      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> Orders ship after payment verification (usually within 24 hours). 
          Please include the Order ID in your UPI transaction remark/note.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Order ID</p>
                <p className="text-2xl font-bold font-mono">{order.orderId}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(order.orderId, "Order ID")}
              >
                {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Amount to Pay</p>
              <p className="text-3xl font-bold text-primary">{formatCurrency(order.totalAmount)}</p>
            </div>

            {/* QR Code Section */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowQR(!showQR)}
              >
                <QrCode className="mr-2 h-4 w-4" />
                {showQR ? "Hide QR Code" : "Show QR Code"}
              </Button>

              {showQR && (
                <div className="p-6 border rounded-lg bg-white dark:bg-gray-900 flex flex-col items-center">
                  <div className="relative w-64 h-64 mb-4">
                    <Image
                      src="/scanner.jpg"
                      alt="UPI Payment QR Code"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                  <p className="text-sm text-center text-muted-foreground">
                    Scan this QR code with any UPI app to pay {formatCurrency(order.totalAmount)}
                  </p>
                  <p className="text-xs text-center text-muted-foreground mt-2 font-semibold">
                    ⚠️ Remember to add Order ID ({order.orderId}) in the UPI remark!
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm font-medium mb-2">📱 Payment Instructions:</p>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Copy the Order ID above</li>
                <li>Scan the QR code or open your UPI app (PhonePe/GPay/Paytm)</li>
                <li>Pay <strong>{formatCurrency(order.totalAmount)}</strong> to our UPI ID</li>
                <li><strong className="text-yellow-900 dark:text-yellow-200">⚠️ IMPORTANT: Paste Order ID in the UPI remark/note field</strong></li>
                <li>Complete the payment</li>
                <li>Submit proof below</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Submit Payment Proof</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitProof} className="space-y-4">
              <div>
                <Label>Order ID (Pre-filled)</Label>
                <Input value={order.orderId} disabled />
              </div>

              <div>
                <Label>Amount (Pre-filled)</Label>
                <Input value={formatCurrency(order.totalAmount)} disabled />
              </div>

              <div>
                <Label htmlFor="upiId">UPI ID / VPA (Optional)</Label>
                <Input
                  id="upiId"
                  placeholder="yourname@paytm"
                  value={paymentProof.upiId}
                  onChange={(e) => setPaymentProof({ ...paymentProof, upiId: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="phoneNumber">Phone Number Used (Optional)</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="9876543210"
                  value={paymentProof.phoneNumber}
                  onChange={(e) => setPaymentProof({ ...paymentProof, phoneNumber: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="transactionTimestamp">Transaction Date & Time *</Label>
                <Input
                  id="transactionTimestamp"
                  type="datetime-local"
                  required
                  value={paymentProof.transactionTimestamp}
                  onChange={(e) => setPaymentProof({ ...paymentProof, transactionTimestamp: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="transactionId">Transaction ID / UPI Ref No *</Label>
                <Input
                  id="transactionId"
                  required
                  placeholder="Enter the transaction reference number"
                  value={paymentProof.transactionId}
                  onChange={(e) => setPaymentProof({ ...paymentProof, transactionId: e.target.value })}
                />
              </div>

              <div className="flex items-start space-x-2 p-4 border rounded-lg bg-muted">
                <Checkbox
                  id="hasOrderIdInRemark"
                  checked={paymentProof.hasOrderIdInRemark}
                  onCheckedChange={(checked) => 
                    setPaymentProof({ ...paymentProof, hasOrderIdInRemark: checked as boolean })
                  }
                />
                <Label htmlFor="hasOrderIdInRemark" className="cursor-pointer text-sm leading-relaxed">
                  I confirm that I have included the Order ID <strong>({order.orderId})</strong> in the UPI transaction remark/note field *
                </Label>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={submitting || !paymentProof.hasOrderIdInRemark}
              >
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Payment Proof
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
