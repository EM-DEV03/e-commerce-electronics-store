import { notFound } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Clock, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getServiceById } from "@/lib/services"

interface ServicePageProps {
  params: {
    id: string
  }
}

export default async function ServicePage({ params }: ServicePageProps) {
  const service = await getServiceById(params.id).catch(() => null)

  if (!service) {
    notFound()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDuration = (hours: number | null) => {
    if (!hours) return "Duración variable"
    if (hours < 24) return `${hours} horas`
    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24
    if (remainingHours === 0) return `${days} días`
    return `${days} días ${remainingHours}h`
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/services" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Servicios
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Service Image */}
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <Image
              src={service.image_url || "/placeholder.svg?height=400&width=600&query=servicio técnico"}
              alt={service.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Service Details */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-2">{service.category?.name}</Badge>
              <h1 className="text-3xl font-bold text-foreground mb-4">{service.name}</h1>
              <p className="text-lg text-muted-foreground">{service.short_description}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold text-primary">{formatPrice(service.price)}</div>
              {service.duration_hours && (
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatDuration(service.duration_hours)}
                </div>
              )}
            </div>

            <Button size="lg" className="w-full">
              Solicitar Servicio
            </Button>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  ¿Qué incluye?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-line">{service.deliverables}</p>
              </CardContent>
            </Card>

            {service.requirements && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
                    Requisitos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-line">{service.requirements}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Service Description */}
        <div className="mt-12">
          <Separator className="mb-8" />
          <h2 className="text-2xl font-bold mb-4">Descripción Detallada</h2>
          <div className="prose max-w-none">
            <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{service.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
