import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatCurrency, formatPercent, formatCompactNumber } from '../../utils/formatters';

const formatValue = (value, format) => {
  switch (format) {
    case 'currency': return formatCurrency(value);
    case 'percent': return formatPercent(value);
    case 'compact': return formatCompactNumber(value);
    default: return value.toLocaleString();
  }
};

export default function MetricCard({ label, value, trend, trendValue, icon: Icon, format = 'number', invertTrend = false }) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  // invertTrend: for metrics where "down" is good (like cost), flip the color
  const isPositive = invertTrend ? trend === 'down' : trend === 'up';
  const trendColor = trend === 'flat'
    ? 'text-slate-400'
    : isPositive
      ? 'text-green-600'
      : 'text-red-600';

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-2">
        {Icon && <Icon size={18} className="text-slate-400" />}
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
            <TrendIcon size={14} />
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      <div className="text-2xl font-semibold text-slate-900">{formatValue(value, format)}</div>
      <div className="text-xs text-slate-500 uppercase tracking-wide mt-1">{label}</div>
    </div>
  );
}
