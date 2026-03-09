import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { PlaneTakeoff } from "lucide-react"

import "./globals.css"
import UserSwitcher from "@/components/user-switcher"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Skynet EPR | Training Management",
  description: "Advanced Flight Training Performance System",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased h-screen overflow-hidden flex flex-col bg-background text-foreground`}>
        
        <header className="flex-none sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 shadow-sm">
          <div className="flex h-16 items-center justify-between px-4 md:px-6 lg:px-8 w-full max-w-400 mx-auto">
            
            <div className="flex items-center gap-3 md:gap-4">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-inner">
                <PlaneTakeoff className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-base md:text-lg font-bold leading-tight tracking-tight text-foreground">
                  Skynet EPR Dashboard
                </h1>
                <span className="text-[11px] md:text-xs font-medium text-muted-foreground hidden sm:inline-block">
                  Flight Training Performance System
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <UserSwitcher />
            </div>

          </div>
        </header>

        <main className="flex-1 flex flex-col min-h-0 w-full max-w-400 mx-auto relative">
          {children}
        </main>

      </body>
    </html>
  )
}