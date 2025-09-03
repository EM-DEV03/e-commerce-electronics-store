import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"
import { ServiceCard } from "@/components/service-card"
import { getAllServices } from "@/lib/services"

export default async function ServicesPage() {
  const services = await getAllServices().catch(() => [])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Nuestros Servicios</h1>
          <p className="text-xl text-muted-foreground">
            Servicios técnicos especializados para tus proyectos y equipos electrónicos
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar servicios..." className="pl-10" />
          </div>
          <Button variant="outline" className="md:w-auto bg-transparent">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {services.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Los servicios estarán disponibles próximamente. Por favor ejecuta el script de servicios para ver el
              contenido completo.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
