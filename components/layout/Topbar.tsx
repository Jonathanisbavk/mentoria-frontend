'use client';

import { Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/components/ui/Avatar';

interface TopbarProps {
  title: string;
  subtitle?: string;
}

export function Topbar({ title, subtitle }: TopbarProps) {
  const { user } = useAuth();

  return (
    <header
      style={{
        height: 68,
        backgroundColor: 'white',
        borderBottom: '1px solid var(--brand-border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 36px',
        gap: 16,
        position: 'sticky',
        top: 0,
        zIndex: 30,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1
          style={{
            margin: 0,
            fontSize: 22,
            fontWeight: 800,
            color: 'var(--brand-dark)',
            fontFamily: 'var(--font-sora, Sora, sans-serif)',
            lineHeight: 1.2,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p style={{ margin: 0, fontSize: 13, color: 'var(--brand-slate-light)', lineHeight: 1.4 }}>
            {subtitle}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          aria-label="Notificaciones"
          style={{
            position: 'relative',
            background: 'none',
            border: '1px solid var(--brand-border)',
            borderRadius: 10,
            width: 38,
            height: 38,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--brand-slate)',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--brand-surface)')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')}
        >
          <Bell size={18} />
          <span
            style={{
              position: 'absolute',
              top: 6,
              right: 6,
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: 'var(--brand-danger)',
              border: '1.5px solid white',
            }}
            aria-hidden="true"
          />
        </button>

        {user && (
          <Avatar
            initials={user.avatar}
            size={38}
            title={user.name}
            style={{ cursor: 'pointer', flexShrink: 0 }}
          />
        )}
      </div>
    </header>
  );
}
