import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"
import Link from "next/link"
import { ProductCard } from "@/components/product-card"
import { getAllProducts, getCategories } from "@/lib/products"

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([getAllProducts(), getCategories()])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Filtros</h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Categorías</h4>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/categories/${category.slug}`}
                          className="block text-sm text-muted-foreground hover:text-primary"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Catálogo de Productos</h1>
                <p className="text-muted-foreground">
                  Encuentra todos nuestros componentes electrónicos y kits educativos
                </p>
              </div>

              <div className="flex gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Buscar productos..." className="pl-10 w-64" />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    originalPrice: null,
                    image: product.image_url,
                    category: product.category?.name || "Sin categoría",
                    rating: 4.5,
                    inStock: product.stock > 0,
                    isNew: product.is_featured,
                    discount: 0,
                  }}
                />
              ))}
            </div>

            {products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No se encontraron productos.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
