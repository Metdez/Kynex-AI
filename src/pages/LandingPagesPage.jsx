import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, MousePointerClick, ArrowUpRight } from 'lucide-react';
import StatusBadge from '../components/shared/StatusBadge';

const filterTabs = ['Live', 'Draft', 'Split Testing', 'Archived', 'All'];

const mockLandingPages = [
  {
    id: 'lp1',
    name: 'Kitchen Remodel — Main',
    campaign: 'Kitchen Remodel Facebook',
    status: 'live',
    conversionRate: 12.4,
    traffic: 3842,
    headline: 'Transform Your Kitchen Into the Heart of Your Home',
    color: 'bg-blue-600',
  },
  {
    id: 'lp2',
    name: 'Bath Renovation — Main',
    campaign: 'Bath Renovation Instagram',
    status: 'live',
    conversionRate: 9.8,
    traffic: 2156,
    headline: 'Your Dream Bathroom Awaits',
    color: 'bg-emerald-600',
  },
  {
    id: 'lp3',
    name: 'Kitchen Remodel — Variant B',
    campaign: 'Kitchen Remodel Facebook',
    status: 'live',
    conversionRate: 14.2,
    traffic: 1920,
    headline: 'Austin\'s #1 Kitchen Remodeling Company',
    color: 'bg-violet-600',
  },
  {
    id: 'lp4',
    name: 'Spring Promo Landing Page',
    campaign: 'Spring Promo',
    status: 'archived',
    conversionRate: 8.1,
    traffic: 4530,
    headline: 'Spring Special: 10% Off All Remodels',
    color: 'bg-amber-600',
  },
  {
    id: 'lp5',
    name: 'Google Search — Remodel',
    campaign: 'Google Search — Remodel',
    status: 'live',
    conversionRate: 18.6,
    traffic: 1245,
    headline: 'Get a Free 3D Kitchen Design Preview',
    color: 'bg-red-600',
  },
  {
    id: 'lp6',
    name: 'New Design — Social Proof',
    campaign: 'Kitchen Remodel Facebook',
    status: 'draft',
    conversionRate: 0,
    traffic: 0,
    headline: 'See Why 500+ Austin Families Trust Prestige',
    color: 'bg-slate-600',
  },
];

export default function LandingPagesPage() {
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  const statusMap = { 'Live': 'live', 'Draft': 'draft', 'Split Testing': 'live', 'Archived': 'archived' };
  const filtered = filter === 'All'
    ? mockLandingPages
    : mockLandingPages.filter(p => p.status === statusMap[filter]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Landing Pages</h1>
        <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          <Plus size={16} />
          New Page
        </button>
      </div>

      <div className="flex gap-1 mb-6">
        {filterTabs.map(tab => {
          const count = tab === 'All' ? mockLandingPages.length : mockLandingPages.filter(p => p.status === statusMap[tab]).length;
          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === tab ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab} ({count})
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {filtered.map(page => (
          <div
            key={page.id}
            onClick={() => navigate(`/landing-pages/${page.id}`)}
            className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:border-slate-300 hover:shadow-sm cursor-pointer transition-all group"
          >
            {/* Thumbnail mock */}
            <div className={`${page.color} h-36 p-4 flex flex-col justify-between relative`}>
              <div className="absolute inset-0 bg-black/10" />
              <div className="relative z-10">
                <div className="w-16 h-1.5 bg-white/40 rounded mb-1" />
                <div className="w-10 h-1.5 bg-white/30 rounded" />
              </div>
              <div className="relative z-10">
                <h3 className="text-white font-semibold text-sm leading-tight">{page.headline}</h3>
                <div className="mt-2 w-20 h-6 bg-white/90 rounded text-xs flex items-center justify-center font-medium text-slate-900">
                  Get Started
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{page.name}</h3>
                <StatusBadge status={page.status} />
              </div>
              <p className="text-xs text-slate-500 mb-3">{page.campaign}</p>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MousePointerClick size={12} />
                  <span className="font-medium text-slate-700">{page.conversionRate}%</span> CVR
                </span>
                <span className="flex items-center gap-1">
                  <Eye size={12} />
                  <span className="font-medium text-slate-700">{page.traffic.toLocaleString()}</span> visits
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
