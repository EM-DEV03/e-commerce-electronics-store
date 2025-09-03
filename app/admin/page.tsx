"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, ShoppingCart, Users, TrendingUp, DollarSign, AlertTriangle, Eye, Plus } from "lucide-react"
import Link from "next/link"

// Mock data for dashboard
const dashboardStats = {
  totalProducts: 156,
  totalOrders: 89,
  totalUsers: 234,
  totalRevenue: 12450000,
  lowStockProducts: 8,
  pendingOrders: 12,
  newUsersThisMonth: 45,
  revenueGrowth: 15.3,
}

const recentOrders = [
  {
    id: "ORD-001",
    customer: "Juan Pérez",
    total: 245000,
    status: "pending",
    date: "2024-01-15",
  },
  {
    id: "ORD-002",
    customer: "María García",
    total: 89000,
    status: "completed",
    date: "2024-01-15",
  },
  {
    id: "ORD-003",
    customer: "Carlos López",
    total: 156000,
    status: "processing",
    date: "2024-01-14",
  },
  {
    id: "ORD-004",
    customer: "Ana Rodríguez",
    total: 78000,
    status: "completed",
    date: "2024-01-14",
  },
]

const lowStockProducts = [
  { name: "Arduino Uno R3", stock: 3, minStock: 10 },
  { name: "Sensor Ultrasónico", stock: 1, minStock: 15 },
  { name: "Resistencias 1kΩ", stock: 5, minStock: 50 },
  { name: "LEDs Rojos", stock: 2, minStock: 25 },
]

export default function AdminDashboard() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completado"
      case "processing":
        return "Procesando"
      case "pending":
        return "Pendiente"
      default:
        return status
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Panel de Administración</h1>
          <p className="text-muted-foreground">Resumen general de tu tienda ElectroTech</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Agregar Producto
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">{dashboardStats.lowStockProducts} con stock bajo</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-yellow-600">{dashboardStats.pendingOrders} pendientes</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{dashboardStats.newUsersThisMonth} este mes</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${dashboardStats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              <span className="text-green-600">+{dashboardStats.revenueGrowth}% vs mes anterior</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Pedidos Recientes</CardTitle>
                <CardDescription>Los últimos pedidos realizados</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/orders">
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Todos
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.customer}</p>
                    <p className="text-xs text-muted-foreground">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${order.total.toLocaleString()}</p>
                    <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  Stock Bajo
                </CardTitle>
                <CardDescription>Productos que necesitan reposición</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/products">
                  <Eye className="h-4 w-4 mr-2" />
                  Gestionar
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-yellow-50">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">Stock mínimo: {product.minStock}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="destructive">{product.stock} unidades</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
