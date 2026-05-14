'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { Users, GraduationCap, BookOpen, Calendar, Star, AlertCircle, Search, Check, X, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import { Topbar } from '@/components/layout/Topbar';
import { StatCard } from '@/components/features/StatCard';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { useStats } from '@/hooks/useStats';
import { pendingApprovals } from '@/lib/mockData';
import type { User } from '@/lib/types';

const fetcher = (url: string) => fetch(url).then((r) => r.json()).then((j) => j.data);

const roleFilterOptions = [
  { value: 'all', label: 'Todos' },
  { value: 'mentor', label: 'Mentores' },
  { value: 'aprendiz', label: 'Aprendices' },
  { value: 'suspended', label: 'Suspendidos' },
];

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { stats } = useStats();
  const [roleFilter, setRoleFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [approvals, setApprovals] = useState(pendingApprovals);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast.error('Acceso no autorizado');
      router.replace('/dashboard');
    }
  }, [user, router]);

  const apiUrl = (() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (roleFilter !== 'all' && roleFilter !== 'suspended') params.set('role', roleFilter);
    return `/api/users?${params.toString()}`;
  })();

  const { data, mutate } = useSWR<{ users: User[]; total: number }>(user?.role === 'admin' ? apiUrl : null, fetcher);
  const usersList = data?.users ?? [];
  const total = data?.total ?? 0;

  const toggleUserStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      toast.success(`Usuario ${newStatus === 'active' ? 'activado' : 'suspendido'}`);
      mutate();
    } catch {
      toast.error('Error al actualizar el usuario');
    }
  };

  const handleApproval = (id: string, approved: boolean) => {
    setApprovals((prev) => prev.filter((a) => a.id !== id));
    toast.success(approved ? 'Solicitud aprobada' : 'Solicitud rechazada');
  };

  const maxWeekCount = Math.max(...(stats?.sessionsThisWeek?.map((d) => d.count) ?? [1]));

  if (user?.role !== 'admin') return null;

  return (
    <>
      <Topbar title="Panel de Administración" subtitle="Gestión de usuarios, sesiones y contenido de la plataforma" />
      <div style={{ padding: '32px 36px', flex: 1 }}>
        {/* KPI row */}
        <div style={{ display: 'flex', gap: 14, marginBottom: 28 }}>
          <StatCard icon={Users} label="Total Usuarios" value="1,247" iconColor="var(--brand-primary)" />
          <StatCard icon={GraduationCap} label="Mentores Activos" value="143" iconColor="var(--brand-info)" />
          <StatCard icon={BookOpen} label="Aprendices" value="1,104" iconColor="var(--brand-success)" />
          <StatCard icon={Calendar} label="Sesiones este mes" value="386" iconColor="var(--brand-warning)" />
          <StatCard icon={Star} label="Valoración Promedio" value={stats?.averageRating ?? 4.8} iconColor="var(--brand-primary)" />
        </div>

        {/* Main layout */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          {/* Users table */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <Card padding={0} style={{ overflow: 'hidden' }}>
              {/* Table header */}
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--brand-border)', display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <Input
                    placeholder="Buscar usuario..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    icon={<Search size={14} />}
                  />
                </div>
                <Button variant="primary" size="md" icon={<Users size={14} />}>
                  Nuevo usuario
                </Button>
              </div>

              {/* Role filter tabs */}
              <div style={{ display: 'flex', borderBottom: '1px solid var(--brand-border)', padding: '0 20px' }}>
                {roleFilterOptions.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setRoleFilter(value)}
                    style={{
                      padding: '12px 16px',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      fontSize: 13,
                      fontWeight: roleFilter === value ? 600 : 400,
                      color: roleFilter === value ? 'var(--brand-primary)' : 'var(--brand-slate)',
                      borderBottom: `2px solid ${roleFilter === value ? 'var(--brand-primary)' : 'transparent'}`,
                      transition: 'all 0.15s',
                      marginBottom: -1,
                    }}
                    aria-selected={roleFilter === value}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--brand-surface)' }}>
                    {['Usuario', 'Rol', 'Ciclo', 'Sesiones', 'Estado', 'Acciones'].map((col) => (
                      <th key={col} style={{ padding: '10px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--brand-slate-light)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--brand-border)' }}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((u, i) => (
                    <tr
                      key={u.id}
                      style={{
                        borderBottom: i < usersList.length - 1 ? '1px solid var(--brand-border)' : 'none',
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--brand-surface)')}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')}
                    >
                      <td style={{ padding: '12px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <Avatar initials={u.avatar} size={36} />
                          <div>
                            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--brand-dark)' }}>{u.name}</p>
                            <p style={{ margin: 0, fontSize: 11, color: 'var(--brand-slate-light)' }}>{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 20px' }}>
                        <Badge variant={u.role === 'mentor' ? 'info' : u.role === 'admin' ? 'primary' : 'default'}>
                          {u.role === 'aprendiz' ? 'Aprendiz' : u.role === 'mentor' ? 'Mentor' : 'Admin'}
                        </Badge>
                      </td>
                      <td style={{ padding: '12px 20px', fontSize: 13, color: 'var(--brand-slate)' }}>{u.cycle}</td>
                      <td style={{ padding: '12px 20px', fontSize: 13, color: 'var(--brand-slate)' }}>{u.sessions ?? 0}</td>
                      <td style={{ padding: '12px 20px' }}>
                        <Badge variant={u.status === 'active' ? 'success' : 'danger'} dot>
                          {u.status === 'active' ? 'Activo' : 'Suspendido'}
                        </Badge>
                      </td>
                      <td style={{ padding: '12px 20px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <Button variant="ghost" size="sm" icon={<Pencil size={12} />} aria-label={`Editar ${u.name}`} />
                          <Button
                            variant={u.status === 'active' ? 'danger' : 'success'}
                            size="sm"
                            onClick={() => toggleUserStatus(u.id, u.status ?? 'active')}
                            aria-label={u.status === 'active' ? `Suspender ${u.name}` : `Activar ${u.name}`}
                          >
                            {u.status === 'active' ? 'Suspender' : 'Activar'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div style={{ padding: '12px 20px', borderTop: '1px solid var(--brand-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: 'var(--brand-slate-light)' }}>
                  Mostrando 1–{usersList.length} de {total} usuarios
                </span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Button variant="ghost" size="sm">Anterior</Button>
                  <Button variant="ghost" size="sm">Siguiente</Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Right panel */}
          <div style={{ width: 320, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 20, position: 'sticky', top: 24 }}>
            {/* Pending approvals */}
            <Card padding={20}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <AlertCircle size={16} style={{ color: 'var(--brand-warning)' }} />
                <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--brand-dark)', fontFamily: 'var(--font-sora, Sora, sans-serif)' }}>
                  Aprobaciones Pendientes
                </h4>
                {approvals.length > 0 && (
                  <span style={{ marginLeft: 'auto', minWidth: 20, height: 20, borderRadius: 10, backgroundColor: 'var(--brand-warning)', color: 'white', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px' }}>
                    {approvals.length}
                  </span>
                )}
              </div>

              {approvals.length === 0 ? (
                <p style={{ fontSize: 13, color: 'var(--brand-slate-light)', textAlign: 'center', padding: '8px 0' }}>
                  Sin solicitudes pendientes
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {approvals.map(({ id, name, type, avatar }) => (
                    <div
                      key={id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '10px 12px',
                        borderRadius: 10,
                        backgroundColor: 'var(--brand-surface)',
                      }}
                    >
                      <Avatar initials={avatar} size={36} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: 'var(--brand-dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</p>
                        <p style={{ margin: 0, fontSize: 11, color: 'var(--brand-slate-light)' }}>{type}</p>
                      </div>
                      <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                        <button
                          onClick={() => handleApproval(id, true)}
                          style={{ width: 28, height: 28, borderRadius: 8, border: 'none', backgroundColor: '#D1FAE5', color: '#065F46', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          aria-label={`Aprobar solicitud de ${name}`}
                        >
                          <Check size={13} />
                        </button>
                        <button
                          onClick={() => handleApproval(id, false)}
                          style={{ width: 28, height: 28, borderRadius: 8, border: 'none', backgroundColor: '#FEE2E2', color: '#991B1B', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          aria-label={`Rechazar solicitud de ${name}`}
                        >
                          <X size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Sessions chart */}
            <Card padding={20}>
              <h4 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: 'var(--brand-dark)', fontFamily: 'var(--font-sora, Sora, sans-serif)' }}>
                Sesiones esta semana
              </h4>
              {stats?.sessionsThisWeek ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {stats.sessionsThisWeek.map(({ day, count }) => (
                    <div key={day} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 12, color: 'var(--brand-slate)', width: 28, flexShrink: 0 }}>{day}</span>
                      <div style={{ flex: 1, height: 20, backgroundColor: 'var(--brand-surface)', borderRadius: 6, overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${(count / maxWeekCount) * 100}%`,
                            background: `linear-gradient(90deg, var(--brand-primary) 0%, var(--brand-primary-light) 100%)`,
                            borderRadius: 6,
                            transition: 'width 0.6s ease',
                          }}
                        />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--brand-dark)', width: 24, textAlign: 'right', flexShrink: 0 }}>{count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: 13, color: 'var(--brand-slate-light)' }}>Cargando...</p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
