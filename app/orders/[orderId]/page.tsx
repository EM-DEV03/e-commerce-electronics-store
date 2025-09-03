"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Package, Truck, CheckCircle, ArrowLeft, Download, MessageCircle, Zap } from "lucide-react"
import Link from "next/link"

interface Order {
  id: string
  items: Array<{
    id: number
    name: string
    price: number
    quantity: number
    image: string
    category: string
  }>
  total: number
  shippingInfo: {
    fullName: string
    email: string
    phone: string
    address: string
    city: string
    department: string
  }
  paymentMethod: string
  status: string
  createdAt: string
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { state: authState } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authState.isLoading && !authState.isAuthenticated) {
      router.push("/login")
      return
    }

    if (authState.isAuthenticated) {
      const orderId = params.orderId as string
      const allOrders = JSON.parse(localStorage.getItem("electrotech-orders") || "[]")
      const foundOrder = allOrders.find(
        (o: Order) => o.id === orderId && o.shippingInfo.email === authState.user?.email,
      )

      if (foundOrder) {
        setOrder(foundOrder)
      } else {
        router.push("/orders")
      }
    }
    setIsLoading(false)
  }, [params.orderId, authState, router])

  const getStatusProgress = (status: string) => {
    switch (status) {
      case "confirmed":
        return 25
      case "processing":
        return 50
      case "shipped":
        return 75
      case "delivered":
        return 100
      default:
        return 0
    }
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

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "credit_card":
        return "Tarjeta de Crédito/Débito"
      case "pse":
        return "PSE (Pagos Seguros en Línea)"
      case "cash":
        return "Pago Contra Entrega"
      default:
        return method
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (authState.isLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Zap className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Cargando detalles del pedido...</p>
        </div>
      </div>
    )
  }

  if (!authState.isAuthenticated || !order) {
    return null
  }

  const shippingCost = 15000
  const totalWithShipping = order.total + shippingCost

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <Link href="/orders" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a mis pedidos
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Pedido {order.id}</h1>
              <p className="text-muted-foreground">Realizado el {formatDate(order.createdAt)}</p>
            </div>
            {getStatusBadge(order.status)}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status Tracking */}
            <Card>
              <CardHeader>
                <CardTitle>Estado del Pedido</CardTitle>
                <CardDescription>Seguimiento de tu compra</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progreso del pedido</span>
                    <span>{getStatusProgress(order.status)}%</span>
                  </div>
                  <Progress value={getStatusProgress(order.status)} className="h-2" />
                </div>

                <div className="space-y-4">
                  <div
                    className={`flex items-center space-x-3 ${order.status === "confirmed" || order.status === "processing" || order.status === "shipped" || order.status === "delivered" ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${order.status === "confirmed" || order.status === "processing" || order.status === "shipped" || order.status === "delivered" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Pedido Confirmado</p>
                      <p className="text-sm text-muted-foreground">Tu pedido ha sido recibido y confirmado</p>
                    </div>
                  </div>

                  <div
                    className={`flex items-center space-x-3 ${order.status === "processing" || order.status === "shipped" || order.status === "delivered" ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${order.status === "processing" || order.status === "shipped" || order.status === "delivered" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                    >
                      <Package className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Preparando Pedido</p>
                      <p className="text-sm text-muted-foreground">Estamos preparando tus productos</p>
                    </div>
                  </div>

                  <div
                    className={`flex items-center space-x-3 ${order.status === "shipped" || order.status === "delivered" ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${order.status === "shipped" || order.status === "delivered" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                    >
                      <Truck className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">En Camino</p>
                      <p className="text-sm text-muted-foreground">Tu pedido está en camino</p>
                    </div>
                  </div>

                  <div
                    className={`flex items-center space-x-3 ${order.status === "delivered" ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${order.status === "delivered" ? "bg-green-500 text-white" : "bg-muted"}`}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Entregado</p>
                      <p className="text-sm text-muted-foreground">Tu pedido ha sido entregado</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Productos Pedidos</CardTitle>
                <CardDescription>{order.items.length} productos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="h-16 w-16 rounded-md object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium line-clamp-2">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">{item.category}</p>
                        <p className="text-sm text-muted-foreground">Cantidad: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${(item.price * item.quantity).toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">${item.price.toLocaleString()} c/u</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping & Payment Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información de Envío</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium">{order.shippingInfo.fullName}</p>
                    <p className="text-sm text-muted-foreground">{order.shippingInfo.phone}</p>
                    <p className="text-sm">
                      {order.shippingInfo.address}
                      <br />
                      {order.shippingInfo.city}, {order.shippingInfo.department}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Información de Pago</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Método:</span>
                      <span className="font-medium">{getPaymentMethodText(order.paymentMethod)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estado:</span>
                      <Badge className="bg-green-100 text-green-800">Pagado</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Order Summary & Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${order.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Envío</span>
                    <span>${shippingCost.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${totalWithShipping.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button className="w-full bg-transparent" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Descargar Factura
              </Button>
              <Button className="w-full bg-transparent" variant="outline">
                <MessageCircle className="h-4 w-4 mr-2" />
                Contactar Soporte
              </Button>
              <Button className="w-full" asChild>
                <Link href="/">Continuar Comprando</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
