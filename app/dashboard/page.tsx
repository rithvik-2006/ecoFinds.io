"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useProducts } from "@/lib/product-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Loader2, Package, ShoppingBag, User } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export default function DashboardPage() {
  const [username, setUsername] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { user, loading, updateProfile } = useAuth()
  const { userProducts, purchases } = useProducts()
  const router = useRouter()

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  // Set username from user data
  useEffect(() => {
    if (user) {
      setUsername(user.username)
    }
  }, [user])

  if (loading) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username.trim()) {
      return
    }

    setIsSubmitting(true)

    try {
      await updateProfile(username)
      setIsEditing(false)
    } catch (error) {
      console.error("Failed to update profile:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Calculate stats
  const totalListings = userProducts?.length || 0
  const totalSales = (purchases || []).reduce((total, purchase) => {
    if (!purchase || !purchase.products) return total;
    
    // Check if any of the purchased products belong to the current user
    const userProductIds = userProducts?.map((p) => p.id) || []
    const userSales = purchase.products.filter((p) => p && userProductIds.includes(p.productId))

    // Calculate the total from user sales
    return (
      total +
      userSales.reduce((sum, item) => {
        if (!item) return sum;
        const product = userProducts?.find((p) => p.id === item.productId)
        return sum + (product?.price || 0) * (item.quantity || 0)
      }, 0)
    )
  }, 0)

  const totalPurchases = (purchases || []).filter((p) => p && p.userId === user.id).length

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalListings}</div>
            <p className="text-xs text-muted-foreground">Products you have listed for sale</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalSales)}</div>
            <p className="text-xs text-muted-foreground">Revenue from your product sales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Purchases</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPurchases}</div>
            <p className="text-xs text-muted-foreground">Total orders you've placed</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Manage your account details</CardDescription>
                </div>
                {!isEditing && (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleUpdateProfile}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" value={user.email} disabled />
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-6">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false)
                        setUsername(user.username)
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 text-primary rounded-full p-3">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium">{user.username}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <div className="flex justify-between w-full">
                <Button asChild variant="outline">
                  <Link href="/products/my-listings">Manage Listings</Link>
                </Button>
                <Button asChild>
                  <Link href="/purchases">View Purchase History</Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent listings and purchases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Recent Listings</h3>
                  {userProducts.length > 0 ? (
                    <div className="space-y-4">
                      {userProducts.slice(0, 3).map((product) => (
                        <div key={product.id} className="flex items-center gap-4">
                          <div className="w-12 h-12 relative rounded overflow-hidden">
                            <Link href={`/products/${product.id}`}>
                              <div className="absolute inset-0">
                                <img
                                  src={product.image || "/placeholder.svg"}
                                  alt={product.title}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                            </Link>
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link href={`/products/${product.id}`} className="hover:underline">
                              <p className="font-medium truncate">{product.title}</p>
                            </Link>
                            <p className="text-sm text-muted-foreground">{formatCurrency(product.price)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No listings yet</p>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Recent Purchases</h3>
                  {purchases.filter((p) => p.userId === user.id).length > 0 ? (
                    <div className="space-y-4">
                      {purchases
                        .filter((p) => p.userId === user.id)
                        .slice(0, 3)
                        .map((purchase) => (
                          <div key={purchase.id} className="p-4 border rounded-lg">
                            <div className="flex justify-between mb-2">
                              <p className="text-sm text-muted-foreground">Order #{purchase.id}</p>
                              <p className="text-sm font-medium">{formatCurrency(purchase.total)}</p>
                            </div>
                            <p className="text-sm">{purchase.products.length} item(s) purchased</p>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No purchases yet</p>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <div className="flex justify-between w-full">
                <Button asChild variant="outline">
                  <Link href="/products/my-listings">View All Listings</Link>
                </Button>
                <Button asChild>
                  <Link href="/purchases">View All Purchases</Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
