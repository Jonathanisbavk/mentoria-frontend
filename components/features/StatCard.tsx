import { ElementType } from 'react';
import { Card } from '@/components/ui/Card';

interface StatCardProps {
  icon: ElementType;
  label: string;
  value: string | number;
  iconColor?: string;
  trend?: string;
}

export function StatCard({ icon: Icon, label, value, iconColor = 'var(--brand-primary)', trend }: StatCardProps) {
  return (
    <Card padding={20} className="flex-1">
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundColor: `${iconColor}18`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon size={20} style={{ color: iconColor }} />
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 12, color: 'var(--brand-slate)', marginBottom: 4 }}>{label}</p>
          <p
            style={{
              margin: 0,
              fontSize: 24,
              fontWeight: 800,
              color: 'var(--brand-dark)',
              fontFamily: 'var(--font-sora, Sora, sans-serif)',
              lineHeight: 1,
            }}
          >
            {value}
          </p>
          {trend && (
            <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--brand-success)' }}>{trend}</p>
          )}
        </div>
      </div>
    </Card>
  );
}
