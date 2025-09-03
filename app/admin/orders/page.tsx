"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Eye, Package, Truck, CheckCircle, X } from "lucide-react"
import { toast } from "sonner"

// Mock orders data - in real app this would come from backend
const mockOrders = [
  {
    id: "ORD-001",
    customer: "Juan Pérez",
    email: "juan@example.com",
    total: 245000,
    status: "confirmed",
    date: "2024-01-15T10:30:00Z",
    items: 3,
    shippingAddress: "Calle 123, Sincelejo, Sucre",
    paymentMethod: "credit_card",
  },
  {
    id: "ORD-002",
    customer: "María García",
    email: "maria@example.com",
    total: 89000,
    status: "delivered",
    date: "2024-01-15T09:15:00Z",
    items: 1,
    shippingAddress: "Carrera 45, Montería, Córdoba",
    paymentMethod: "pse",
  },
  {
    id: "ORD-003",
    customer: "Carlos López",
    email: "carlos@example.com",
    total: 156000,
    status: "processing",
    date: "2024-01-14T16:45:00Z",
    items: 2,
    shippingAddress: "Avenida 67, Cartagena, Bolívar",
    paymentMethod: "cash",
  },
  {
    id: "ORD-004",
    customer: "Ana Rodríguez",
    email: "ana@example.com",
    total: 78000,
    status: "shipped",
    date: "2024-01-14T14:20:00Z",
    items: 1,
    shippingAddress: "Calle 89, Barranquilla, Atlántico",
    paymentMethod: "credit_card",
  },
  {
    id: "ORD-005",
    customer: "Luis Martínez",
    email: "luis@example.com",
    total: 340000,
    status: "confirmed",
    date: "2024-01-13T11:00:00Z",
    items: 4,
    shippingAddress: "Carrera 12, Bogotá, Cundinamarca",
    paymentMethod: "pse",
  },
]

export default function AdminOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [orders, setOrders] = useState(mockOrders)

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
    toast.success(`Pedido ${orderId} actualizado a ${getStatusText(newStatus)}`)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-blue-100 text-blue-800">Confirmado</Badge>
      case "processing":
        return <Badge className="bg-yellow-100 text-yellow-800">Procesando</Badge>
      case "shipped":
        return <Badge className="bg-purple-100 text-purple-800">Enviado</Badge>
      case "delivered":
        return <Badge className="bg-green-100 text-green-800">Entregado</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelado</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmado"
      case "processing":
        return "Procesando"
      case "shipped":
        return "Enviado"
      case "delivered":
        return "Entregado"
      case "cancelled":
        return "Cancelado"
      default:
        return status
    }
  }

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "credit_card":
        return "Tarjeta"
      case "pse":
        return "PSE"
      case "cash":
        return "Contra Entrega"
      default:
        return method
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Pedidos</h1>
          <p className="text-muted-foreground">Administra todos los pedidos de tu tienda</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pedidos</CardTitle>
          <CardDescription>Lista completa de pedidos ({filteredOrders.length} pedidos)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar pedidos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Pago</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-[70px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.id}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customer}</p>
                        <p className="text-sm text-muted-foreground">{order.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{formatDate(order.date)}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{order.items} productos</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{getPaymentMethodText(order.paymentMethod)}</p>
                    </TableCell>
                    <TableCell className="font-medium">${order.total.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "processing")}>
                            <Package className="mr-2 h-4 w-4" />
                            Marcar como Procesando
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "shipped")}>
                            <Truck className="mr-2 h-4 w-4" />
                            Marcar como Enviado
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "delivered")}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Marcar como Entregado
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => updateOrderStatus(order.id, "cancelled")}
                            className="text-destructive focus:text-destructive"
                          >
                            <X className="mr-2 h-4 w-4" />
                            Cancelar Pedido
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
