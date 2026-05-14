'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, Home, Search, Calendar, Star, Shield, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/components/ui/Avatar';

const navItems = [
  { href: '/dashboard', label: 'Inicio', icon: Home },
  { href: '/mentores', label: 'Buscar Mentores', icon: Search },
  { href: '/agenda', label: 'Mi Agenda', icon: Calendar },
  { href: '/valoraciones', label: 'Valoraciones', icon: Star },
  { href: '/admin', label: 'Administración', icon: Shield, adminOnly: true },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const roleLabel = user?.role === 'aprendiz' ? 'Aprendiz' : user?.role === 'mentor' ? 'Mentor' : 'Administrador';

  return (
    <aside
      style={{
        width: 240,
        minHeight: '100vh',
        backgroundColor: 'var(--brand-dark)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 40,
      }}
    >
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              backgroundColor: 'var(--brand-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <GraduationCap size={20} color="white" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-sora, Sora, sans-serif)', fontWeight: 700, fontSize: 15, color: 'white', lineHeight: 1.2 }}>
              Certus
            </div>
            <div style={{ fontFamily: 'var(--font-sora, Sora, sans-serif)', fontWeight: 600, fontSize: 13, color: 'var(--brand-primary-light)', lineHeight: 1.2 }}>
              Mentoría
            </div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {navItems.map(({ href, label, icon: Icon, adminOnly }) => {
          if (adminOnly && user?.role !== 'admin') return null;
          const isActive = pathname === href || pathname.startsWith(href + '/');

          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 10,
                textDecoration: 'none',
                transition: 'background 0.15s',
                backgroundColor: isActive ? 'var(--brand-primary)' : 'transparent',
                color: isActive ? 'white' : 'rgba(255,255,255,0.6)',
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
              }}
              onMouseEnter={(e) => {
                if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.05)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
              }}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={18} style={{ flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{label}</span>
              {isActive && <ChevronRight size={14} />}
            </Link>
          );
        })}
      </nav>

      {/* User card */}
      {user && (
        <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 10,
              backgroundColor: 'rgba(255,255,255,0.05)',
            }}
          >
            <Avatar initials={user.avatar} size={36} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: 'white', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.name.split(' ')[0]} {user.name.split(' ')[1]}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>
                {roleLabel} · {user.cycle}
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
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'white')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)')}
              aria-label="Cerrar sesión"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
