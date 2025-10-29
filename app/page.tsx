// import { Button } from "@/components/ui/button"
// import Link from "next/link"
// import ProductFeed from "@/components/product-feed"

// export default function Home() {
//   return (
//     <div className="container px-4 py-8 mx-auto">
//       <section className="py-12 md:py-16 lg:py-20">
//         <div className="max-w-4xl mx-auto text-center">
//           <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
//             Discover <span className="text-primary">Eco-Friendly</span> Products
//           </h1>
//           <p className="mt-6 text-xl text-muted-foreground">
//             Shop sustainable items that are good for you and the planet.
//           </p>
//           <div className="flex flex-wrap justify-center gap-4 mt-8">
//             <Button asChild size="lg">
//               <Link href="/products">Browse Products</Link>
//             </Button>
//             <Button asChild variant="outline" size="lg">
//               <Link href="/auth/signup">Join EcoFinds</Link>
//             </Button>
//           </div>
//         </div>
//       </section>

//       {/* <section className="py-12">
//         <h2 className="mb-8 text-3xl font-bold text-center">Featured Products</h2>
//         <ProductFeed featured={true} limit={6} />
//       </section> */}
//     </div>
//   )
// }


// import { Button } from "@/components/ui/button"
// import Link from "next/link"
// import ProductFeed from "@/components/product-feed"
// import { getServerSession } from "next-auth" // or your auth method
// import { cookies } from "next/headers" // Your auth configuration
// export default async function Home() {
//   // Check if user is logged in
//   const cookieStore = await cookies()
//   const token = cookieStore.get('ecofinds_token')?.value
//   console.log(token)
//   const isLoggedIn = !!token

