-- ============================================================
-- FIX: Corregir login de usuarios seed
-- Ejecutar UNA VEZ en el SQL Editor de Supabase
--
-- Causa del error "Database error querying schema":
--   GoTrue (motor auth de Supabase) requiere un registro en
--   auth.identities para cada usuario. El seed insertó
--   directamente en auth.users sin crear esos registros.
-- ============================================================

-- 1. Crear identidades faltantes para todos los usuarios seed
INSERT INTO auth.identities (
  provider_id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
SELECT
  u.email                                AS provider_id,
  u.id                                   AS user_id,
  jsonb_build_object(
    'sub',            u.id::text,
    'email',          u.email,
    'email_verified', true,
    'phone_verified', false
  )                                      AS identity_data,
  'email'                                AS provider,
  NOW()                                  AS last_sign_in_at,
  NOW()                                  AS created_at,
  NOW()                                  AS updated_at
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1
  FROM   auth.identities i
  WHERE  i.user_id = u.id
    AND  i.provider = 'email'
)
ON CONFLICT DO NOTHING;

-- 2. Asegurarse de que los perfiles existan (por si el trigger falló)
INSERT INTO public.profiles (id, full_name, avatar_url, role, timezone)
SELECT
  u.id,
  coalesce(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)),
  u.raw_user_meta_data->>'avatar_url',
  'apprentice',
  'America/Lima'
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = u.id)
ON CONFLICT DO NOTHING;

-- 3. Ajustar roles de los usuarios seed (por si no se aplicaron)
UPDATE public.profiles SET role = 'admin'     WHERE id = '00000000-0000-0000-0000-000000000001';
UPDATE public.profiles SET role = 'mentor'    WHERE id = '00000000-0000-0000-0000-000000000002';
UPDATE public.profiles SET role = 'mentor'    WHERE id = '00000000-0000-0000-0000-000000000003';
UPDATE public.profiles SET role = 'apprentice' WHERE id = '00000000-0000-0000-0000-000000000004';
UPDATE public.profiles SET role = 'apprentice' WHERE id = '00000000-0000-0000-0000-000000000005';

-- Verificar resultado
SELECT u.email, i.provider, p.role
FROM   auth.users u
LEFT JOIN auth.identities i ON i.user_id = u.id AND i.provider = 'email'
LEFT JOIN public.profiles  p ON p.id = u.id
ORDER BY u.email;
