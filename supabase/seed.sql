-- ============================================================
-- MENTORIA APP — Datos de ejemplo (seed)
-- Ejecutar DESPUÉS de schema.sql en el SQL Editor de Supabase
-- Contraseña de todas las cuentas de prueba: Mentoria@2024
-- ============================================================

-- Extensión para hashear contraseñas
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- 1. USUARIOS EN auth.users
-- El trigger on_auth_user_created crea los profiles automáticamente
-- ============================================================
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_user_meta_data, raw_app_meta_data,
  created_at, updated_at, confirmation_token, recovery_token,
  is_sso_user
) VALUES
  -- ADMIN
  (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'admin@certusmentoria.pe',
    crypt('Mentoria@2024', gen_salt('bf')),
    NOW(),
    '{"full_name": "Admin Sistema", "avatar_url": "https://api.dicebear.com/7.x/initials/svg?seed=Admin"}',
    '{"provider": "email", "providers": ["email"]}',
    NOW(), NOW(), '', '', false
  ),
  -- MENTOR 1
  (
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'carlos.mendoza@certusmentoria.pe',
    crypt('Mentoria@2024', gen_salt('bf')),
    NOW(),
    '{"full_name": "Carlos Mendoza", "avatar_url": "https://api.dicebear.com/7.x/initials/svg?seed=Carlos"}',
    '{"provider": "email", "providers": ["email"]}',
    NOW(), NOW(), '', '', false
  ),
  -- MENTOR 2
  (
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'ana.garcia@certusmentoria.pe',
    crypt('Mentoria@2024', gen_salt('bf')),
    NOW(),
    '{"full_name": "Ana García", "avatar_url": "https://api.dicebear.com/7.x/initials/svg?seed=Ana"}',
    '{"provider": "email", "providers": ["email"]}',
    NOW(), NOW(), '', '', false
  ),
  -- APRENDIZ 1
  (
    '00000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'luis.torres@certusmentoria.pe',
    crypt('Mentoria@2024', gen_salt('bf')),
    NOW(),
    '{"full_name": "Luis Torres", "avatar_url": "https://api.dicebear.com/7.x/initials/svg?seed=Luis"}',
    '{"provider": "email", "providers": ["email"]}',
    NOW(), NOW(), '', '', false
  ),
  -- APRENDIZ 2
  (
    '00000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'sofia.ramirez@certusmentoria.pe',
    crypt('Mentoria@2024', gen_salt('bf')),
    NOW(),
    '{"full_name": "Sofía Ramírez", "avatar_url": "https://api.dicebear.com/7.x/initials/svg?seed=Sofia"}',
    '{"provider": "email", "providers": ["email"]}',
    NOW(), NOW(), '', '', false
  );

-- ============================================================
-- 2. ACTUALIZAR PROFILES
-- El trigger ya insertó los registros; aquí actualizamos rol y bio
-- ============================================================
UPDATE public.profiles SET
  role      = 'admin',
  bio       = 'Administrador de la plataforma MentorIA de Certus.',
  timezone  = 'America/Lima'
WHERE id = '00000000-0000-0000-0000-000000000001';

UPDATE public.profiles SET
  role      = 'mentor',
  bio       = 'Estudiante de ciclo VIII en Desarrollo de Software. Especialista en Python, Machine Learning y bases de datos. Dos años de experiencia en proyectos reales.',
  timezone  = 'America/Lima'
WHERE id = '00000000-0000-0000-0000-000000000002';

UPDATE public.profiles SET
  role      = 'mentor',
  bio       = 'Estudiante de ciclo VII en Diseño y Desarrollo Web. Domina el stack MERN y metodologías ágiles. Apasionada por el frontend y la UX.',
  timezone  = 'America/Lima'
WHERE id = '00000000-0000-0000-0000-000000000003';

UPDATE public.profiles SET
  role      = 'apprentice',
  bio       = 'Estudiante de ciclo II en Desarrollo de Software. Buscando apoyo en algoritmos y fundamentos de programación.',
  timezone  = 'America/Lima'
WHERE id = '00000000-0000-0000-0000-000000000004';

UPDATE public.profiles SET
  role      = 'apprentice',
  bio       = 'Estudiante de ciclo III en Diseño Gráfico Digital. Quiero aprender desarrollo web para complementar mis habilidades de diseño.',
  timezone  = 'America/Lima'
