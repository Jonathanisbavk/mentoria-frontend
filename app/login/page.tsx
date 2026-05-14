'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Star, Users, BookOpen } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';

type Role = 'aprendiz' | 'mentor' | 'admin';

const roles: { value: Role; label: string; description: string }[] = [
  { value: 'aprendiz', label: 'Aprendiz', description: 'Busco un mentor' },
  { value: 'mentor', label: 'Mentor', description: 'Quiero guiar' },
  { value: 'admin', label: 'Admin', description: 'Gestionar plataforma' },
];

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<Role>('aprendiz');
  const { login, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.replace('/dashboard');
  }, [user, router]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left panel */}
      <div
        style={{
          flex: 1,
          backgroundColor: 'var(--brand-dark)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 56px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: -80,
            right: -80,
            width: 320,
            height: 320,
            borderRadius: '50%',
            border: '1px solid rgba(217,75,31,0.3)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -120,
            left: -60,
            width: 400,
            height: 400,
            borderRadius: '50%',
            border: '1px solid rgba(217,75,31,0.2)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '40%',
            right: -40,
            width: 200,
            height: 200,
            borderRadius: '50%',
            backgroundColor: 'rgba(217,75,31,0.06)',
          }}
        />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48, position: 'relative', zIndex: 1 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              backgroundColor: 'var(--brand-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <GraduationCap size={26} color="white" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-sora, Sora, sans-serif)', fontWeight: 800, fontSize: 22, color: 'white' }}>
              CertusMenutoría
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>Certus Instituto</div>
          </div>
        </div>

        {/* Headline */}
        <div style={{ position: 'relative', zIndex: 1, marginBottom: 40 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 36,
              fontWeight: 800,
              color: 'white',
              fontFamily: 'var(--font-sora, Sora, sans-serif)',
              lineHeight: 1.2,
              marginBottom: 16,
            }}
          >
            Aprende más rápido con la guía correcta.
          </h1>
          <p style={{ margin: 0, fontSize: 16, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, maxWidth: 440 }}>
            Conéctate con estudiantes avanzados de Certus que ya pasaron por donde estás. Sesiones personalizadas, a tu ritmo.
          </p>
        </div>

        {/* Testimonial */}
        <div
          style={{
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 16,
            padding: '20px 24px',
            marginBottom: 32,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <p style={{ margin: '0 0 12px', fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, fontStyle: 'italic' }}>
            &ldquo;Gracias a mi mentora del 8vo ciclo entendí Figma en dos semanas. Ahora trabajo en un proyecto real con un equipo de diseño.&rdquo;
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: 'var(--brand-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                color: 'white',
                fontWeight: 700,
              }}
            >
              RV
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>Rodrigo Villanueva</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>Estudiante de 4to ciclo · Diseño UX</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 2 }}>
              {[1,2,3,4,5].map((s) => (
                <Star key={s} size={12} fill="#F59E0B" stroke="#F59E0B" />
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 32, position: 'relative', zIndex: 1 }}>
          {[
            { icon: Users, value: '120+', label: 'Mentores' },
            { icon: BookOpen, value: '840+', label: 'Sesiones' },
            { icon: Star, value: '4.8', label: 'Valoración' },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 2 }}>
                <Icon size={14} style={{ color: 'var(--brand-primary-light)' }} />
                <span style={{ fontSize: 20, fontWeight: 800, color: 'white', fontFamily: 'var(--font-sora, Sora, sans-serif)' }}>
                  {value}
                </span>
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div
        style={{
          flex: 1,
          backgroundColor: 'var(--brand-surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 56px',
        }}
      >
        <div style={{ width: '100%', maxWidth: 400 }}>
          <h2
            style={{
              margin: '0 0 8px',
              fontSize: 28,
              fontWeight: 800,
              color: 'var(--brand-dark)',
              fontFamily: 'var(--font-sora, Sora, sans-serif)',
            }}
          >
            Bienvenido de vuelta
          </h2>
          <p style={{ margin: '0 0 32px', fontSize: 14, color: 'var(--brand-slate)' }}>
            Selecciona tu rol para acceder a la plataforma
          </p>

          {/* Role selector */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 600, color: 'var(--brand-dark)' }}>
              Acceder como
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: 8,
                padding: 4,
                backgroundColor: 'var(--brand-border)',
                borderRadius: 12,
              }}
            >
              {roles.map(({ value, label, description }) => (
                <button
                  key={value}
                  onClick={() => setSelectedRole(value)}
                  style={{
                    padding: '10px 8px',
                    borderRadius: 9,
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    backgroundColor: selectedRole === value ? 'white' : 'transparent',
                    boxShadow: selectedRole === value ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                    textAlign: 'center',
                  }}
                  aria-pressed={selectedRole === value}
                >
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: selectedRole === value ? 'var(--brand-primary)' : 'var(--brand-slate)',
                      marginBottom: 2,
                    }}
                  >
                    {label}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--brand-slate-light)' }}>{description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Google button */}
          <button
            onClick={() => login(selectedRole)}
            disabled={isLoading}
            style={{
              width: '100%',
              height: 52,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              backgroundColor: 'white',
              border: '1px solid var(--brand-border)',
              borderRadius: 10,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: 15,
              fontWeight: 600,
              color: 'var(--brand-dark)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              transition: 'box-shadow 0.15s, transform 0.1s',
              opacity: isLoading ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            }}
            aria-label="Continuar con Google"
          >
            {isLoading ? (
              <div
                style={{
                  width: 20,
                  height: 20,
                  border: '2px solid var(--brand-border)',
                  borderTopColor: 'var(--brand-primary)',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {!isLoading && 'Continuar con Google'}
          </button>

          <p
            style={{
              marginTop: 20,
              fontSize: 11,
              color: 'var(--brand-slate-light)',
              textAlign: 'center',
              lineHeight: 1.5,
            }}
          >
            Al continuar, aceptas los Términos de Uso y la Política de Privacidad de CertusMenutoría. Esta es una sesión simulada con datos de prueba.
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
