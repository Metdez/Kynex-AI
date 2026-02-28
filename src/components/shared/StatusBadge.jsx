const colorMap = {
  active: 'bg-green-100 text-green-700',
  live: 'bg-green-100 text-green-700',
  booked: 'bg-green-100 text-green-700',
  connected: 'bg-green-100 text-green-700',
  confirmed: 'bg-green-100 text-green-700',

  paused: 'bg-amber-100 text-amber-700',
  pending: 'bg-amber-100 text-amber-700',
  interested: 'bg-amber-100 text-amber-700',

  draft: 'bg-slate-100 text-slate-600',
  archived: 'bg-slate-100 text-slate-600',
  disconnected: 'bg-slate-100 text-slate-600',
  no_answer: 'bg-slate-100 text-slate-500',

  completed: 'bg-blue-100 text-blue-600',

  urgent: 'bg-red-100 text-red-700',
  not_interested: 'bg-red-100 text-red-700',
  fatigued: 'bg-red-100 text-red-700',
  no_show: 'bg-red-100 text-red-700',
};

const sizeMap = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
};

export default function StatusBadge({ status, size = 'sm' }) {
  const colors = colorMap[status] || 'bg-slate-100 text-slate-600';
  const sizeClasses = sizeMap[size];
  const label = status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <span className={`inline-flex items-center rounded-full font-medium whitespace-nowrap ${colors} ${sizeClasses}`}>
      {label}
    </span>
  );
}
