import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Header from "@/components/header"
import { Providers } from "@/app/providers"
import Icon from '@/public/mongo-svgrepo-com.svg'

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "EcoFinds | Sustainable Shopping",
  description: "Find eco-friendly products for a sustainable lifestyle",
  generator: 'v0.dev',
  icons: [
    { 
      rel: 'icon', 
      url: Icon.src,
      type: 'image/svg+xml'
    }
  ]
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <Providers>
            <div className="min-h-screen bg-background">
              <Header />
              <main>{children}</main>
            </div>
            <Toaster />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
