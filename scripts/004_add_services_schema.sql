-- Crear tabla de servicios
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  short_description VARCHAR(500),
  category_id UUID REFERENCES categories(id),
  price DECIMAL(10,2) NOT NULL,
  duration_hours INTEGER, -- Duración estimada en horas
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  image_url TEXT,
  requirements TEXT, -- Requisitos del cliente
  deliverables TEXT, -- Qué se entrega
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de categorías de servicios
INSERT INTO categories (name, slug, description, image_url) VALUES
('Programación', 'programacion', 'Desarrollo de software personalizado y aplicaciones', '/programming-services.png'),
('Servicio Técnico', 'servicio-tecnico', 'Reparación y mantenimiento de equipos electrónicos', '/technical-service.png'),
('Mantenimiento', 'mantenimiento', 'Mantenimiento preventivo y correctivo de computadoras', '/maintenance-service.png'),
('Reparación', 'reparacion', 'Reparación especializada de componentes electrónicos', '/repair-service.png');

-- Insertar servicios de ejemplo
INSERT INTO services (name, description, short_description, category_id, price, duration_hours, is_featured, image_url, requirements, deliverables) VALUES
(
  'Desarrollo de Aplicación Web Personalizada',
  'Creamos aplicaciones web modernas y responsivas utilizando las últimas tecnologías como React, Next.js, Node.js y bases de datos. Incluye diseño UI/UX, desarrollo frontend y backend, integración de APIs, sistema de autenticación y documentación completa.',
  'Desarrollo completo de aplicación web con tecnologías modernas',
  (SELECT id FROM categories WHERE slug = 'programacion'),
  2500000.00,
  120,
  true,
  '/web-development-service.png',
  'Especificaciones funcionales, diseño o wireframes (opcional), acceso a hosting y dominio',
  'Código fuente, aplicación desplegada, documentación técnica, manual de usuario, 3 meses de soporte'
),
(
  'Mantenimiento Preventivo de PC',
  'Servicio completo de mantenimiento preventivo que incluye limpieza interna y externa, actualización de drivers, optimización del sistema operativo, verificación de hardware, backup de datos importantes y reporte detallado del estado del equipo.',
  'Limpieza, optimización y verificación completa de tu computadora',
  (SELECT id FROM categories WHERE slug = 'mantenimiento'),
  150000.00,
  3,
  true,
  '/pc-maintenance-service.png',
  'Computadora de escritorio o portátil, contraseñas de acceso',
  'Equipo optimizado, reporte de estado, backup de datos, garantía de 30 días'
),
(
  'Reparación de Tarjetas Madre',
  'Diagnóstico y reparación especializada de tarjetas madre con problemas de arranque, componentes dañados, pistas cortadas o problemas de conectividad. Utilizamos equipos de soldadura profesional y componentes originales.',
  'Reparación especializada de motherboards con garantía',
  (SELECT id FROM categories WHERE slug = 'reparacion'),
  300000.00,
  8,
  false,
  '/motherboard-repair-service.png',
  'Tarjeta madre, descripción detallada del problema',
  'Tarjeta madre reparada, reporte de reparación, garantía de 60 días'
),
(
  'Desarrollo de Sistema de Inventario',
  'Sistema completo de gestión de inventario con control de stock, reportes, códigos de barras, múltiples usuarios, respaldos automáticos y interfaz web responsive. Incluye capacitación y documentación completa.',
  'Sistema personalizado para gestión de inventario y stock',
  (SELECT id FROM categories WHERE slug = 'programacion'),
  1800000.00,
  80,
  true,
  '/inventory-system-service.png',
  'Especificaciones del negocio, lista de productos, estructura organizacional',
  'Sistema completo, capacitación, documentación, 6 meses de soporte'
),
(
  'Servicio Técnico a Domicilio',
  'Diagnóstico y reparación de equipos en tu hogar u oficina. Incluye identificación de problemas, reparación o reemplazo de componentes, instalación de software, configuración de redes y asesoría técnica personalizada.',
  'Reparación y soporte técnico en tu ubicación',
  (SELECT id FROM categories WHERE slug = 'servicio-tecnico'),
  120000.00,
  4,
  false,
  '/home-service.png',
  'Dirección de servicio dentro del área metropolitana de Sincelejo',
  'Equipo reparado, reporte de servicio, garantía de 15 días'
),
(
  'Creación de Tienda Online',
  'Desarrollo completo de tienda virtual con carrito de compras, pasarela de pagos, gestión de productos, panel administrativo, diseño responsive y optimización SEO. Incluye integración con redes sociales y herramientas de marketing.',
  'E-commerce completo con pasarela de pagos integrada',
  (SELECT id FROM categories WHERE slug = 'programacion'),
  3200000.00,
  150,
  true,
  '/ecommerce-development-service.png',
  'Catálogo de productos, información de la empresa, preferencias de diseño',
  'Tienda online completa, panel admin, documentación, 4 meses de soporte'
);

-- Habilitar RLS para servicios
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Política para que todos puedan ver servicios activos
CREATE POLICY "Anyone can view active services" ON services
  FOR SELECT USING (is_active = true);

-- Política para que solo admins puedan modificar servicios
CREATE POLICY "Only admins can modify services" ON services
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );
