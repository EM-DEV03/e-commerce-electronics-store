import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Search,
  Star,
  Zap,
  Cpu,
  Smartphone,
  Headphones,
  Monitor,
  Code,
  Wrench,
  Settings,
  PenTool as Tool,
} from "lucide-react"
import Link from "next/link"
import { CartDrawer } from "@/components/cart-drawer"
import { ProductCard } from "@/components/product-card"
import { ServiceCard } from "@/components/service-card"
import { UserMenu } from "@/components/user-menu"
import { getFeaturedProducts, getCategoriesWithProductCount } from "@/lib/products"
import { getFeaturedServices } from "@/lib/services"

export default async function HomePage() {
  const [featuredProducts, categories, featuredServices] = await Promise.all([
    getFeaturedProducts(),
    getCategoriesWithProductCount(),
    getFeaturedServices().catch(() => []), // Return empty array if services table doesn't exist
  ])

  const categoryIcons: Record<string, any> = {
    Microcontroladores: Cpu,
    Sensores: Zap,
    "Kits Educativos": Monitor,
    Herramientas: Smartphone,
    Componentes: Headphones,
    Programación: Code,
    "Servicio Técnico": Wrench,
    Mantenimiento: Settings,
    Reparación: Tool,
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <Zap className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold text-foreground">ElectroTech</span>
              </Link>
            </div>

            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Buscar productos y servicios..." className="pl-10 pr-4" />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <UserMenu />
              <CartDrawer />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/5 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Componentes Electrónicos y Servicios Técnicos
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              Todo lo que necesitas para tus proyectos: productos electrónicos, desarrollo de software, reparaciones y
              mantenimiento técnico. Desde Sincelejo para toda Colombia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" className="text-lg px-8">
                  Ver Catálogo
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                  Ver Servicios
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Categorías Principales</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category) => {
              const IconComponent = categoryIcons[category.name] || Zap
              return (
                <Link key={category.id} href={`/categories/${category.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardContent className="p-6 text-center">
                      <IconComponent className="h-12 w-12 mx-auto mb-4 text-primary group-hover:scale-110 transition-transform" />
                      <h3 className="font-semibold text-foreground mb-2">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.product_count} productos</p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      {featuredServices.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-bold text-foreground">Servicios Destacados</h2>
              <Link href="/services">
                <Button variant="outline">Ver Todos los Servicios</Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Productos Destacados</h2>
            <Link href="/products">
              <Button variant="outline">Ver Todos</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  id: product.id,
                  name: product.name,
                  description: product.description,
                  price: product.price,
                  originalPrice: null, // Set to null since schema doesn't have original_price
                  image: product.image_url,
                  category: product.category?.name || "Sin categoría",
                  rating: 4.5, // Default rating since schema doesn't have rating field
                  inStock: product.stock > 0, // Use stock > 0 instead of in_stock
                  isNew: product.is_featured, // Use is_featured instead of is_new
                  discount: 0, // Default discount since schema doesn't have discount field
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Envío Rápido</h3>
              <p className="text-muted-foreground">
                Envíos a toda Colombia desde Sincelejo. Entrega en 2-5 días hábiles.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Calidad Garantizada</h3>
              <p className="text-muted-foreground">Productos originales con garantía. Soporte técnico especializado.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Desarrollo de Software</h3>
              <p className="text-muted-foreground">
                Creamos aplicaciones web, sistemas de inventario y software personalizado.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wrench className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Servicio Técnico</h3>
              <p className="text-muted-foreground">
                Reparación, mantenimiento y soporte técnico especializado a domicilio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">ElectroTech</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Tu tienda de confianza para componentes electrónicos y kits educativos en Colombia.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Productos</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/categories/microcontroladores" className="hover:text-primary">
                    Microcontroladores
                  </Link>
                </li>
                <li>
                  <Link href="/categories/sensores" className="hover:text-primary">
                    Sensores
                  </Link>
                </li>
                <li>
                  <Link href="/categories/kits-educativos" className="hover:text-primary">
                    Kits Educativos
                  </Link>
                </li>
                <li>
                  <Link href="/categories/herramientas" className="hover:text-primary">
                    Herramientas
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/help" className="hover:text-primary">
                    Centro de Ayuda
                  </Link>
                </li>
                <li>
                  <Link href="/tutorials" className="hover:text-primary">
                    Tutoriales
                  </Link>
                </li>
                <li>
                  <Link href="/warranty" className="hover:text-primary">
                    Garantías
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-primary">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Sincelejo, Sucre, Colombia</p>
                <p>WhatsApp: +57 300 123 4567</p>
                <p>Email: info@electrotech.co</p>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 ElectroTech. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
