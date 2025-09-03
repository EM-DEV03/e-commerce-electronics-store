"use client"

import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Star } from "lucide-react"
import { toast } from "sonner"

interface Product {
  id: string // Changed from number to string for UUID compatibility
  name: string
  description: string
  price: number
  originalPrice: number | null
  image: string
  category: string
  rating: number
  inStock: boolean
  isNew: boolean
  discount: number
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { dispatch } = useCart()

  const addToCart = () => {
    if (!product.inStock) return

    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
      },
    })

    toast.success(`${product.name} agregado al carrito`, {
      description: `Precio: $${product.price.toLocaleString()}`,
    })
  }

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="relative">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {product.isNew && <Badge className="bg-primary text-primary-foreground">Nuevo</Badge>}
          {product.discount > 0 && <Badge variant="destructive">-{product.discount}%</Badge>}
        </div>
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Agotado
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className="text-xs mb-2">
            {product.category}
          </Badge>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-muted-foreground">{product.rating}</span>
          </div>
        </div>
        <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
        <CardDescription className="line-clamp-2">{product.description}</CardDescription>
      </CardHeader>

      <CardFooter className="pt-0">
        <div className="w-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">${product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>
          <Button className="w-full" disabled={!product.inStock} onClick={addToCart}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.inStock ? "Agregar al Carrito" : "Agotado"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
