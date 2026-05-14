import { ElementType } from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: ElementType;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ backgroundColor: 'var(--brand-surface)', border: '1px solid var(--brand-border)' }}
      >
        <Icon size={28} style={{ color: 'var(--brand-slate-light)' }} />
      </div>
      <h3
        className="text-base font-semibold mb-2"
        style={{ color: 'var(--brand-dark)', fontFamily: 'var(--font-sora, Sora, sans-serif)' }}
      >
        {title}
      </h3>
      <p className="text-sm mb-6 max-w-xs" style={{ color: 'var(--brand-slate)' }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
