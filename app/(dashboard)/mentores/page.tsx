'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, Users } from 'lucide-react';
import { Topbar } from '@/components/layout/Topbar';
import { MentorCard } from '@/components/features/MentorCard';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { StarRating } from '@/components/ui/StarRating';
import { useMentors } from '@/hooks/useMentors';
import type { Mentor } from '@/lib/types';

const specialties = [
  'Diseño UX/UI',
  'Desarrollo Web',
  'Marketing Digital',
  'Base de Datos',
  'Programación',
  'Gestión de Proyectos TI',
];

const sortOptions = [
  { value: 'rating', label: 'Por valoración' },
  { value: 'sessions', label: 'Por sesiones' },
  { value: 'available', label: 'Disponibles primero' },
];

export default function MentoresPage() {
  const { mentors, isLoading } = useMentors();
  const [search, setSearch] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [availability, setAvailability] = useState<'any' | 'now' | 'week'>('any');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('rating');

  const filtered = useMemo(() => {
    let result: Mentor[] = [...mentors];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.user?.name?.toLowerCase().includes(q) ||
          m.specialty.toLowerCase().includes(q) ||
          m.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selectedSpecialties.length > 0) {
      result = result.filter((m) => selectedSpecialties.includes(m.specialty));
    }

    if (availability === 'now') {
      result = result.filter((m) => m.available);
    }

    if (minRating > 0) {
      result = result.filter((m) => m.rating >= minRating);
    }

    if (sortBy === 'rating') {
      result = result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'sessions') {
      result = result.sort((a, b) => b.totalSessions - a.totalSessions);
    } else if (sortBy === 'available') {
      result = result.sort((a, b) => (b.available ? 1 : 0) - (a.available ? 1 : 0));
    }

    return result;
  }, [mentors, search, selectedSpecialties, availability, minRating, sortBy]);

  const toggleSpecialty = (s: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const clearFilters = () => {
    setSelectedSpecialties([]);
    setAvailability('any');
    setMinRating(0);
    setSearch('');
  };

  return (
    <>
      <Topbar title="Buscar Mentores" subtitle="Encuentra el mentor ideal para tu área de estudio" />
      <div style={{ padding: '32px 36px', flex: 1, display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        {/* Filter sidebar */}
        <Card padding={20} style={{ width: 240, flexShrink: 0, position: 'sticky', top: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Filter size={16} style={{ color: 'var(--brand-slate)' }} />
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--brand-dark)', fontFamily: 'var(--font-sora, Sora, sans-serif)' }}>
              Filtros
            </h3>
          </div>

          {/* Specialties */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 600, color: 'var(--brand-slate)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Especialidad
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {specialties.map((s) => (
                <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={selectedSpecialties.includes(s)}
                    onChange={() => toggleSpecialty(s)}
                    style={{ accentColor: 'var(--brand-primary)', width: 14, height: 14, cursor: 'pointer' }}
                    aria-label={`Filtrar por ${s}`}
                  />
                  <span style={{ fontSize: 13, color: 'var(--brand-slate)' }}>{s}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 600, color: 'var(--brand-slate)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Disponibilidad
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { value: 'now', label: 'Disponible ahora' },
                { value: 'week', label: 'Esta semana' },
                { value: 'any', label: 'Cualquier horario' },
              ].map(({ value, label }) => (
                <label key={value} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="availability"
                    value={value}
                    checked={availability === value}
                    onChange={() => setAvailability(value as 'any' | 'now' | 'week')}
                    style={{ accentColor: 'var(--brand-primary)', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: 13, color: 'var(--brand-slate)' }}>{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Min rating */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 600, color: 'var(--brand-slate)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Valoración mínima
            </p>
            <StarRating rating={minRating} size={20} interactive onChange={setMinRating} />
            {minRating > 0 && (
              <button
                onClick={() => setMinRating(0)}
                style={{ marginTop: 6, fontSize: 11, color: 'var(--brand-slate-light)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                Limpiar
              </button>
            )}
          </div>

          <Button variant="primary" size="md" style={{ width: '100%', marginBottom: 8 }} icon={<SlidersHorizontal size={14} />}>
            Aplicar filtros
          </Button>
          <button
            onClick={clearFilters}
            style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--brand-slate)', padding: '6px 0' }}
          >
            Limpiar filtros
          </button>
        </Card>

        {/* Results */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Search bar + sort */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1 }}>
              <Input
                placeholder="Buscar por nombre, especialidad o tecnología..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={<Search size={16} />}
              />
            </div>
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ width: 200 }}
            />
          </div>

          {/* Count */}
          <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--brand-slate)' }}>
            Mostrando <strong>{filtered.length}</strong> mentor{filtered.length !== 1 ? 'es' : ''}{' '}
            {filtered.length !== mentors.length && `(de ${mentors.length} totales)`}
          </p>

          {/* Grid */}
          {isLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <Card padding={0}>
              <EmptyState
                icon={Users}
                title="Sin resultados"
                description="No encontramos mentores con los filtros aplicados. Intenta con otros criterios de búsqueda."
                actionLabel="Limpiar filtros"
                onAction={clearFilters}
              />
            </Card>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {filtered.map((m) => <MentorCard key={m.userId} mentor={m} />)}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
