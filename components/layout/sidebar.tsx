'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  UserCircle,
  Settings,
  Shield,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useSupabase } from '@/components/providers/supabase-provider'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Inicio', roles: ['admin', 'mentor', 'apprentice'] },
  { href: '/mentors', icon: Users, label: 'Mentores', roles: ['admin', 'mentor', 'apprentice'] },
  { href: '/sessions', icon: CalendarDays, label: 'Sesiones', roles: ['admin', 'mentor', 'apprentice'] },
  { href: '/profile', icon: UserCircle, label: 'Mi Perfil', roles: ['admin', 'mentor', 'apprentice'] },
  { href: '/settings', icon: Settings, label: 'Configuración', roles: ['admin', 'mentor', 'apprentice'] },
  { href: '/admin', icon: Shield, label: 'Administración', roles: ['admin'] },
]

export function Sidebar() {
  const pathname = usePathname()
  const { profile } = useSupabase()

  const filtered = navItems.filter(item => profile && item.roles.includes(profile.role))

  return (
    <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white lg:flex lg:flex-col">
      <div className="flex h-16 items-center px-6 border-b border-gray-200">
        <Image src="/certus-logo.png" alt="Certus" width={120} height={36} className="object-contain" />
      </div>
      <nav className="flex-1 overflow-y-auto px-4 py-4">
        <ul className="space-y-1">
          {filtered.map(({ href, icon: Icon, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  pathname === href || pathname.startsWith(href + '/')
                    ? 'bg-certus-50 text-certus-700'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <Icon size={18} />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
