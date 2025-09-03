import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { CartDrawer } from "@/components/cart-drawer"
import { ProductCard } from "@/components/product-card"
import { UserMenu } from "@/components/user-menu"
import { getProductsByCategory, getCategoryBySlug } from "@/lib/products"
import { notFound } from "next/navigation"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const [category, products] = await Promise.all([getCategoryBySlug(params.slug), getProductsByCategory(params.slug)])

  if (!category) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-xl font-bold text-foreground">ElectroTech</span>
              </Link>
            </div>

            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Buscar productos..." className="pl-10 pr-4" />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <UserMenu />
              <CartDrawer />
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-primary">
              Inicio
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">{category.name}</span>
          </div>
        </div>
      </div>

      {/* Category Header */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{category.name}</h1>
              <p className="text-muted-foreground">{products.length} productos disponibles</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al inicio
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    originalPrice: product.original_price,
                    image: product.image_url,
                    category: product.category?.name || "Sin categoría",
                    rating: product.rating,
                    inStock: product.stock > 0,
                    isNew: product.is_new,
                    discount: product.discount,
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold mb-2">No hay productos disponibles</h3>
              <p className="text-muted-foreground mb-6">Pronto agregaremos productos a esta categoría.</p>
              <Button asChild>
                <Link href="/">Ver todas las categorías</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
