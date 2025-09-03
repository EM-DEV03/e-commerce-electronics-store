"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Search, Package, Truck, CheckCircle, Clock, Eye, ArrowLeft, Zap } from "lucide-react"
import Link from "next/link"
import { getUserOrders, type Order } from "@/lib/orders"
import { toast } from "sonner"

export default function OrdersPage() {
  const { state: authState } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authState.isLoading && !authState.isAuthenticated) {
      router.push("/login")
      return
    }

    if (authState.isAuthenticated) {
      loadOrders()
    }
  }, [authState, router])

  const loadOrders = async () => {
    try {
      setIsLoading(true)
      const userOrders = await getUserOrders()
      setOrders(userOrders)
    } catch (error) {
      console.error("Error loading orders:", error)
      toast.error("Error cargando los pedidos")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredOrders = orders.filter((order) => order.id.toLowerCase().includes(searchTerm.toLowerCase()))

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800">Procesando</Badge>
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "processing":
        return <Package className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "credit_card":
        return "Tarjeta de Crédito/Débito"
      case "pse":
        return "PSE"
      case "cash":
        return "Pago Contra Entrega"
      default:
        return method
    }
  }

  if (authState.isLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Zap className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Cargando tus pedidos...</p>
        </div>
      </div>
    )
  }

  if (!authState.isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a la tienda
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Mis Pedidos</h1>
          <p className="text-muted-foreground">Revisa el estado de tus compras</p>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Package className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No tienes pedidos aún</h3>
              <p className="text-muted-foreground mb-6">Cuando realices tu primera compra, aparecerá aquí</p>
              <Button asChild>
                <Link href="/">Comenzar a Comprar</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Search */}
            <Card>
              <CardContent className="pt-6">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por número de pedido..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">Pedido {order.id}</CardTitle>
                        <CardDescription>
                          Realizado el {formatDate(order.created_at)} • {getPaymentMethodText(order.payment_method)}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        {getStatusBadge(order.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Order Items */}
                      <div className="space-y-3">
                        {order.items.slice(0, 2).map((item) => (
                          <div key={item.id} className="flex items-center space-x-3">
                            <img
                              src={item.product_image || "/placeholder.svg"}
                              alt={item.product_name}
                              className="h-12 w-12 rounded-md object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium line-clamp-1">{item.product_name}</p>
                              <p className="text-xs text-muted-foreground">
                                Cantidad: {item.quantity} • ${item.price.toLocaleString()} c/u
                              </p>
                            </div>
                            <p className="text-sm font-semibold">${(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-sm text-muted-foreground">+{order.items.length - 2} productos más</p>
                        )}
                      </div>

                      <Separator />

                      {/* Order Summary */}
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Envío a: {order.shipping_address}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.items.length} productos • Total: ${(order.total + 15000).toLocaleString()}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/orders/${order.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalles
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
