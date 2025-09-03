import { createClient } from "@/lib/supabase/client"

export interface Service {
  id: string
  name: string
  description: string
  short_description: string | null
  category_id: string
  price: number
  duration_hours: number | null
  is_featured: boolean
  is_active: boolean
  image_url: string | null
  requirements: string | null
  deliverables: string | null
  created_at: string
  updated_at: string
  category?: {
    id: string
    name: string
    slug: string
  }
}

const STATIC_SERVICES: Service[] = [
  {
    id: "1",
    name: "Desarrollo de Páginas Web",
    description:
      "Diseño y desarrollo de sitios web profesionales, responsivos y optimizados para SEO. Incluye diseño personalizado, desarrollo frontend y backend, integración con bases de datos y sistemas de gestión de contenido.",
    short_description: "Sitios web profesionales y responsivos",
    category_id: "web-dev",
    price: 800000,
    duration_hours: 80,
    is_featured: true,
    is_active: true,
    image_url: "/web-development-coding.png",
    requirements: "Información del negocio, contenido, imágenes, dominio y hosting",
    deliverables: "Sitio web completo, código fuente, documentación técnica",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    category: { id: "web-dev", name: "Desarrollo Web", slug: "desarrollo-web" },
  },
  {
    id: "2",
    name: "Landing Pages",
    description:
      "Creación de páginas de aterrizaje atractivas y optimizadas para conversión. Diseño enfocado en generar leads y ventas para campañas específicas o productos.",
    short_description: "Páginas de aterrizaje para campañas",
    category_id: "web-dev",
    price: 300000,
    duration_hours: 24,
    is_featured: true,
    is_active: true,
    image_url: "/modern-landing-page.png",
    requirements: "Objetivos de la campaña, contenido, imágenes",
    deliverables: "Landing page optimizada, análisis de conversión",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    category: { id: "web-dev", name: "Desarrollo Web", slug: "desarrollo-web" },
  },
  {
    id: "3",
    name: "Desarrollo E-commerce",
    description:
      "Desarrollo de tiendas en línea completas con integración de pagos, gestión de productos, carrito de compras, seguimiento de pedidos y panel administrativo.",
    short_description: "Tiendas en línea completas",
    category_id: "web-dev",
    price: 1500000,
    duration_hours: 120,
    is_featured: true,
    is_active: true,
    image_url: "/ecommerce-online-store.png",
    requirements: "Catálogo de productos, métodos de pago, información legal",
    deliverables: "Tienda online completa, panel admin, documentación",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    category: { id: "web-dev", name: "Desarrollo Web", slug: "desarrollo-web" },
  },
  {
    id: "4",
    name: "Tareas de Programación",
    description:
      "Desarrollo de proyectos personalizados en diversos lenguajes: JavaScript, Python, Java, PHP. Desde aplicaciones simples hasta sistemas complejos.",
    short_description: "Proyectos en múltiples lenguajes",
    category_id: "programming",
    price: 50000,
    duration_hours: 4,
    is_featured: true,
    is_active: true,
    image_url: "/programming-code-development.png",
    requirements: "Especificaciones del proyecto, lenguaje preferido",
    deliverables: "Código fuente, documentación, pruebas",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    category: { id: "programming", name: "Programación", slug: "programacion" },
  },
  {
    id: "5",
    name: "Creación de Scripts",
    description:
      "Automatización de tareas repetitivas mediante scripts en Python, JavaScript, Bash. Optimiza procesos y ahorra tiempo en tareas rutinarias.",
    short_description: "Automatización de tareas",
    category_id: "programming",
    price: 80000,
    duration_hours: 8,
    is_featured: true,
    is_active: true,
    image_url: "/automation-scripts-coding.png",
    requirements: "Descripción de la tarea a automatizar",
    deliverables: "Script funcional, documentación de uso",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    category: { id: "programming", name: "Programación", slug: "programacion" },
  },
  {
    id: "6",
    name: "Mantenimiento de Computadores",
    description:
      "Reparación y mantenimiento de PCs de escritorio, portátiles y servidores. Incluye limpieza, actualización de componentes y optimización del sistema.",
    short_description: "Reparación de PCs y portátiles",
    category_id: "repair",
    price: 120000,
    duration_hours: 3,
    is_featured: true,
    is_active: true,
    image_url: "/computer-repair-maintenance.png",
    requirements: "Descripción del problema, modelo del equipo",
    deliverables: "Equipo reparado, reporte de mantenimiento",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    category: { id: "repair", name: "Reparación", slug: "reparacion" },
  },
  {
    id: "7",
    name: "Instalación de Sistemas Operativos",
    description:
      "Instalación y optimización de Windows, Linux y otros sistemas operativos. Configuración inicial y transferencia de datos.",
    short_description: "Instalación de Windows y Linux",
    category_id: "support",
    price: 80000,
    duration_hours: 2,
    is_featured: false,
    is_active: true,
    image_url: "/operating-system-installation.png",
    requirements: "Licencia del sistema operativo, respaldo de datos",
    deliverables: "Sistema operativo instalado y configurado",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    category: { id: "support", name: "Soporte Técnico", slug: "soporte-tecnico" },
  },
  {
    id: "8",
    name: "Recuperación de Datos",
    description:
      "Servicios de recuperación de archivos y particiones perdidas en discos duros, SSD y dispositivos de almacenamiento.",
    short_description: "Recuperación de archivos perdidos",
    category_id: "support",
    price: 200000,
    duration_hours: 6,
    is_featured: false,
    is_active: true,
    image_url: "/data-recovery-hard-drive.png",
    requirements: "Dispositivo de almacenamiento afectado",
    deliverables: "Archivos recuperados, reporte del proceso",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    category: { id: "support", name: "Soporte Técnico", slug: "soporte-tecnico" },
  },
  {
    id: "9",
    name: "Reparación de Teléfonos Móviles",
    description:
      "Reparación de smartphones y tabletas: cambio de pantalla, batería, reparación de componentes internos y diagnóstico de fallos.",
    short_description: "Reparación de smartphones y tablets",
    category_id: "repair",
    price: 150000,
    duration_hours: 2,
    is_featured: false,
    is_active: true,
    image_url: "/smartphone-repair-screen.png",
    requirements: "Dispositivo a reparar, descripción del problema",
    deliverables: "Dispositivo reparado, garantía del servicio",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    category: { id: "repair", name: "Reparación", slug: "reparacion" },
  },
  {
    id: "10",
    name: "Reparación de Componentes Electrónicos",
    description:
      "Diagnóstico y reparación de circuitos, placas base, fuentes de poder y otros componentes electrónicos especializados.",
    short_description: "Reparación de circuitos y placas",
    category_id: "repair",
    price: 100000,
    duration_hours: 4,
    is_featured: false,
    is_active: true,
    image_url: "/electronic-circuit-repair.png",
    requirements: "Componente a reparar, esquemas si están disponibles",
    deliverables: "Componente reparado, reporte técnico",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    category: { id: "repair", name: "Reparación", slug: "reparacion" },
  },
  {
    id: "11",
    name: "Consultoría Tecnológica",
    description:
      "Asesoría personalizada sobre soluciones digitales, hardware, redes y software. Análisis de necesidades y recomendaciones técnicas.",
    short_description: "Asesoría en soluciones tecnológicas",
    category_id: "consulting",
    price: 120000,
    duration_hours: 2,
    is_featured: false,
    is_active: true,
    image_url: "/technology-consulting-advice.png",
    requirements: "Descripción de la necesidad o proyecto",
    deliverables: "Reporte de consultoría, recomendaciones",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    category: { id: "consulting", name: "Consultoría", slug: "consultoria" },
  },
  {
    id: "12",
    name: "Desarrollo de Software a Medida",
    description:
      "Creación de aplicaciones, sistemas internos y soluciones personalizadas según las necesidades específicas del cliente.",
    short_description: "Aplicaciones y sistemas personalizados",
    category_id: "consulting",
    price: 2000000,
    duration_hours: 160,
    is_featured: false,
    is_active: true,
    image_url: "/custom-software-development.png",
    requirements: "Especificaciones detalladas del sistema",
    deliverables: "Software completo, código fuente, documentación",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    category: { id: "consulting", name: "Consultoría", slug: "consultoria" },
  },
]

