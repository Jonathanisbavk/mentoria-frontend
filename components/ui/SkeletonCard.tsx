export function SkeletonCard() {
  return (
    <div
      className="bg-white border rounded-2xl p-6"
      style={{ borderColor: 'var(--brand-border)' }}
      aria-hidden="true"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="skeleton rounded-full" style={{ width: 48, height: 48 }} />
        <div className="flex flex-col gap-2 flex-1">
          <div className="skeleton h-4 rounded" style={{ width: '60%' }} />
          <div className="skeleton h-3 rounded" style={{ width: '40%' }} />
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        <div className="skeleton h-5 rounded-full" style={{ width: 60 }} />
        <div className="skeleton h-5 rounded-full" style={{ width: 70 }} />
        <div className="skeleton h-5 rounded-full" style={{ width: 55 }} />
      </div>
      <div className="flex flex-col gap-2 mb-4">
        <div className="skeleton h-3 rounded" style={{ width: '100%' }} />
        <div className="skeleton h-3 rounded" style={{ width: '80%' }} />
      </div>
      <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--brand-border)' }}>
        <div className="skeleton h-3 rounded" style={{ width: 80 }} />
        <div className="skeleton h-8 rounded-[10px]" style={{ width: 100 }} />
      </div>
    </div>
  );
}
