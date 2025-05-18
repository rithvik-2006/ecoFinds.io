import { Button } from "@/components/ui/button"
import Link from "next/link"
import ProductFeed from "@/components/product-feed"

export default function Home() {
  return (
    <div className="container px-4 py-8 mx-auto">
      <section className="py-12 md:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Discover <span className="text-primary">Eco-Friendly</span> Products
          </h1>
          <p className="mt-6 text-xl text-muted-foreground">
            Shop sustainable items that are good for you and the planet.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button asChild size="lg">
              <Link href="/products">Browse Products</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/auth/signup">Join EcoFinds</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12">
        <h2 className="mb-8 text-3xl font-bold text-center">Featured Products</h2>
        <ProductFeed featured={true} limit={6} />
      </section>
    </div>
  )
}
