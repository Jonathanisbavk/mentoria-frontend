import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://yeemxbrusfesosvwlmulb.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllZW14YnJ1c2Zlc292d2xtdWxiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODcxNTEwOCwiZXhwIjoyMDk0MjkxMTA4fQ.-MRx1No58JxRMl-cTsDMtq8lcGfg0h_ooVwNUPe7BgA'

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

const users = [
  { email: 'admin@certus.edu.pe',    password: 'Certus2025!', full_name: 'Admin Certus',  role: 'admin'      },
  { email: 'mentor@certus.edu.pe',   password: 'Certus2025!', full_name: 'Carlos Quispe', role: 'mentor'     },
  { email: 'aprendiz@certus.edu.pe', password: 'Certus2025!', full_name: 'Maria Flores',  role: 'apprentice' },
]

for (const u of users) {
  const { data, error } = await supabase.auth.admin.createUser({
    email: u.email,
    password: u.password,
    email_confirm: true,
    user_metadata: { full_name: u.full_name },
  })

  if (error) {
    console.error(`❌ ${u.role}: ${error.message}`)
    continue
  }

  // Update role in profiles table (trigger creates the row, we update the role)
  const { error: profileErr } = await supabase
    .from('profiles')
    .update({ role: u.role, full_name: u.full_name })
    .eq('id', data.user.id)

  if (profileErr) {
    console.error(`⚠️  ${u.role} creado pero role no actualizado: ${profileErr.message}`)
  } else {
    console.log(`✅ ${u.role.padEnd(10)} ${u.email}  pwd: ${u.password}`)
  }
}
