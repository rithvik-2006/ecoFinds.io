"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"

export type Product = {
  id: string
  title: string
  description: string
  category: string
  price: number
  image: string
  userId: string
  createdAt: string
}

type ProductContextType = {
  products: Product[]
  userProducts: Product[]
  cartItems: CartItem[]
  purchases: Purchase[]
  addProduct: (product: Omit<Product, "id" | "createdAt">) => Promise<void>
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  addToCart: (productId: string, quantity: number) => void
  removeFromCart: (productId: string) => void
  updateCartItemQuantity: (productId: string, quantity: number) => void
  checkout: () => Promise<void>
}

type CartItem = {
  productId: string
  quantity: number
}

type Purchase = {
  id: string
  userId: string
  products: {
    productId: string
    quantity: number
  }[]
  date: string
  total: number
}

// Mock data
const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Bamboo Toothbrush Set",
    description: "Eco-friendly bamboo toothbrushes, pack of 4. Biodegradable handles with soft BPA-free bristles.",
    category: "Personal Care",
    price: 12.99,
    image: "/placeholder.svg?height=300&width=300",
    userId: "2",
    createdAt: new Date(2023, 5, 15).toISOString(),
  },
  {
    id: "2",
    title: "Reusable Produce Bags",
    description: "Set of 5 mesh produce bags made from recycled materials. Perfect for grocery shopping.",
    category: "Kitchen",
    price: 15.99,
    image: "/placeholder.svg?height=300&width=300",
    userId: "3",
    createdAt: new Date(2023, 6, 20).toISOString(),
  },
  {
    id: "3",
    title: "Solar Power Bank",
    description: "10000mAh solar power bank with dual USB ports. Charge your devices using solar energy.",
    category: "Electronics",
    price: 39.99,
    image: "/placeholder.svg?height=300&width=300",
    userId: "2",
    createdAt: new Date(2023, 7, 5).toISOString(),
  },
  {
    id: "4",
    title: "Organic Cotton T-Shirt",
    description: "100% organic cotton t-shirt. Ethically made with eco-friendly dyes.",
    category: "Clothing",
    price: 24.99,
    image: "/placeholder.svg?height=300&width=300",
    userId: "3",
    createdAt: new Date(2023, 8, 10).toISOString(),
  },
  {
    id: "5",
    title: "Stainless Steel Water Bottle",
    description: "Insulated stainless steel water bottle. Keeps drinks cold for 24 hours or hot for 12 hours.",
    category: "Kitchen",
    price: 29.99,
    image: "/placeholder.svg?height=300&width=300",
    userId: "1",
    createdAt: new Date(2023, 9, 15).toISOString(),
  },
  {
    id: "6",
    title: "Recycled Paper Notebook",
    description: "Notebook made from 100% recycled paper with a hemp cover. 200 pages.",
    category: "Stationery",
    price: 8.99,
    image: "/placeholder.svg?height=300&width=300",
    userId: "2",
    createdAt: new Date(2023, 10, 20).toISOString(),
  },
]

const ProductContext = createContext<ProductContextType | undefined>(undefined)

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const { toast } = useToast()
  const { user } = useAuth()

  // Load cart from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("ecofinds_cart")
    if (storedCart) {
      setCartItems(JSON.parse(storedCart))
    }

    const storedPurchases = localStorage.getItem("ecofinds_purchases")
    if (storedPurchases) {
      setPurchases(JSON.parse(storedPurchases))
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("ecofinds_cart", JSON.stringify(cartItems))
  }, [cartItems])

  // Save purchases to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("ecofinds_purchases", JSON.stringify(purchases))
  }, [purchases])

  // Filter products by current user
  const userProducts = user ? products.filter((product) => product.userId === user.id) : []

  const addProduct = async (product: Omit<Product, "id" | "createdAt">) => {
    try {
      // Simulate API call
      const newProduct: Product = {
        ...product,
        id: String(products.length + 1),
        createdAt: new Date().toISOString(),
      }

      setProducts([...products, newProduct])

      toast({
        title: "Product added",
        description: "Your product has been successfully added.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to add product",
        description: "There was an error adding your product.",
      })
    }
  }

  const updateProduct = async (id: string, updatedFields: Partial<Product>) => {
    try {
      // Simulate API call
      setProducts(products.map((product) => (product.id === id ? { ...product, ...updatedFields } : product)))

      toast({
        title: "Product updated",
        description: "Your product has been successfully updated.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to update product",
        description: "There was an error updating your product.",
      })
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      // Simulate API call
      setProducts(products.filter((product) => product.id !== id))

      // Also remove from cart if present
      setCartItems(cartItems.filter((item) => item.productId !== id))

      toast({
        title: "Product deleted",
        description: "Your product has been successfully deleted.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to delete product",
        description: "There was an error deleting your product.",
      })
    }
  }

  const addToCart = (productId: string, quantity: number) => {
    const existingItem = cartItems.find((item) => item.productId === productId)

    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item,
        ),
      )
    } else {
      setCartItems([...cartItems, { productId, quantity }])
    }

    toast({
      title: "Added to cart",
      description: "Item has been added to your cart.",
    })
  }

  const removeFromCart = (productId: string) => {
    setCartItems(cartItems.filter((item) => item.productId !== productId))

    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart.",
    })
  }

  const updateCartItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCartItems(cartItems.map((item) => (item.productId === productId ? { ...item, quantity } : item)))
  }

  const checkout = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Not logged in",
        description: "Please log in to complete your purchase.",
      })
      return
    }

    if (cartItems.length === 0) {
      toast({
        variant: "destructive",
        title: "Empty cart",
        description: "Your cart is empty.",
      })
      return
    }

    try {
      // Calculate total
      const total = cartItems.reduce((sum, item) => {
        const product = products.find((p) => p.id === item.productId)
        return sum + (product?.price || 0) * item.quantity
      }, 0)

      // Create purchase record
      const purchase: Purchase = {
        id: String(purchases.length + 1),
        userId: user.id,
        products: [...cartItems],
        date: new Date().toISOString(),
        total,
      }

      setPurchases([...purchases, purchase])

      // Clear cart
      setCartItems([])

      toast({
        title: "Purchase complete",
        description: "Thank you for your purchase!",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Checkout failed",
        description: "There was an error processing your purchase.",
      })
    }
  }

  return (
    <ProductContext.Provider
      value={{
        products,
        userProducts,
        cartItems,
        purchases,
        addProduct,
        updateProduct,
        deleteProduct,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        checkout,
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductContext)
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider")
  }
  return context
}
