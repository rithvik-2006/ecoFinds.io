"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShoppingCart, User, Menu, Search, LogIn } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { useProducts } from "@/lib/product-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuth()
  const { products } = useProducts()

  const isActive = (path: string) => {
    return pathname === path
  }

  // Handle search input changes
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
      setSearchQuery("")
    }
  }

  // Focus search input when search is opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <nav className="grid gap-6 text-lg font-medium">
              <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                <span className="text-primary">Eco</span>Finds
              </Link>
              <Link
                href="/"
                className={cn("hover:text-primary transition-colors", isActive("/") && "text-primary font-semibold")}
              >
                Home
              </Link>
              <Link
                href="/products"
                className={cn(
                  "hover:text-primary transition-colors",
                  isActive("/products") && "text-primary font-semibold",
                )}
              >
                Products
              </Link>
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className={cn(
                      "hover:text-primary transition-colors",
                      isActive("/dashboard") && "text-primary font-semibold",
                    )}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/products/my-listings"
                    className={cn(
                      "hover:text-primary transition-colors",
                      isActive("/products/my-listings") && "text-primary font-semibold",
                    )}
                  >
                    My Listings
                  </Link>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  className={cn(
                    "hover:text-primary transition-colors",
                    isActive("/auth/login") && "text-primary font-semibold",
                  )}
                >
                  Login
                </Link>
              )}
            </nav>
          </SheetContent>
        </Sheet>

        <Link href="/" className="flex items-center gap-2 mr-6">
          <span className="hidden text-xl font-bold sm:inline-block">
            <span className="text-primary">Eco</span>Finds
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link
            href="/"
            className={cn("hover:text-primary transition-colors", isActive("/") && "text-primary font-semibold")}
          >
            Home
          </Link>
          <Link
            href="/products"
            className={cn(
              "hover:text-primary transition-colors",
              isActive("/products") && "text-primary font-semibold",
            )}
          >
            Products
          </Link>
        </nav>

        <div className="flex items-center ml-auto gap-4">
          <div className={cn("hidden sm:block", isSearchOpen ? "flex-1" : "")}>
            {isSearchOpen ? (
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  type="search"
                  placeholder="Search products..."
                  className="w-full pl-8 md:w-[300px]"
                  value={searchQuery}
                  onChange={handleSearch}
                  onBlur={() => {
                    if (!searchQuery.trim()) {
                      setIsSearchOpen(false)
                    }
                  }}
                />
              </form>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            )}
          </div>

          <Link href="/cart">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Cart</span>
            </Button>
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/products/my-listings">My Listings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/purchases">Purchase History</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth/login">
              <Button variant="ghost" size="icon">
                <LogIn className="h-5 w-5" />
                <span className="sr-only">Login</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
