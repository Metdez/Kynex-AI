import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { mockDashboard } from '../data/mockDashboard';
import MetricCard from '../components/shared/MetricCard';
import { formatCurrency } from '../utils/formatters';
import { DashboardSkeleton } from '../components/shared/LoadingSkeleton';
import {
  DollarSign,
  Eye,
  Target,
  TrendingUp,
  Briefcase,
  Sparkles,
  ArrowRight,
  Facebook,
  Search,
  Phone,
  MessageSquare,
} from 'lucide-react';

const kpiConfig = [
  { key: 'costPerBookedCall', label: 'Cost Per Booked Call', format: 'currency', icon: DollarSign, invertTrend: true },
  { key: 'showRate', label: 'Show Rate', format: 'percent', icon: Eye },
  { key: 'closeRate', label: 'Close Rate', format: 'percent', icon: Target },
  { key: 'monthlyRevenue', label: 'Revenue This Month', format: 'currency', icon: TrendingUp },
  { key: 'pipelineValue', label: 'Pipeline Value', format: 'compact', icon: Briefcase },
];

const channelIcons = { facebook: Facebook, google: Search, phone: Phone, message: MessageSquare };
const channelLinks = { 'Facebook/Instagram': '/campaigns', 'Google Ads': '/campaigns', 'Voice Agent': '/voice-agent', 'SMS/Email': '/sms-email' };

function AttributionJourney({ touchpoints }) {
  return (
    <div className="flex items-center flex-wrap gap-y-1">
      {touchpoints.map((tp, i) => (
        <span key={i} className="flex items-center">
          <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] rounded-full font-medium whitespace-nowrap">{tp}</span>
          {i < touchpoints.length - 1 && <ArrowRight size={10} className="text-slate-300 mx-0.5 flex-shrink-0" />}
        </span>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { kpis, channelPerformance, weeklySpendData, funnelData, aiBriefing, recentClosedDeals } = mockDashboard;

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 mb-4">Dashboard</h1>
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900 mb-4">Dashboard</h1>

      {/* Row 1: KPI Cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {kpiConfig.map(cfg => {
          const data = kpis[cfg.key];
          return (
            <MetricCard
              key={cfg.key}
              label={cfg.label}
              value={data.value}
              trend={data.trend}
              trendValue={data.trendValue}
              icon={cfg.icon}
              format={cfg.format}
              invertTrend={cfg.invertTrend}
            />
          );
        })}
      </div>

      {/* Row 2: Channel Performance Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {channelPerformance.map((ch, i) => {
          const Icon = channelIcons[ch.icon] || MessageSquare;
          return (
            <div
              key={i}
              onClick={() => navigate(channelLinks[ch.channel] || '/dashboard')}
              className="bg-white rounded-lg border border-slate-200 p-4 cursor-pointer hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center gap-2 mb-3">
                <Icon size={16} className="text-slate-500" />
                <span className="text-sm font-medium text-slate-900">{ch.channel}</span>
              </div>
              {ch.spend !== undefined && (
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-slate-500">Spend</span><span className="font-medium">{formatCurrency(ch.spend)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">CPL</span><span className="font-medium">{formatCurrency(ch.cpl)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Booked Calls</span><span className="font-medium">{ch.bookedCalls}</span></div>
                </div>
              )}
              {ch.callsMade !== undefined && (
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-slate-500">Calls Made</span><span className="font-medium">{ch.callsMade}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Answer Rate</span><span className="font-medium">{ch.answerRate}%</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Booking Rate</span><span className="font-medium">{ch.bookingRate}%</span></div>
                </div>
              )}
              {ch.messagesSent !== undefined && (
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-slate-500">Messages Sent</span><span className="font-medium">{ch.messagesSent.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Response Rate</span><span className="font-medium">{ch.responseRate}%</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Booking Rate</span><span className="font-medium">{ch.bookingRate}%</span></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Row 3: Funnel + AI Briefing */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="col-span-2 bg-white rounded-lg border border-slate-200 p-4">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">Pipeline Funnel</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={funnelData} layout="vertical" margin={{ left: 20, right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="stage" type="category" width={110} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value) => [value, 'Leads']} />
              <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4 border-l-4 border-l-blue-500">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-blue-600" />
            <h2 className="text-sm font-semibold text-slate-900">AI Weekly Briefing</h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">{aiBriefing}</p>
        </div>
      </div>

      {/* Row 4: Spend Chart + Attribution */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">Weekly Ad Spend</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weeklySpendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value, name) => [name === 'spend' ? formatCurrency(value) : value, name === 'spend' ? 'Spend' : 'Leads']} />
              <Line type="monotone" dataKey="spend" stroke="#2563eb" strokeWidth={2} dot={{ fill: '#2563eb', r: 3 }} />
              <Line type="monotone" dataKey="leads" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">Recent Closed Deals — Full Attribution</h2>
          <div className="space-y-3">
            {recentClosedDeals.map((deal, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-slate-900">{deal.contactName}</span>
                    <span className="text-xs font-medium text-green-700">{formatCurrency(deal.value)}</span>
                  </div>
                  <AttributionJourney touchpoints={deal.touchpoints} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
