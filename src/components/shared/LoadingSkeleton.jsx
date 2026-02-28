export function SkeletonCard({ height = 'h-24', className = '' }) {
  return <div className={`w-full ${height} bg-slate-100 rounded-lg border border-slate-200 animate-pulse ${className}`} />;
}

export function SkeletonLine({ width = 'w-full', height = 'h-4' }) {
  return <div className={`${width} ${height} bg-slate-200 rounded animate-pulse`} />;
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonCard key={i} height="h-24" />
        ))}
      </div>
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} height="h-32" />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-6">
        <SkeletonCard height="h-64" className="col-span-2" />
        <SkeletonCard height="h-64" />
      </div>
      <SkeletonCard height="h-40" />
    </div>
  );
}

export function CrmSkeleton() {
  return (
    <div className="flex gap-3 overflow-hidden">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="w-72 flex-shrink-0">
          <SkeletonCard height="h-10" />
          <div className="mt-2 space-y-2">
            {Array.from({ length: 3 }).map((_, j) => (
              <SkeletonCard key={j} height="h-20" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function CampaignDetailSkeleton() {
  return (
    <div className="space-y-4">
      <SkeletonCard height="h-20" />
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonLine key={i} width="w-20" height="h-8" />
        ))}
      </div>
      <SkeletonCard height="h-32" />
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} height="h-24" />
        ))}
      </div>
    </div>
  );
}
