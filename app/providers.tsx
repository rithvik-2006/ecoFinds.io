"use client"

import type React from "react"

import { AuthProvider } from "@/lib/auth-context"
import { ProductProvider } from "@/lib/product-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProductProvider>{children}</ProductProvider>
    </AuthProvider>
  )
}
