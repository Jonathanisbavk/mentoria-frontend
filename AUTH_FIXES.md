# Guía de Configuración - Google OAuth & Autenticación

## Errores Corregidos ✅

### 1. **No había endpoint de registro**
**Problema:** No existía forma de que nuevos usuarios se registren
**Solución:** Creado `/api/users/register` con validación de:
- Email único
- Contraseña mínimo 6 caracteres
- Validación con Zod
- Prevención de duplicados

### 2. **Login sin validación de credenciales**
**Problema:** El login solo aceptaba roles predefinidos, sin verificar email/contraseña
**Solución:** Mejorado `/api/auth` para:
- Validar email y contraseña
- Buscar usuario por email
- Mantener fallback a login por rol para demo
- Validación con Zod

### 3. **AuthContext sin manejo de errores**
**Problema:** No capturaba ni mostraba errores de autenticación
**Solución:** Actualizado AuthContext con:
- Estado `error` para mensajes
- Método `clearError()` para limpiar errores
- Funciones separadas: `login()`, `loginByRole()`, `register()`, `loginWithGoogle()`
- Mejor manejo de excepciones

### 4. **Sin soporte para Google OAuth**
**Problema:** No había forma de autenticarse con Google
**Solución:** 
- Creado endpoint `/api/auth/google`
- Documentación para setup
- Integración lista (falta configurar Google Cloud)

### 5. **Página de login limitada**
**Problema:** Solo permitía login por rol, sin opciones de email/password
**Solución:** Nueva página con 3 modos:
- **Iniciar Sesión:** Con email y contraseña
- **Registrarse:** Crear nuevos usuarios
- **Demo:** Acceso rápido con roles predefinidos

## Configuración de Google OAuth 🔐

### Pasos necesarios:

#### 1. Crear proyecto en Google Cloud Console
```
1. Ir a https://console.cloud.google.com
2. Crear nuevo proyecto
3. Habilitar Google+ API
4. Crear OAuth 2.0 ID de cliente (Web Application)
```

#### 2. Instalar dependencias (cuando esté listo)
```bash
npm install next-auth@beta @auth/core @auth/nextjs-core @react-oauth/google
```

#### 3. Crear `.env.local`
```env
# Google OAuth
GOOGLE_CLIENT_ID=tu_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu_client_secret

# NextAuth (generar con: openssl rand -base64 32)
NEXTAUTH_SECRET=tu_secret_generado
```

#### 4. Crear archivo `/app/api/auth/[...nextauth]/route.ts`
```typescript
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  // ... configuración adicional
})

export { handler as GET, handler as POST }
```

#### 5. Actualizar página de login con botón real de Google
El componente actual es un placeholder. Necesitará:
```typescript
import { signIn } from "next-auth/react"

// En la página de login:
<button onClick={() => signIn("google")}>
  Continuar con Google
</button>
```

## Estructura de Base de Datos (Actual - Simulada)

**Usuarios con validación:**
- `id`: string único
- `name`: nombre completo
- `email`: único, validado
- `role`: 'aprendiz' | 'mentor' | 'admin'
- `cycle`: ciclo académico
- `avatar`: iniciables del nombre
- `status`: 'active' | 'suspended'
- `sessions`: número de sesiones

**Nota:** En producción, necesitarás:
- Base de datos real (PostgreSQL, MongoDB, etc.)
- Hasheado de contraseñas (bcrypt)
- JWT o sesiones server
- Rate limiting
- HTTPS requerido

## Archivos Modificados 📝

```
✅ app/api/auth/route.ts           - Mejorado login con email/password
✅ app/api/users/route.ts          - GET sin cambios
✅ app/api/users/register/route.ts - NUEVO: Registro de usuarios
✅ app/api/auth/google/route.ts    - NUEVO: Google OAuth handler
✅ context/AuthContext.tsx         - Mejorado con más funcionalidades
✅ app/login/page.tsx              - Rediseñado con 3 modos
```

## Testing Manual ✅

### Modo Demo (Funciona ahora)
1. Click en tab "Demo"
2. Selecciona rol (Aprendiz/Mentor/Admin)
3. Accede al dashboard

### Registro (Funciona ahora)
1. Click en tab "Registrarse"
2. Completa formulario
3. El email debe ser único
4. Contraseña debe ser 6+ caracteres

### Login (Funciona ahora)
1. Click en tab "Iniciar Sesión"
2. Email y contraseña
3. El email debe estar registrado

### Google OAuth (Requiere configuración)
1. Seguir pasos de "Configuración de Google OAuth"
2. Descomentar botón Google en página login
3. Testear después de setup

## Próximos Pasos Recomendados 🎯

1. [ ] Configurar base de datos real
2. [ ] Implementar hasheado de contraseñas (bcrypt)
3. [ ] Configurar Google OAuth en Google Cloud
4. [ ] Agregar validación de email (confirmación)
5. [ ] Implementar recuperación de contraseña
6. [ ] Agregar rate limiting
7. [ ] Setup HTTPS en producción
8. [ ] Implementar refresh tokens

## Error Handling 🛡️

Todos los endpoints ahora retornan:
```json
{
  "status": "ok" | "error",
  "data": {...},
  "error": "mensaje de error",
  "details": [...]  // en caso de validación
}
```

Los errores se muestran en la UI con mensajes claros en rojo.
