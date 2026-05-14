'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Star, Users, BookOpen, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

type Role = 'aprendiz' | 'mentor';
type AuthMode = 'login' | 'register' | 'demo';

const roles: { value: Role; label: string; description: string }[] = [
  { value: 'aprendiz', label: 'Aprendiz', description: 'Busco un mentor' },
  { value: 'mentor', label: 'Mentor', description: 'Quiero guiar' },
];

export default function LoginPage() {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [selectedRole, setSelectedRole] = useState<Role>('aprendiz');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [cycle, setCycle] = useState('1er');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { login, loginByRole, register, isLoading, user, error, clearError } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.replace('/dashboard');
  }, [user, router]);

  useEffect(() => {
    clearError();
  }, [authMode, clearError]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      console.error('Error de login:', err);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    try {
      await register({ name, email, password, role: selectedRole, cycle });
    } catch (err) {
      console.error('Error de registro:', err);
    }
  };

  const handleDemoLogin = async (demoRole: Role | 'admin') => {
    try {
      await loginByRole(demoRole as 'aprendiz' | 'mentor' | 'admin');
    } catch (err) {
      console.error('Error de demo login:', err);
    }
  };

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
              {[1, 2, 3, 4, 5].map((s) => (
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
          overflowY: 'auto',
        }}
      >
        <div style={{ width: '100%', maxWidth: 400 }}>
          {/* Auth mode tabs */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 32, backgroundColor: 'var(--brand-border)', padding: 4, borderRadius: 10 }}>
            {(['login', 'register', 'demo'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setAuthMode(mode)}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  border: 'none',
                  borderRadius: 8,
                  backgroundColor: authMode === mode ? 'white' : 'transparent',
                  color: authMode === mode ? 'var(--brand-primary)' : 'var(--brand-slate)',
                  fontWeight: authMode === mode ? 600 : 500,
                  fontSize: 13,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {mode === 'login' && 'Iniciar Sesión'}
                {mode === 'register' && 'Registrarse'}
                {mode === 'demo' && 'Demo'}
              </button>
            ))}
          </div>

          {/* Error message */}
          {error && (
            <div
              style={{
                padding: '12px 16px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 8,
                marginBottom: 16,
                fontSize: 13,
                color: '#dc2626',
              }}
            >
              {error}
            </div>
          )}

          {/* Login form */}
          {authMode === 'login' && (
            <div>
              <h2
                style={{
                  margin: '0 0 8px',
                  fontSize: 28,
                  fontWeight: 800,
                  color: 'var(--brand-dark)',
                  fontFamily: 'var(--font-sora, Sora, sans-serif)',
                }}
              >
                Bienvenido
              </h2>
              <p style={{ margin: '0 0 24px', fontSize: 14, color: 'var(--brand-slate)' }}>
                Ingresa tu email y contraseña
              </p>

              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--brand-dark)' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid var(--brand-border)',
                      borderRadius: 8,
                      fontSize: 14,
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--brand-dark)' }}>
                    Contraseña
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        paddingRight: 40,
                        border: '1px solid var(--brand-border)',
                        borderRadius: 8,
                        fontSize: 14,
                        boxSizing: 'border-box',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--brand-slate)',
                      }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: isLoading ? 'var(--brand-slate-light)' : 'var(--brand-primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.7 : 1,
                  }}
                >
                  {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </button>
              </form>
            </div>
          )}

          {/* Register form */}
          {authMode === 'register' && (
            <div>
              <h2
                style={{
                  margin: '0 0 8px',
                  fontSize: 28,
                  fontWeight: 800,
                  color: 'var(--brand-dark)',
                  fontFamily: 'var(--font-sora, Sora, sans-serif)',
                }}
              >
                Crear Cuenta
              </h2>
              <p style={{ margin: '0 0 24px', fontSize: 14, color: 'var(--brand-slate)' }}>
                Únete a nuestra comunidad de mentores
              </p>

              <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--brand-dark)' }}>
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid var(--brand-border)',
                      borderRadius: 8,
                      fontSize: 14,
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--brand-dark)' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid var(--brand-border)',
                      borderRadius: 8,
                      fontSize: 14,
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--brand-dark)' }}>
                      Rol
                    </label>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value as Role)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid var(--brand-border)',
                        borderRadius: 8,
                        fontSize: 14,
                        boxSizing: 'border-box',
                      }}
                    >
                      {roles.map(({ value, label }) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--brand-dark)' }}>
                      Ciclo
                    </label>
                    <select
                      value={cycle}
                      onChange={(e) => setCycle(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid var(--brand-border)',
                        borderRadius: 8,
                        fontSize: 14,
                        boxSizing: 'border-box',
                      }}
                    >
                      {['1er', '2do', '3er', '4to', '5to', '6to', '7mo', '8vo', '9no'].map((c) => (
                        <option key={c} value={c}>
                          {c} ciclo
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--brand-dark)' }}>
                    Contraseña
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        paddingRight: 40,
                        border: '1px solid var(--brand-border)',
                        borderRadius: 8,
                        fontSize: 14,
                        boxSizing: 'border-box',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--brand-slate)',
                      }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--brand-dark)' }}>
                    Confirmar Contraseña
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        paddingRight: 40,
                        border: '1px solid var(--brand-border)',
                        borderRadius: 8,
                        fontSize: 14,
                        boxSizing: 'border-box',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        position: 'absolute',
                        right: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--brand-slate)',
                      }}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: isLoading ? 'var(--brand-slate-light)' : 'var(--brand-primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.7 : 1,
                  }}
                >
                  {isLoading ? 'Creando cuenta...' : 'Registrarse'}
                </button>
              </form>
            </div>
          )}

          {/* Demo mode */}
          {authMode === 'demo' && (
            <div>
              <h2
                style={{
                  margin: '0 0 8px',
                  fontSize: 28,
                  fontWeight: 800,
                  color: 'var(--brand-dark)',
                  fontFamily: 'var(--font-sora, Sora, sans-serif)',
                }}
              >
                Modo Demo
              </h2>
              <p style={{ margin: '0 0 24px', fontSize: 14, color: 'var(--brand-slate)' }}>
                Prueba la plataforma con datos simulados
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { role: 'aprendiz', label: 'Aprendiz', desc: 'Busco un mentor' },
                  { role: 'mentor', label: 'Mentor', desc: 'Quiero guiar' },
                  { role: 'admin', label: 'Admin', desc: 'Gestionar plataforma' },
                ].map(({ role, label, desc }) => (
                  <button
                    key={role}
                    onClick={() => handleDemoLogin(role as Role | 'admin')}
                    disabled={isLoading}
                    style={{
                      padding: '16px',
                      backgroundColor: 'white',
                      border: '1px solid var(--brand-border)',
                      borderRadius: 8,
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      opacity: isLoading ? 0.6 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading) {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--brand-primary)';
                        (e.currentTarget as HTMLElement).style.color = 'white';
                        (e.currentTarget as HTMLElement).style.borderColor = 'var(--brand-primary)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = 'white';
                      (e.currentTarget as HTMLElement).style.color = 'var(--brand-dark)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--brand-border)';
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{label}</div>
                    <div style={{ fontSize: 12, opacity: 0.6 }}>{desc}</div>
                  </button>
                ))}
              </div>

              <p
                style={{
                  marginTop: 20,
                  fontSize: 11,
                  color: 'var(--brand-slate-light)',
                  textAlign: 'center',
                  lineHeight: 1.5,
                }}
              >
                El modo demo usa datos simulados. Los cambios no se guardan después de recargar.
              </p>
            </div>
          )}

          <p
            style={{
              marginTop: 24,
              fontSize: 11,
              color: 'var(--brand-slate-light)',
              textAlign: 'center',
              lineHeight: 1.5,
            }}
          >
            Al continuar, aceptas los Términos de Uso y la Política de Privacidad de CertusMenutoría.
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
