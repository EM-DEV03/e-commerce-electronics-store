-- Script para convertir un usuario existente en administrador
-- Reemplaza 'tu-email@ejemplo.com' con el email del usuario que quieres hacer admin

UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'admin@electrotech.com';

-- Si quieres hacer admin a otro usuario, cambia el email:
-- UPDATE public.profiles 
-- SET role = 'admin' 
-- WHERE email = 'tu-email@ejemplo.com';
