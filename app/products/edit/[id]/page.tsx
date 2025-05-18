"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useProducts } from "@/lib/product-context"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

const CATEGORIES = ["Clothing", "Electronics", "Home & Garden", "Kitchen", "Personal Care", "Stationery", "Other"]

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [price, setPrice] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { products, updateProduct } = useProducts()
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // Find the product to edit
  const product = products.find((p) => p.id === id)

  // Populate form with product data
  useEffect(() => {
    if (product) {
      setTitle(product.title)
      setDescription(product.description)
      setCategory(product.category)
      setPrice(product.price.toString())
    }
  }, [product])

  // Redirect if not logged in or not the owner
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth/login")
      } else if (product && product.userId !== user.id) {
        toast({
          variant: "destructive",
          title: "Unauthorized",
          description: "You don't have permission to edit this product.",
        })
        router.push("/products/my-listings")
      }
    }
  }, [user, loading, product, router, toast])

  if (loading || !product) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Edit Product</h1>
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !description || !category || !price) {
      return
    }

    setIsSubmitting(true)

    try {
      await updateProduct(id, {
        title,
        description,
        category,
        price: Number.parseFloat(price),
      })

      router.push("/products/my-listings")
    } catch (error) {
      console.error("Failed to update product:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit Product</h1>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Listing"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
