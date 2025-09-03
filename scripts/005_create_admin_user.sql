-- Crear usuario administrador de prueba
-- NOTA: Este script debe ejecutarse después de que el usuario se registre manualmente en Supabase Auth

-- Actualizar el perfil del usuario admin@electrotech.com para que sea administrador
UPDATE public.profiles 
SET role = 'admin'
WHERE email = 'admin@electrotech.com';

-- Si el perfil no existe, insertarlo (esto solo funcionará si el usuario ya se registró en Auth)
INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
SELECT 
  auth.uid(),
  'admin@electrotech.com',
  'Administrador ElectroTech',
  'admin',
  now(),
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles WHERE email = 'admin@electrotech.com'
);
