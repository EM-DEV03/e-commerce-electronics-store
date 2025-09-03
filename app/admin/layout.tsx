"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { LayoutDashboard, Package, ShoppingCart, Users, BarChart3, Settings, ArrowLeft, Zap } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const adminNavItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Productos",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Pedidos",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Usuarios",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Reportes",
    href: "/admin/reports",
    icon: BarChart3,
  },
  {
    title: "Configuración",
    href: "/admin/settings",
    icon: Settings,
  },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { state } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!state.isLoading && (!state.isAuthenticated || state.user?.role !== "admin")) {
      router.push("/login")
    }
  }, [state.isLoading, state.isAuthenticated, state.user?.role, router])

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Zap className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Cargando panel de administración...</p>
        </div>
      </div>
    )
  }

  if (!state.isAuthenticated || state.user?.role !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Volver a la tienda</span>
              </Link>
            </div>

            <div className="flex items-center space-x-2">
              <Zap className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-foreground">ElectroTech</span>
              <Badge variant="secondary" className="ml-2">
                Admin
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Hola, {state.user?.name}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-[calc(100vh-4rem)] border-r bg-muted/30">
          <nav className="p-4 space-y-2">
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </div>
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
