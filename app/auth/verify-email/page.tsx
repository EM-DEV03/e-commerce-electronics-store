"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export default function VerifyEmailPage() {
  const router = useRouter()
  const { state } = useAuth()

  const handleContinueWithoutVerification = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Verifica tu correo</CardTitle>
            <CardDescription>Te hemos enviado un enlace de verificación</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Revisa tu bandeja de entrada y haz clic en el enlace de verificación para activar tu cuenta.
            </p>
            <p className="text-xs text-gray-500 mb-6">Si no ves el correo, revisa tu carpeta de spam.</p>

            <div className="border-t pt-4">
              <p className="text-xs text-gray-500 mb-3">¿Quieres verificar tu correo más tarde?</p>
              <Button variant="outline" onClick={handleContinueWithoutVerification} className="w-full bg-transparent">
                Continuar sin verificar
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