export async function getFeaturedServices(): Promise<Service[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("services")
      .select(`
        *,
        category:categories(id, name, slug)
      `)
      .eq("is_featured", true)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(6)

    if (error) throw error
    return data || []
  } catch (error) {
    console.log("Using static services data")
    return STATIC_SERVICES.filter((service) => service.is_featured).slice(0, 6)
  }
}

export async function getAllServices(): Promise<Service[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("services")
      .select(`
        *,
        category:categories(id, name, slug)
      `)
      .eq("is_active", true)
      .order("name")

    if (error) throw error
    return data || []
  } catch (error) {
    console.log("Using static services data")
    return STATIC_SERVICES.filter((service) => service.is_active)
  }
}

export async function getServicesByCategory(categorySlug: string): Promise<Service[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("services")
      .select(`
        *,
        category:categories!inner(id, name, slug)
      `)
      .eq("category.slug", categorySlug)
      .eq("is_active", true)
      .order("name")

    if (error) throw error
    return data || []
  } catch (error) {
    console.log("Using static services data")
    return STATIC_SERVICES.filter((service) => service.is_active && service.category?.slug === categorySlug)
  }
}

export async function getServiceById(id: string): Promise<Service | null> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("services")
      .select(`
        *,
        category:categories(id, name, slug)
      `)
      .eq("id", id)
      .eq("is_active", true)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.log("Using static services data")
    return STATIC_SERVICES.find((service) => service.id === id && service.is_active) || null
  }
}
