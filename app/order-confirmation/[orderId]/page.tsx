"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Package, Truck, Home, Download, Zap } from "lucide-react"
import Link from "next/link"

interface Order {
  id: string
  items: Array<{
    id: number
    name: string
    price: number
    quantity: number
    image: string
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

export default function OrderConfirmationPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const orderId = params.orderId as string
    const orders = JSON.parse(localStorage.getItem("electrotech-orders") || "[]")
    const foundOrder = orders.find((o: Order) => o.id === orderId)

    if (foundOrder) {
      setOrder(foundOrder)
    } else {
      router.push("/")
    }
    setIsLoading(false)
  }, [params.orderId, router])

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Zap className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Cargando confirmación...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return null
  }

  const shippingCost = 15000
  const totalWithShipping = order.total + shippingCost

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">¡Pedido Confirmado!</h1>
          <p className="text-muted-foreground">
            Tu pedido <span className="font-semibold">{order.id}</span> ha sido procesado exitosamente
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle>Estado del Pedido</CardTitle>
                <CardDescription>Seguimiento de tu compra</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Pedido Confirmado</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("es-CO", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Confirmado</Badge>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center space-x-3 text-muted-foreground">
                    <Package className="h-4 w-4" />
                    <span className="text-sm">Preparando pedido (1-2 días hábiles)</span>
                  </div>
                  <div className="flex items-center space-x-3 text-muted-foreground">
                    <Truck className="h-4 w-4" />
                    <span className="text-sm">Envío a {order.shippingInfo.city} (2-5 días hábiles)</span>
                  </div>
                  <div className="flex items-center space-x-3 text-muted-foreground">
                    <Home className="h-4 w-4" />
                    <span className="text-sm">Entrega en tu domicilio</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle>Información de Envío</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{order.shippingInfo.fullName}</p>
                  <p className="text-sm text-muted-foreground">{order.shippingInfo.email}</p>
                  <p className="text-sm text-muted-foreground">{order.shippingInfo.phone}</p>
                  <p className="text-sm">
                    {order.shippingInfo.address}
                    <br />
                    {order.shippingInfo.city}, {order.shippingInfo.department}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle>Información de Pago</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span>Método de pago:</span>
                  <span className="font-medium">{getPaymentMethodText(order.paymentMethod)}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span>Estado del pago:</span>
                  <Badge className="bg-green-100 text-green-800">Pagado</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
                <CardDescription>#{order.id}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="h-12 w-12 rounded-md object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Cantidad: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold">${(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}

                <Separator />

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

            {/* Actions */}
            <div className="space-y-3">
              <Button className="w-full bg-transparent" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Descargar Factura
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
