"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"

// Mock products data
const mockProducts = [
  {
    id: 1,
    name: "Arduino Uno R3",
    category: "Microcontroladores",
    price: 89000,
    stock: 25,
    status: "active",
    image: "/arduino-microcontroller-board.png",
  },
  {
    id: 2,
    name: "Kit Sensores IoT",
    category: "Kits Educativos",
    price: 156000,
    stock: 12,
    status: "active",
    image: "/iot-sensors-kit-electronic-components.png",
  },
  {
    id: 3,
    name: "Raspberry Pi 4 Model B",
    category: "Computadoras",
    price: 340000,
    stock: 8,
    status: "active",
    image: "/raspberry-pi-4-single-board-computer.png",
  },
  {
    id: 4,
    name: "Multímetro Digital",
    category: "Herramientas",
    price: 78000,
    stock: 0,
    status: "out_of_stock",
    image: "/digital-multimeter-electronic-tool.png",
  },
  {
    id: 5,
    name: "Kit Robótica Educativa",
    category: "Kits Educativos",
    price: 245000,
    stock: 15,
    status: "active",
    image: "/educational-robotics-kit-motors-sensors.png",
  },
  {
    id: 6,
    name: "Protoboard 830 Puntos",
    category: "Componentes",
    price: 25000,
    stock: 45,
    status: "active",
    image: "/electronic-breadboard-prototype-board.png",
  },
]

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [products] = useState(mockProducts)

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: string, stock: number) => {
    if (status === "out_of_stock" || stock === 0) {
      return <Badge variant="destructive">Agotado</Badge>
    }
    if (stock < 10) {
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          Stock Bajo
        </Badge>
      )
    }
    return (
      <Badge variant="secondary" className="bg-green-100 text-green-800">
        Disponible
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Productos</h1>
          <p className="text-muted-foreground">Administra tu catálogo de productos</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Agregar Producto
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Productos</CardTitle>
          <CardDescription>
            Lista completa de productos en tu tienda ({filteredProducts.length} productos)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-[70px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="h-10 w-10 rounded-md object-cover"
                        />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">ID: {product.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="font-medium">${product.price.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={product.stock < 10 ? "text-red-600 font-medium" : ""}>
                        {product.stock} unidades
                      </span>
                    </TableCell>
                    <TableCell>{getStatusBadge(product.status, product.stock)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