//   return (
//     <div className="container px-4 py-8 mx-auto">
//       {/* Hero Section */}
//       <section className="py-12 md:py-16 lg:py-20">
//         <div className="max-w-4xl mx-auto text-center">
//           <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
//             Discover <span className="text-primary">Eco-Friendly</span> Products
//           </h1>
//           <p className="mt-6 text-xl text-muted-foreground">
//             Shop sustainable items that are good for you and the planet.
//           </p>
//           <div className="flex flex-wrap justify-center gap-4 mt-8">
//             <Button asChild size="lg">
//               <Link href="/products">Browse Products</Link>
//             </Button>
//             {!isLoggedIn && (
//               <Button asChild variant="outline" size="lg">
//                 <Link href="/auth/signup">Join EcoFinds</Link>
//               </Button>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* About Section */}
//       <section className="py-12 bg-muted/30 rounded-lg">
//         <div className="max-w-4xl mx-auto px-6">
//           <h2 className="text-3xl font-bold text-center mb-6">
//             Why Choose EcoFinds?
//           </h2>
//           <p className="text-lg text-center text-muted-foreground mb-8">
//             Join our community-driven marketplace promoting circular economy and sustainable living through buying and selling second-hand, eco-friendly products.
//           </p>
//           <div className="grid md:grid-cols-3 gap-8 mt-10">
//             <div className="text-center">
//               <div className="text-4xl mb-4">🌍</div>
//               <h3 className="font-semibold text-xl mb-2">Reduce Waste</h3>
//               <p className="text-muted-foreground">
//                 Give products a second life and reduce landfill waste by up to 50%
//               </p>
//             </div>
//             <div className="text-center">
//               <div className="text-4xl mb-4">♻️</div>
//               <h3 className="font-semibold text-xl mb-2">Circular Economy</h3>
//               <p className="text-muted-foreground">
//                 Support sustainable consumption patterns and create new economic opportunities
//               </p>
//             </div>
//             <div className="text-center">
//               <div className="text-4xl mb-4">🤝</div>
//               <h3 className="font-semibold text-xl mb-2">Community Impact</h3>
//               <p className="text-muted-foreground">
//                 Connect with like-minded individuals committed to environmental responsibility
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* How It Works Section */}
//       <section className="py-12">
//         <div className="max-w-4xl mx-auto">
//           <h2 className="text-3xl font-bold text-center mb-10">
//             How It Works
//           </h2>
//           <div className="grid md:grid-cols-4 gap-6">
//             <div className="text-center">
//               <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
//                 1
//               </div>
//               <h3 className="font-semibold mb-2">Sign Up</h3>
//               <p className="text-sm text-muted-foreground">
//                 Create your free account in minutes
//               </p>
//             </div>
//             <div className="text-center">
//               <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
//                 2
//               </div>
//               <h3 className="font-semibold mb-2">Browse & List</h3>
//               <p className="text-sm text-muted-foreground">
//                 Explore sustainable products or list your own items
//               </p>
//             </div>
//             <div className="text-center">
//               <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
//                 3
//               </div>
//               <h3 className="font-semibold mb-2">Shop Securely</h3>
//               <p className="text-sm text-muted-foreground">
//                 Buy with confidence using our secure checkout
//               </p>
//             </div>
//             <div className="text-center">
//               <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
//                 4
//               </div>
//               <h3 className="font-semibold mb-2">Make Impact</h3>
//               <p className="text-sm text-muted-foreground">
//                 Track your environmental contribution
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Categories Section */}
//       <section className="py-12 bg-muted/30 rounded-lg">
//         <div className="max-w-4xl mx-auto px-6">
//           <h2 className="text-3xl font-bold text-center mb-10">
//             Popular Categories
//           </h2>
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
//             <Link 
//               href="/products?category=electronics" 
//               className="p-6 bg-background rounded-lg hover:shadow-md transition-shadow text-center"
//             >
//               <div className="text-3xl mb-2">📱</div>
//               <p className="font-medium">Electronics</p>
//             </Link>
//             <Link 
//               href="/products?category=fashion" 
//               className="p-6 bg-background rounded-lg hover:shadow-md transition-shadow text-center"
//             >
//               <div className="text-3xl mb-2">👕</div>
//               <p className="font-medium">Fashion</p>
//             </Link>
//             <Link 
//               href="/products?category=home" 
//               className="p-6 bg-background rounded-lg hover:shadow-md transition-shadow text-center"
//             >
//               <div className="text-3xl mb-2">🏠</div>
//               <p className="font-medium">Home & Kitchen</p>
//             </Link>
//             <Link 
//               href="/products?category=books" 
//               className="p-6 bg-background rounded-lg hover:shadow-md transition-shadow text-center"
//             >
//               <div className="text-3xl mb-2">📚</div>
//               <p className="font-medium">Books</p>
//             </Link>
//             <Link 
//               href="/products?category=outdoor" 
//               className="p-6 bg-background rounded-lg hover:shadow-md transition-shadow text-center"
//             >
//               <div className="text-3xl mb-2">⛺</div>
//               <p className="font-medium">Outdoor</p>
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* Featured Products Section - Uncomment when ready */}
//       {/* <section className="py-12">
//         <h2 className="mb-8 text-3xl font-bold text-center">Featured Products</h2>
//         <ProductFeed featured={true} limit={6} />
//       </section> */}

//       {/* Impact Stats Section */}
//       <section className="py-12">
//         <div className="max-w-4xl mx-auto">
//           <h2 className="text-3xl font-bold text-center mb-10">
//             Our Environmental Impact
//           </h2>
//           <div className="grid md:grid-cols-3 gap-8">
//             <div className="text-center p-6 bg-muted/30 rounded-lg">
//               <p className="text-4xl font-bold text-primary mb-2">7-8M+</p>
//               <p className="text-muted-foreground">Potential jobs created globally through circular economy</p>
//             </div>
//             <div className="text-center p-6 bg-muted/30 rounded-lg">
//               <p className="text-4xl font-bold text-primary mb-2">$640B</p>
//               <p className="text-muted-foreground">Potential savings in material costs by 2050</p>
//             </div>
//             <div className="text-center p-6 bg-muted/30 rounded-lg">
//               <p className="text-4xl font-bold text-primary mb-2">50%</p>
//               <p className="text-muted-foreground">Reduction in waste through sustainable practices</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       {!isLoggedIn && (
//         <section className="py-12">
//           <div className="max-w-3xl mx-auto text-center bg-primary text-primary-foreground rounded-lg p-10">
//             <h2 className="text-3xl font-bold mb-4">
//               Ready to Make a Difference?
//             </h2>
//             <p className="text-lg mb-6 opacity-90">
//               Join thousands of users buying and selling sustainable products on EcoFinds
//             </p>
//             <Button asChild size="lg" variant="secondary">
//               <Link href="/auth/signup">Get Started Today</Link>
//             </Button>
//           </div>
//         </section>
//       )}
//     </div>
//   )
// }


