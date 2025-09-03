import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Star } from "lucide-react"
import type { Service } from "@/lib/services"

interface ServiceCardProps {
  service: Service
}

export function ServiceCard({ service }: ServiceCardProps) {
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
    <Card className="group hover:shadow-lg transition-all duration-300 border-gray-100 hover:border-blue-200">
      <CardHeader className="p-0">
        <div className="relative aspect-video overflow-hidden rounded-t-lg">
          <Image
            src={service.image_url || "/placeholder.svg?height=200&width=300&query=servicio técnico"}
            alt={service.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {service.is_featured && (
            <Badge className="absolute top-3 left-3 bg-blue-600 hover:bg-blue-700">
              <Star className="w-3 h-3 mr-1" />
              Destacado
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              {service.category?.name}
            </Badge>
            {service.duration_hours && (
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="w-3 h-3 mr-1" />
                {formatDuration(service.duration_hours)}
              </div>
            )}
          </div>

          <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {service.name}
          </h3>

          <p className="text-sm text-gray-600 line-clamp-2">{service.short_description}</p>

          <div className="pt-2">
            <span className="text-2xl font-bold text-blue-600">{formatPrice(service.price)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 space-y-2">
        <Link href={`/services/${service.id}`} className="w-full">
          <Button className="w-full bg-blue-600 hover:bg-blue-700">Ver Detalles</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
