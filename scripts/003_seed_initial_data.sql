-- Insertar categorías iniciales
INSERT INTO public.categories (name, description, slug) VALUES
('Microcontroladores', 'Arduino, Raspberry Pi y otros microcontroladores', 'microcontroladores'),
('Sensores', 'Sensores de temperatura, humedad, movimiento y más', 'sensores'),
('Componentes', 'Resistencias, capacitores, LEDs y componentes básicos', 'componentes'),
('Kits Educativos', 'Kits completos para aprendizaje y proyectos', 'kits-educativos'),
('Herramientas', 'Multímetros, soldadores y herramientas de trabajo', 'herramientas'),
('Protoboards', 'Protoboards y accesorios para prototipos', 'protoboards')
ON CONFLICT (slug) DO NOTHING;

-- Insertar productos iniciales
INSERT INTO public.products (name, description, price, stock, category_id, image_url, slug, is_featured) 
SELECT 
  'Arduino Uno R3',
  'Microcontrolador Arduino Uno R3 original con cable USB incluido',
  45000,
  25,
  c.id,
  '/arduino-microcontroller-board.png',
  'arduino-uno-r3',
  true
FROM public.categories c WHERE c.slug = 'microcontroladores'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (name, description, price, stock, category_id, image_url, slug, is_featured)
SELECT 
  'Kit de Sensores IoT',
  'Kit completo con 37 sensores diferentes para proyectos IoT',
  89000,
  15,
  c.id,
  '/iot-sensors-kit-electronic-components.png',
  'kit-sensores-iot',
  true
FROM public.categories c WHERE c.slug = 'sensores'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (name, description, price, stock, category_id, image_url, slug, is_featured)
SELECT 
  'Raspberry Pi 4 Model B',
  'Computadora de placa única Raspberry Pi 4 con 4GB RAM',
  320000,
  12,
  c.id,
  '/raspberry-pi-4-single-board-computer.png',
  'raspberry-pi-4-4gb',
  true
FROM public.categories c WHERE c.slug = 'microcontroladores'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (name, description, price, stock, category_id, image_url, slug, is_featured)
SELECT 
  'Multímetro Digital',
  'Multímetro digital profesional con pantalla LCD y múltiples funciones',
  65000,
  20,
  c.id,
  '/digital-multimeter-electronic-tool.png',
  'multimetro-digital',
  false
FROM public.categories c WHERE c.slug = 'herramientas'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (name, description, price, stock, category_id, image_url, slug, is_featured)
SELECT 
  'Kit de Robótica Educativa',
  'Kit completo para construir robots con motores, sensores y controlador',
  150000,
  8,
  c.id,
  '/educational-robotics-kit-motors-sensors.png',
  'kit-robotica-educativa',
  true
FROM public.categories c WHERE c.slug = 'kits-educativos'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (name, description, price, stock, category_id, image_url, slug, is_featured)
SELECT 
  'Protoboard 830 Puntos',
  'Protoboard de 830 puntos de conexión para prototipos electrónicos',
  12000,
  50,
  c.id,
  '/electronic-breadboard-prototype-board.png',
  'protoboard-830-puntos',
  false
FROM public.categories c WHERE c.slug = 'protoboards'
ON CONFLICT (slug) DO NOTHING;
