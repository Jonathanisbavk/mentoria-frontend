'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, Search, Calendar, User, Shield, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/components/ui/avatar';

type NavRole = 'admin' | 'mentor' | 'apprentice'

const navItems: Array<{
  href: string
  label: string
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>
  onlyRoles?: NavRole[]
}> = [
  { href: '/dashboard', label: 'Inicio',          icon: Home     },
  { href: '/mentors',   label: 'Buscar Mentores', icon: Search,   onlyRoles: ['apprentice'] },
  { href: '/sessions',  label: 'Mis Sesiones',    icon: Calendar },
  { href: '/profile',   label: 'Mi Perfil',       icon: User     },
  { href: '/admin',     label: 'Administración',  icon: Shield,   onlyRoles: ['admin'] },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const roleLabel =
    user?.role === 'apprentice' ? 'Aprendiz'
    : user?.role === 'mentor' ? 'Mentor'
    : 'Administrador';

  return (
    <aside
      style={{
        width: 240,
        minHeight: '100vh',
        backgroundColor: '#091A5A',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 40,
      }}
    >
      {/* ── Logo ── */}
      <div
        style={{
          padding: '20px 16px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Link href="/dashboard" style={{ display: 'block', textDecoration: 'none' }}>
          <div
            style={{
              background: 'white',
              borderRadius: 10,
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image src="/certus-logo.svg" alt="Certus" width={116} height={36} priority />
          </div>
          <p
            style={{
              marginTop: 8,
              textAlign: 'center',
              fontSize: 11,
              fontWeight: 500,
              color: 'rgba(255,255,255,0.45)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            Desarrollo de Software
          </p>
        </Link>
      </div>

      {/* ── Nav ── */}
      <nav
        style={{
          flex: 1,
          padding: '16px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {navItems.map(({ href, label, icon: Icon, onlyRoles }) => {
          if (onlyRoles && user?.role && !onlyRoles.includes(user.role as NavRole)) return null;
          const isActive =
            pathname === href ||
            (href !== '/dashboard' && pathname.startsWith(href + '/'));

          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 12px',
                borderRadius: 10,
                textDecoration: 'none',
                transition: 'background 0.15s',
                backgroundColor: isActive ? '#0B2272' : 'transparent',
                color: isActive ? 'white' : 'rgba(255,255,255,0.6)',
                fontSize: 13.5,
                fontWeight: isActive ? 600 : 400,
              }}
              onMouseEnter={e => {
                if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.07)';
              }}
              onMouseLeave={e => {
                if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
              }}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={16} style={{ flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{label}</span>
              {isActive && <ChevronRight size={12} style={{ opacity: 0.6 }} />}
            </Link>
          );
        })}
      </nav>

      {/* ── Usuario ── */}
      {user && (
        <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 10,
              backgroundColor: 'rgba(255,255,255,0.06)',
            }}
          >
            <Avatar src={user.avatar} name={user.name} size={34} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  color: 'white',
                  fontSize: 13,
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user.name.split(' ').slice(0, 2).join(' ')}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>
                {roleLabel}
              </div>
            </div>
            <button
              onClick={logout}
              title="Cerrar sesión"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.4)',
                padding: 4,
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'white')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)')}
              aria-label="Cerrar sesión"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
