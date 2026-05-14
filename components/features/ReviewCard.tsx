import type { Review } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { StarRating } from '@/components/ui/StarRating';
import { formatDate } from '@/lib/utils';

interface ReviewCardProps {
  review: Review;
}

const criteria = [
  { key: 'clarity', label: 'Claridad' },
  { key: 'knowledge', label: 'Dominio' },
  { key: 'punctuality', label: 'Puntualidad' },
  { key: 'helpfulness', label: 'Utilidad' },
] as const;

export function ReviewCard({ review }: ReviewCardProps) {
  const mentor = review.mentor;
  const apprentice = review.apprentice;

  return (
    <Card padding={20}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
        <Avatar initials={mentor?.avatar || 'ME'} size={44} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4
            style={{
              margin: 0,
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--brand-dark)',
              fontFamily: 'var(--font-sora, Sora, sans-serif)',
            }}
          >
            {mentor?.name || 'Mentor'}
          </h4>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--brand-slate)' }}>
            {mentor?.role === 'mentor' ? 'Mentor' : 'Especialidad'}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <StarRating rating={review.rating} size={13} />
            <span style={{ fontSize: 11, color: 'var(--brand-slate-light)' }}>
              {formatDate(review.date, 'dd MMM yyyy')} · por {apprentice?.name?.split(' ')[0] || 'Aprendiz'}
            </span>
          </div>
        </div>
      </div>

      {review.comment && (
        <p style={{ margin: '0 0 12px', fontSize: 13, color: 'var(--brand-slate)', lineHeight: 1.6 }}>
          &ldquo;{review.comment}&rdquo;
        </p>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '6px 16px',
          padding: 12,
          borderRadius: 10,
          backgroundColor: 'var(--brand-surface)',
        }}
      >
        {criteria.map(({ key, label }) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <span style={{ fontSize: 11, color: 'var(--brand-slate)' }}>{label}</span>
            <StarRating rating={review[key]} size={10} />
          </div>
        ))}
      </div>
    </Card>
  );
}
