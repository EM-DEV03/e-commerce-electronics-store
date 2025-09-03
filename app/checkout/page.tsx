"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Building2, Banknote, Lock, ArrowLeft, Zap } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { createOrder } from "@/lib/orders"

export default function CheckoutPage() {
  const { state: authState } = useAuth()
  const { state: cartState, dispatch: cartDispatch } = useCart()
  const router = useRouter()

  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("credit_card")
  const [formData, setFormData] = useState({
    // Shipping info
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    department: "",
    postalCode: "",
    // Payment info
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    // PSE info
    bankCode: "",
    documentType: "CC",
    documentNumber: "",
  })

  useEffect(() => {
    if (!authState.isLoading && !authState.isAuthenticated) {
      router.push("/login")
    }
    if (authState.user) {
      setFormData((prev) => ({
        ...prev,
        fullName: authState.user.name,
        email: authState.user.email,
      }))
    }
  }, [authState, router])

  useEffect(() => {
    if (cartState.items.length === 0) {
      router.push("/")
    }
  }, [cartState.items.length, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    const required = ["fullName", "email", "phone", "address", "city", "department"]
    for (const field of required) {
      if (!formData[field as keyof typeof formData]) {
        toast.error(`El campo ${field} es requerido`)
        return false
      }
    }

    if (paymentMethod === "credit_card") {
      const cardRequired = ["cardNumber", "cardName", "expiryDate", "cvv"]
      for (const field of cardRequired) {
        if (!formData[field as keyof typeof formData]) {
          toast.error(`El campo ${field} es requerido`)
          return false
        }
      }
    }

    if (paymentMethod === "pse") {
      if (!formData.bankCode || !formData.documentNumber) {
        toast.error("Selecciona un banco e ingresa tu número de documento")
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsProcessing(true)

    try {
      const shippingAddress = `${formData.address}, ${formData.city}, ${formData.department} ${formData.postalCode}`

      const order = await createOrder({
        items: cartState.items,
        total: cartState.total,
        shippingAddress,
        paymentMethod,
      })

      // Clear cart
      cartDispatch({ type: "CLEAR_CART" })

      toast.success("¡Pedido creado exitosamente!")
      router.push(`/order-confirmation/${order.id}`)
    } catch (error) {
      console.error("Error creating order:", error)
      toast.error("Error al crear el pedido. Intenta nuevamente.")
    } finally {
      setIsProcessing(false)
    }
  }

  const shippingCost = 15000
  const totalWithShipping = cartState.total + shippingCost

  if (authState.isLoading || cartState.items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Zap className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Cargando checkout...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a la tienda
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Finalizar Compra</h1>
          <p className="text-muted-foreground">Completa tu pedido de forma segura</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Información de Envío</CardTitle>
                  <CardDescription>Ingresa los datos para la entrega de tu pedido</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Nombre completo</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+57 300 123 4567"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Código postal</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Dirección completa</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Calle, carrera, número, apartamento, etc."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">Ciudad</Label>
                      <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required />
                    </div>
                    <div>
                      <Label htmlFor="department">Departamento</Label>
                      <Input
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Método de Pago
                  </CardTitle>
                  <CardDescription>Selecciona tu método de pago preferido</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="credit_card" id="credit_card" />
                      <Label htmlFor="credit_card" className="flex items-center gap-2 cursor-pointer flex-1">
                        <CreditCard className="h-4 w-4" />
                        Tarjeta de Crédito/Débito
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="pse" id="pse" />
                      <Label htmlFor="pse" className="flex items-center gap-2 cursor-pointer flex-1">
                        <Building2 className="h-4 w-4" />
                        PSE (Pagos Seguros en Línea)
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer flex-1">
                        <Banknote className="h-4 w-4" />
                        Pago Contra Entrega
                      </Label>
                    </div>
                  </RadioGroup>

                  {/* Credit Card Form */}
                  {paymentMethod === "credit_card" && (
                    <div className="mt-6 space-y-4">
                      <div>
                        <Label htmlFor="cardNumber">Número de tarjeta</Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="cardName">Nombre en la tarjeta</Label>
                        <Input
                          id="cardName"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Fecha de vencimiento</Label>
                          <Input
                            id="expiryDate"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            placeholder="MM/AA"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            placeholder="123"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PSE Form */}
                  {paymentMethod === "pse" && (
                    <div className="mt-6 space-y-4">
                      <div>
                        <Label htmlFor="bankCode">Selecciona tu banco</Label>
                        <select
                          id="bankCode"
                          name="bankCode"
                          value={formData.bankCode}
                          onChange={(e) => setFormData((prev) => ({ ...prev, bankCode: e.target.value }))}
                          className="w-full p-2 border rounded-md"
                          required
                        >
                          <option value="">Selecciona un banco</option>
                          <option value="bancolombia">Bancolombia</option>
                          <option value="davivienda">Davivienda</option>
                          <option value="bbva">BBVA</option>
                          <option value="banco_bogota">Banco de Bogotá</option>
                          <option value="banco_popular">Banco Popular</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="documentType">Tipo de documento</Label>
                          <select
                            id="documentType"
                            name="documentType"
                            value={formData.documentType}
                            onChange={(e) => setFormData((prev) => ({ ...prev, documentType: e.target.value }))}
                            className="w-full p-2 border rounded-md"
                          >
                            <option value="CC">Cédula de Ciudadanía</option>
                            <option value="CE">Cédula de Extranjería</option>
                            <option value="NIT">NIT</option>
                          </select>
                        </div>
                        <div>
                          <Label htmlFor="documentNumber">Número de documento</Label>
                          <Input
                            id="documentNumber"
                            name="documentNumber"
                            value={formData.documentNumber}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Cash Payment Info */}
                  {paymentMethod === "cash" && (
                    <Alert className="mt-6">
                      <Banknote className="h-4 w-4" />
                      <AlertDescription>
                        Pagarás en efectivo al momento de recibir tu pedido. Asegúrate de tener el monto exacto.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
                {isProcessing ? "Procesando pago..." : `Pagar $${totalWithShipping.toLocaleString()}`}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartState.items.map((item) => (
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
                    <span>${cartState.total.toLocaleString()}</span>
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

                <div className="pt-4">
                  <Badge variant="secondary" className="w-full justify-center py-2">
                    <Lock className="h-3 w-3 mr-1" />
                    Pago 100% Seguro
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
