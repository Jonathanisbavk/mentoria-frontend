import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

// ─── Cliente admin de Supabase (solo server-side) ─────────────────────────────

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

/** Obtiene el email de un usuario por su UUID */
export async function getUserEmail(userId: string): Promise<string | null> {
  const { data, error } = await adminClient().auth.admin.getUserById(userId)
  if (error || !data.user) return null
  return data.user.email ?? null
}

// ─── Resend ───────────────────────────────────────────────────────────────────

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

const FROM = 'MentorIA Certus <onboarding@resend.dev>'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
const BRAND_BLUE = '#0B2272'

async function send(to: string, subject: string, html: string): Promise<void> {
  if (!resend) {
    // Dev sin API key — solo imprime en consola
    console.log(`[EMAIL dev] To: ${to} | Subject: ${subject}`)
    return
  }
  const { error } = await resend.emails.send({ from: FROM, to, subject, html })
  if (error) console.error('[EMAIL error]', error)
}

// ─── Helpers de formato ───────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return format(new Date(iso), "EEEE d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })
}

function baseTemplate(title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb;padding:32px 0">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
        <!-- Header -->
        <tr><td style="background:${BRAND_BLUE};padding:28px 32px;text-align:center">
          <p style="margin:0;color:#fff;font-size:22px;font-weight:700">MentorIA · Certus</p>
          <p style="margin:6px 0 0;color:rgba(255,255,255,.6);font-size:12px;letter-spacing:.05em;text-transform:uppercase">Plataforma de Mentoría</p>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:32px">
          <h2 style="margin:0 0 20px;color:#111827;font-size:20px">${title}</h2>
          ${body}
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#f9fafb;padding:20px 32px;text-align:center;border-top:1px solid #e5e7eb">
          <p style="margin:0;color:#9ca3af;font-size:12px">
            © ${new Date().getFullYear()} Certus Instituto · <a href="${APP_URL}" style="color:${BRAND_BLUE};text-decoration:none">mentoria.certus.edu.pe</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

// ─── Email 1: Nueva solicitud de sesión → al mentor ───────────────────────────

export async function sendSessionRequest(opts: {
  mentorEmail: string
  mentorName: string
  apprenticeName: string
  sessionTitle: string
  scheduledAt: string
  durationMinutes: number
  sessionId: string
}) {
  const subject = `Nueva solicitud de sesión: "${opts.sessionTitle}"`

  const body = `
    <p style="color:#374151;margin:0 0 16px">Hola <strong>${opts.mentorName}</strong>,</p>
    <p style="color:#374151;margin:0 0 20px">
      <strong>${opts.apprenticeName}</strong> ha solicitado una sesión de mentoría contigo.
    </p>

    <div style="background:#f0f4ff;border-left:4px solid ${BRAND_BLUE};border-radius:8px;padding:18px 20px;margin:0 0 24px">
      <p style="margin:0 0 8px;color:#111827;font-size:15px;font-weight:700">${opts.sessionTitle}</p>
      <p style="margin:0 0 4px;color:#6b7280;font-size:13px">📅 ${fmtDate(opts.scheduledAt)}</p>
      <p style="margin:0;color:#6b7280;font-size:13px">⏱ Duración: ${opts.durationMinutes} minutos</p>
    </div>

    <p style="color:#374151;margin:0 0 24px">
      Revisa los detalles y confirma (o rechaza) la sesión desde el dashboard.
    </p>

    <table cellpadding="0" cellspacing="0" style="margin:0 auto">
      <tr><td align="center" style="background:${BRAND_BLUE};border-radius:10px;padding:12px 28px">
        <a href="${APP_URL}/sessions/${opts.sessionId}" style="color:#fff;font-size:14px;font-weight:700;text-decoration:none">
          Ver solicitud →
        </a>
      </td></tr>
    </table>`

  await send(opts.mentorEmail, subject, baseTemplate(subject, body))
}

// ─── Email 2: Sesión confirmada → al aprendiz ─────────────────────────────────

export async function sendSessionConfirmed(opts: {
  apprenticeEmail: string
  apprenticeName: string
  mentorName: string
  sessionTitle: string
  scheduledAt: string
  durationMinutes: number
  meetUrl: string | null
  sessionId: string
}) {
  const subject = `✅ Sesión confirmada: "${opts.sessionTitle}"`

  const meetSection = opts.meetUrl
    ? `<div style="background:#f0fdf4;border:1px solid #86efac;border-radius:10px;padding:18px 20px;margin:20px 0;text-align:center">
        <p style="margin:0 0 10px;color:#166534;font-weight:700;font-size:14px">🎥 Enlace de Google Meet</p>
        <a href="${opts.meetUrl}" style="display:inline-block;background:#16a34a;color:#fff;font-weight:700;font-size:14px;padding:10px 24px;border-radius:8px;text-decoration:none">
          Unirse a la reunión
        </a>
        <p style="margin:10px 0 0;color:#4b7c59;font-size:12px">${opts.meetUrl}</p>
      </div>`
    : `<p style="color:#6b7280;margin:16px 0;font-size:13px;font-style:italic">
        El mentor te enviará el enlace de la reunión próximamente.
      </p>`

  const body = `
    <p style="color:#374151;margin:0 0 16px">Hola <strong>${opts.apprenticeName}</strong>,</p>
    <p style="color:#374151;margin:0 0 20px">
      ¡Buenas noticias! <strong>${opts.mentorName}</strong> ha confirmado tu sesión de mentoría.
    </p>

    <div style="background:#f0f4ff;border-left:4px solid ${BRAND_BLUE};border-radius:8px;padding:18px 20px;margin:0 0 4px">
      <p style="margin:0 0 8px;color:#111827;font-size:15px;font-weight:700">${opts.sessionTitle}</p>
      <p style="margin:0 0 4px;color:#6b7280;font-size:13px">📅 ${fmtDate(opts.scheduledAt)}</p>
      <p style="margin:0;color:#6b7280;font-size:13px">⏱ Duración: ${opts.durationMinutes} minutos</p>
    </div>

    ${meetSection}

    <table cellpadding="0" cellspacing="0" style="margin:24px auto 0">
      <tr><td align="center" style="background:${BRAND_BLUE};border-radius:10px;padding:12px 28px">
        <a href="${APP_URL}/sessions/${opts.sessionId}" style="color:#fff;font-size:14px;font-weight:700;text-decoration:none">
          Ver sesión →
        </a>
      </td></tr>
    </table>`

  await send(opts.apprenticeEmail, subject, baseTemplate(subject, body))
}

// ─── Email 3: Sesión cancelada ────────────────────────────────────────────────

export async function sendSessionCancelled(opts: {
  toEmail: string
  toName: string
  cancelledByName: string
  sessionTitle: string
  scheduledAt: string
}) {
  const subject = `❌ Sesión cancelada: "${opts.sessionTitle}"`

  const body = `
    <p style="color:#374151;margin:0 0 16px">Hola <strong>${opts.toName}</strong>,</p>
    <p style="color:#374151;margin:0 0 20px">
      Lamentamos informarte que <strong>${opts.cancelledByName}</strong> ha cancelado la siguiente sesión:
    </p>

    <div style="background:#fff5f5;border-left:4px solid #ef4444;border-radius:8px;padding:18px 20px;margin:0 0 24px">
      <p style="margin:0 0 8px;color:#111827;font-size:15px;font-weight:700">${opts.sessionTitle}</p>
      <p style="margin:0;color:#6b7280;font-size:13px">📅 ${fmtDate(opts.scheduledAt)}</p>
    </div>

    <p style="color:#374151;margin:0 0 24px">
      Puedes buscar otro mentor o reagendar desde el dashboard.
    </p>

    <table cellpadding="0" cellspacing="0" style="margin:0 auto">
      <tr><td align="center" style="background:${BRAND_BLUE};border-radius:10px;padding:12px 28px">
        <a href="${APP_URL}/sessions" style="color:#fff;font-size:14px;font-weight:700;text-decoration:none">
          Ir a mis sesiones →
        </a>
      </td></tr>
    </table>`

  await send(opts.toEmail, subject, baseTemplate(subject, body))
}
