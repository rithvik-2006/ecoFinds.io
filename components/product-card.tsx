//components/product-card.tsx
import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/product-context"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

type ProductCardProps = {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <Link href={`/products/${product.id}`} className="block">
        <div className="aspect-square relative overflow-hidden">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            fill
            className="object-cover transition-transform hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <div className="space-y-1">
          <h3 className="font-medium line-clamp-1">{product.title}</h3>
          <p className="text-sm text-muted-foreground">{product.category}</p>
          <p className="font-semibold text-primary">{formatCurrency(product.price)}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild variant="outline" className="w-full gap-2">
          <Link href={`/products/${product.id}`}>
            <ShoppingCart className="h-4 w-4" />
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
