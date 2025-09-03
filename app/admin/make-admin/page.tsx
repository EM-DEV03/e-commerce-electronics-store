"use client"

import { useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"
import { redirect } from "next/navigation"

export default function MakeAdminPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { state } = useAuth()

  // Solo permitir acceso a admins existentes
  if (!state.isLoading && (!state.isAuthenticated || state.user?.role !== "admin")) {
    redirect("/")
  }

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const makeUserAdmin = async () => {
    if (!email) {
      toast.error("Por favor ingresa un email")
      return
    }

    setIsLoading(true)
    try {
      const { data, error } = await supabase.from("profiles").update({ role: "admin" }).eq("email", email).select()

      if (error) throw error

      if (data && data.length > 0) {
        toast.success(`Usuario ${email} ahora es administrador`)
        setEmail("")
      } else {
        toast.error("No se encontró un usuario con ese email")
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("Error al actualizar el usuario")
    } finally {
      setIsLoading(false)
    }
  }

  if (state.isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Hacer Usuario Administrador</CardTitle>
          <CardDescription>Convierte un usuario existente en administrador del sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="email@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button onClick={makeUserAdmin} disabled={isLoading} className="w-full">
            {isLoading ? "Procesando..." : "Hacer Administrador"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