// app/page.tsx
"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import ProductFeed from "@/components/product-feed"
import { useAuth } from "@/lib/auth-context"

export default function Home() {
  const { user, loading } = useAuth()
  const isLoggedIn = !!user

  if (loading) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="flex items-center justify-center min-h-screen">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Hero Section */}
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
            {!isLoggedIn && (
              <Button asChild variant="outline" size="lg">
                <Link href="/auth/signup">Join EcoFinds</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Rest of your sections remain the same... */}
      {/* About Section */}
      <section className="py-12 bg-muted/30 rounded-lg">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-6">
            Why Choose EcoFinds?
          </h2>
          <p className="text-lg text-center text-muted-foreground mb-8">
            Join our community-driven marketplace promoting circular economy and sustainable living through buying and selling second-hand, eco-friendly products.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-10">
            <div className="text-center">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="font-semibold text-xl mb-2">Reduce Waste</h3>
              <p className="text-muted-foreground">
                Give products a second life and reduce landfill waste by up to 50%
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">♻️</div>
              <h3 className="font-semibold text-xl mb-2">Circular Economy</h3>
              <p className="text-muted-foreground">
                Support sustainable consumption patterns and create new economic opportunities
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="font-semibold text-xl mb-2">Community Impact</h3>
              <p className="text-muted-foreground">
                Connect with like-minded individuals committed to environmental responsibility
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Sign Up</h3>
              <p className="text-sm text-muted-foreground">
                Create your free account in minutes
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Browse & List</h3>
              <p className="text-sm text-muted-foreground">
                Explore sustainable products or list your own items
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Shop Securely</h3>
              <p className="text-sm text-muted-foreground">
                Buy with confidence using our secure checkout
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="font-semibold mb-2">Make Impact</h3>
              <p className="text-sm text-muted-foreground">
                Track your environmental contribution
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-muted/30 rounded-lg">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">
            Popular Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Link 
              href="/products?category=electronics" 
              className="p-6 bg-background rounded-lg hover:shadow-md transition-shadow text-center"
            >
              <div className="text-3xl mb-2">📱</div>
              <p className="font-medium">Electronics</p>
            </Link>
            <Link 
              href="/products?category=fashion" 
              className="p-6 bg-background rounded-lg hover:shadow-md transition-shadow text-center"
            >
              <div className="text-3xl mb-2">👕</div>
              <p className="font-medium">Fashion</p>
            </Link>
            <Link 
              href="/products?category=home" 
              className="p-6 bg-background rounded-lg hover:shadow-md transition-shadow text-center"
            >
              <div className="text-3xl mb-2">🏠</div>
              <p className="font-medium">Home & Kitchen</p>
            </Link>
            <Link 
              href="/products?category=books" 
              className="p-6 bg-background rounded-lg hover:shadow-md transition-shadow text-center"
            >
              <div className="text-3xl mb-2">📚</div>
              <p className="font-medium">Books</p>
            </Link>
            <Link 
              href="/products?category=outdoor" 
              className="p-6 bg-background rounded-lg hover:shadow-md transition-shadow text-center"
            >
              <div className="text-3xl mb-2">⛺</div>
              <p className="font-medium">Outdoor</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">
            Our Environmental Impact
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-muted/30 rounded-lg">
              <p className="text-4xl font-bold text-primary mb-2">7-8M+</p>
              <p className="text-muted-foreground">Potential jobs created globally through circular economy</p>
            </div>
            <div className="text-center p-6 bg-muted/30 rounded-lg">
              <p className="text-4xl font-bold text-primary mb-2">$640B</p>
              <p className="text-muted-foreground">Potential savings in material costs by 2050</p>
            </div>
            <div className="text-center p-6 bg-muted/30 rounded-lg">
              <p className="text-4xl font-bold text-primary mb-2">50%</p>
              <p className="text-muted-foreground">Reduction in waste through sustainable practices</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isLoggedIn && (
        <section className="py-12">
          <div className="max-w-3xl mx-auto text-center bg-primary text-primary-foreground rounded-lg p-10">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Join thousands of users buying and selling sustainable products on EcoFinds
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link href="/auth/signup">Get Started Today</Link>
            </Button>
          </div>
        </section>
      )}
    </div>
  )
}