WHERE id = '00000000-0000-0000-0000-000000000005';

-- ============================================================
-- 3. MENTOR PROFILES
-- ============================================================
INSERT INTO public.mentor_profiles (
  id, specialties, experience_years, linkedin_url, availability, is_active, avg_rating, session_count
) VALUES
  (
    '00000000-0000-0000-0000-000000000002',
    ARRAY['Python', 'Machine Learning', 'Data Science', 'SQL', 'Algoritmos'],
    2,
    'https://linkedin.com/in/carlos-mendoza-demo',
    '{
      "monday":    {"start": "18:00", "end": "21:00"},
      "wednesday": {"start": "18:00", "end": "21:00"},
      "saturday":  {"start": "09:00", "end": "13:00"}
    }'::jsonb,
    true, 4.80, 0
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    ARRAY['JavaScript', 'React', 'Node.js', 'TypeScript', 'CSS', 'Figma'],
    2,
    'https://linkedin.com/in/ana-garcia-demo',
    '{
      "tuesday":  {"start": "19:00", "end": "22:00"},
      "thursday": {"start": "19:00", "end": "22:00"},
      "sunday":   {"start": "10:00", "end": "13:00"}
    }'::jsonb,
    true, 4.60, 0
  );

-- ============================================================
-- 4. SESIONES DE EJEMPLO
-- ============================================================
INSERT INTO public.sessions (
  id, mentor_id, apprentice_id, title, description,
  scheduled_at, duration_minutes, status, meet_url, notes
) VALUES
  -- Sesión completada: Carlos → Luis
  (
    'aaaaaaaa-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000004',
    'Introducción a Python y estructuras de datos',
    'Repaso de listas, tuplas, diccionarios y funciones básicas en Python.',
    NOW() - INTERVAL '7 days',
    60, 'completed',
    'https://meet.google.com/abc-defg-hij',
    'Se cubrieron listas y bucles. El aprendiz mostró buen avance.'
  ),
  -- Sesión confirmada próxima: Carlos → Luis
  (
    'aaaaaaaa-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000004',
    'POO en Python: Clases y herencia',
    'Conceptos de Programación Orientada a Objetos aplicados a casos reales.',
    NOW() + INTERVAL '3 days',
    90, 'confirmed',
    'https://meet.google.com/xyz-uvwx-yz1',
    NULL
  ),
  -- Sesión pendiente: Ana → Sofía
  (
    'aaaaaaaa-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000005',
    'HTML & CSS: Box model y Flexbox',
    'Fundamentos de maquetado web responsivo con Flexbox y Grid.',
    NOW() + INTERVAL '5 days',
    60, 'pending',
    NULL,
    NULL
  ),
  -- Sesión completada: Ana → Sofía
  (
    'aaaaaaaa-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000005',
    'JavaScript básico: DOM y eventos',
    'Manipulación del DOM, addEventListener y manejo de formularios.',
    NOW() - INTERVAL '14 days',
    60, 'completed',
    'https://meet.google.com/dom-events-001',
    'Sofía comprendió bien los selectores y eventos de click.'
  ),
  -- Sesión cancelada: Carlos → Sofía
  (
    'aaaaaaaa-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000005',
    'Introducción a bases de datos relacionales',
    'Conceptos de SQL: SELECT, JOIN, GROUP BY.',
    NOW() - INTERVAL '3 days',
    60, 'cancelled',
    NULL,
    'Cancelada por el aprendiz — conflicto de horario.'
  );

-- ============================================================
-- 5. FEEDBACK
-- Solo para sesiones completadas (status = 'completed')
-- ============================================================
INSERT INTO public.feedback (
  id, session_id, reviewer_id, reviewee_id, rating, comment
) VALUES
  -- Luis califica a Carlos (sesión 1)
  (
    'bbbbbbbb-0000-0000-0000-000000000001',
    'aaaaaaaa-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000002',
    5,
    'Carlos explicó todo muy claro, con ejemplos prácticos. ¡Súper recomendado!'
  ),
  -- Sofía califica a Ana (sesión 4)
  (
    'bbbbbbbb-0000-0000-0000-000000000002',
    'aaaaaaaa-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000003',
    4,
    'Muy buena sesión. Ana es paciente y explica bien. El tema de eventos quedó claro.'
  );
