-- ============================================================
-- FIX: Corregir login de usuarios seed
-- Ejecutar UNA VEZ en el SQL Editor de Supabase
--
-- Causa del error "Database error querying schema":
--   1. GoTrue requiere registros en auth.identities por usuario.
--   2. Versiones nuevas de Supabase añadieron columnas string
--      (email_change, phone, phone_change, reauthentication_token,
--      email_change_token_new, etc.) que NO admiten NULL en runtime
--      aunque la columna sí lo permita. El seed antiguo las dejó NULL.
-- ============================================================

-- 1. Normalizar campos string que NO deben ser NULL en GoTrue
UPDATE auth.users
SET
  confirmation_token         = COALESCE(confirmation_token,         ''),
  recovery_token             = COALESCE(recovery_token,             ''),
  email_change_token_new     = COALESCE(email_change_token_new,     ''),
  email_change_token_current = COALESCE(email_change_token_current, ''),
  email_change               = COALESCE(email_change,               ''),
  phone_change               = COALESCE(phone_change,               ''),
  phone_change_token         = COALESCE(phone_change_token,         ''),
  reauthentication_token     = COALESCE(reauthentication_token,     ''),
  email_change_confirm_status = COALESCE(email_change_confirm_status, 0),
  is_sso_user                = COALESCE(is_sso_user,                false),
  is_anonymous               = COALESCE(is_anonymous,               false)
WHERE id IN (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000005'
);

-- 2. Asegurar que email_confirmed_at esté seteado (sin esto el login falla)
--    Nota: confirmed_at es columna generada en Supabase moderno — NO se actualiza
UPDATE auth.users
SET email_confirmed_at = COALESCE(email_confirmed_at, NOW())
WHERE email LIKE '%@certusmentoria.pe';

-- 3. Crear identidades faltantes (GoTrue las requiere para login con email)
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
WHERE u.email LIKE '%@certusmentoria.pe'
  AND NOT EXISTS (
    SELECT 1
    FROM   auth.identities i
    WHERE  i.user_id = u.id
      AND  i.provider = 'email'
  )
ON CONFLICT DO NOTHING;

-- 4. Asegurarse de que los perfiles existan (por si el trigger falló)
INSERT INTO public.profiles (id, full_name, avatar_url, role, timezone)
SELECT
  u.id,
  coalesce(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)),
  u.raw_user_meta_data->>'avatar_url',
  'apprentice',
  'America/Lima'
FROM auth.users u
WHERE u.email LIKE '%@certusmentoria.pe'
  AND NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = u.id)
ON CONFLICT DO NOTHING;

-- 5. Ajustar roles
UPDATE public.profiles SET role = 'admin'      WHERE id = '00000000-0000-0000-0000-000000000001';
UPDATE public.profiles SET role = 'mentor'     WHERE id = '00000000-0000-0000-0000-000000000002';
UPDATE public.profiles SET role = 'mentor'     WHERE id = '00000000-0000-0000-0000-000000000003';
UPDATE public.profiles SET role = 'apprentice' WHERE id = '00000000-0000-0000-0000-000000000004';
UPDATE public.profiles SET role = 'apprentice' WHERE id = '00000000-0000-0000-0000-000000000005';

-- 6. VERIFICACIÓN FINAL: deberías ver 5 filas con role + identidad + sin NULLs problemáticos
SELECT
  u.email,
  p.role,
  i.provider                                                  AS identity_provider,
  (u.confirmation_token       IS NULL) AS null_confirm,
  (u.recovery_token           IS NULL) AS null_recovery,
  (u.email_change             IS NULL) AS null_email_change,
  (u.phone_change             IS NULL) AS null_phone_change,
  (u.reauthentication_token   IS NULL) AS null_reauth,
  (u.email_confirmed_at       IS NULL) AS null_confirmed_at
FROM   auth.users u
LEFT JOIN auth.identities i ON i.user_id = u.id AND i.provider = 'email'
LEFT JOIN public.profiles p ON p.id = u.id
WHERE  u.email LIKE '%@certusmentoria.pe'
ORDER BY u.email;
