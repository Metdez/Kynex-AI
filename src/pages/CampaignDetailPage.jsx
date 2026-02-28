import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockCampaigns } from '../data/mockCampaigns';
import StatusBadge from '../components/shared/StatusBadge';
import MetricCard from '../components/shared/MetricCard';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useApp } from '../context/AppContext';
import { CampaignDetailSkeleton } from '../components/shared/LoadingSkeleton';
import {
  ArrowLeft,
  ArrowRight,
  Facebook,
  Search,
  Megaphone,
  DollarSign,
  Eye,
  Phone,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

const channelIcons = { facebook: Facebook, instagram: Facebook, google: Search };
const channelLabels = { facebook: 'Facebook', instagram: 'Instagram', google: 'Google Ads' };

const mockLandingPages = {
  lp1: {
    headline: "Austin's #1 Kitchen Remodeler",
    subheadline: '500+ Happy Homeowners. 5-Star Rated. Free Consultation.',
    cta: 'Book Your Free Design Consultation',
    conversionRate: 12.4,
    visitors: 3240,
    testimonial: '"Prestige transformed our 1990s kitchen into a modern masterpiece." — Sarah T.',
  },
  lp2: {
    headline: 'Luxury Bathroom Renovations in Austin',
    subheadline: 'Walk-in showers, custom vanities, and spa-like finishes.',
    cta: 'Get Your Free Bath Design',
    conversionRate: 10.8,
    visitors: 1850,
    testimonial: '"Our new bathroom feels like a five-star hotel." — Lisa P.',
  },
  lp3: {
    headline: 'Spring Remodel Special — 10% Off',
    subheadline: 'Book before March 31st and save on your dream kitchen or bath.',
    cta: 'Claim Your Spring Discount',
    conversionRate: 8.2,
    visitors: 980,
    testimonial: '"We saved over $3,000 with the spring promotion." — Andrew C.',
  },
  lp4: {
    headline: 'New Year, New Kitchen',
    subheadline: 'Start 2026 with the space you deserve.',
    cta: 'Book a Free Consultation',
    conversionRate: 9.1,
    visitors: 2100,
    testimonial: '"Best New Year resolution we ever made." — Tom & Jane R.',
  },
};

const tabDefs = [
  { key: 'overview', label: 'Overview' },
  { key: 'ads', label: 'Ads' },
  { key: 'audiences', label: 'Audiences' },
  { key: 'landing-page', label: 'Landing Page' },
  { key: 'attribution', label: 'Attribution' },
];

function TouchpointChain({ touchpoints }) {
  return (
    <div className="flex items-center flex-wrap gap-y-1">
      {touchpoints.map((tp, i) => (
        <span key={i} className="flex items-center">
          <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] rounded-full font-medium whitespace-nowrap">
            {tp}
          </span>
          {i < touchpoints.length - 1 && (
            <ArrowRight size={10} className="text-slate-300 mx-0.5 flex-shrink-0" />
          )}
        </span>
      ))}
    </div>
  );
}

export default function CampaignDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const { approvalCount, setApprovalCount } = useApp();

  const campaign = mockCampaigns.find((c) => c.id === id);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const sendToApprovalQueue = (msg) => {
    setApprovalCount(approvalCount + 1);
    showToast(msg);
  };

  if (!campaign) {
    return (
      <div className="text-center py-16">
        <p className="text-lg font-medium text-slate-700 mb-2">Campaign not found</p>
        <button
          onClick={() => navigate('/campaigns')}
          className="text-sm text-blue-600 hover:underline"
        >
          Back to Campaigns
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <button onClick={() => navigate('/campaigns')} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-4">
          <ArrowLeft size={14} /> Back to Campaigns
        </button>
        <CampaignDetailSkeleton />
      </div>
    );
  }

  const ChannelIcon = channelIcons[campaign.channel] || Megaphone;
  const avgCtr =
    campaign.adVariations.length > 0
      ? (campaign.adVariations.reduce((sum, ad) => sum + ad.ctr, 0) / campaign.adVariations.length).toFixed(1)
      : 0;
  const budgetPercent = Math.min(100, Math.round((campaign.spend / campaign.totalBudget) * 100));
  const lp = mockLandingPages[campaign.landingPageId] || mockLandingPages.lp1;

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={() => navigate('/campaigns')}
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-3 transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Campaigns
      </button>

      {/* Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 mb-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-semibold text-slate-900">{campaign.name}</h1>
              <StatusBadge status={campaign.status} />
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <ChannelIcon size={14} />
                {channelLabels[campaign.channel]}
              </span>
              <span>
                {formatDate(campaign.startDate)}
                {campaign.endDate ? ` — ${formatDate(campaign.endDate)}` : ' — Ongoing'}
              </span>
              <span>Total Spend: {formatCurrency(campaign.spend)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 mb-4 border-b border-slate-200">
        {tabDefs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.key
                ? 'text-blue-600 border-blue-600'
                : 'text-slate-500 border-transparent hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Strategy */}
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-blue-600" />
              <h3 className="text-sm font-semibold text-slate-900">Campaign Strategy</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{campaign.strategy}</p>
          </div>

          {/* Budget Progress */}
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-900">Budget</h3>
              <span className="text-sm text-slate-500">
                {formatCurrency(campaign.spend)} of {formatCurrency(campaign.totalBudget)}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full">
              <div
                className={`h-2 rounded-full transition-all ${budgetPercent > 90 ? 'bg-amber-500' : 'bg-blue-600'}`}
                style={{ width: `${budgetPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-slate-400">{budgetPercent}% spent</span>
              <span className="text-xs text-slate-400">
                {formatCurrency(campaign.dailyBudget)}/day
              </span>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-4">
            <MetricCard label="Cost Per Lead" value={campaign.cpl} format="currency" icon={DollarSign} trend="down" trendValue="-5%" invertTrend />
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <Eye size={18} className="text-slate-400" />
                <div className="flex items-center gap-1 text-xs font-medium text-green-600">
                  <TrendingUp size={14} />
                  <span>+0.3%</span>
                </div>
              </div>
              <div className="text-2xl font-semibold text-slate-900">{avgCtr}%</div>
              <div className="text-xs text-slate-500 uppercase tracking-wide mt-1">Avg CTR</div>
            </div>
            <MetricCard label="Booked Calls" value={campaign.bookedCalls} format="number" icon={Phone} trend="up" trendValue="+8" />
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp size={18} className="text-slate-400" />
                <div className="flex items-center gap-1 text-xs font-medium text-green-600">
                  <TrendingUp size={14} />
                  <span>+1.2</span>
                </div>
              </div>
              <div className="text-2xl font-semibold text-slate-900">{campaign.roas}x</div>
              <div className="text-xs text-slate-500 uppercase tracking-wide mt-1">ROAS</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ads' && (
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {campaign.adVariations.map((ad) => (
              <div key={ad.id} className="bg-white rounded-lg border border-slate-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <StatusBadge status={ad.status} />
                  {ad.status === 'fatigued' && (
                    <div className="flex items-center gap-1 text-xs text-red-600 font-medium">
                      <AlertTriangle size={12} />
                      Creative Fatigue
                    </div>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">{ad.headline}</h3>
                <p className="text-xs text-slate-600 mb-3 line-clamp-3">{ad.body}</p>
                <div className="text-xs font-medium text-blue-600 mb-3">{ad.cta}</div>
                <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-100 pt-3">
                  <div>
                    <span className="text-slate-400">CTR </span>
                    <span className="font-medium text-slate-700">{ad.ctr}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400">CPL </span>
                    <span className="font-medium text-slate-700">{formatCurrency(ad.cpl)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Impressions </span>
                    <span className="font-medium text-slate-700">{ad.impressions.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Spend </span>
                    <span className="font-medium text-slate-700">{formatCurrency(ad.spend)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => sendToApprovalQueue('Sent to Approval Queue')}
            className="mt-4 flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Sparkles size={16} />
            Request New Creative
          </button>
        </div>
      )}

      {activeTab === 'audiences' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-500 uppercase tracking-wide">Name</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-500 uppercase tracking-wide">Type</th>
                  <th className="text-right px-4 py-2.5 text-xs font-medium text-slate-500 uppercase tracking-wide">Size</th>
                  <th className="text-right px-4 py-2.5 text-xs font-medium text-slate-500 uppercase tracking-wide">CPL</th>
                  <th className="text-right px-4 py-2.5 text-xs font-medium text-slate-500 uppercase tracking-wide">Booked</th>
                </tr>
              </thead>
              <tbody>
                {campaign.audiences.map((aud) => (
                  <tr key={aud.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-3 font-medium text-slate-900">{aud.name}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 capitalize">
                        {aud.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600">
                      {aud.size ? aud.size.toLocaleString() : '—'}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600">
                      {formatCurrency(aud.cpl)}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600">{aud.bookedCalls}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Exclusion Lists</h3>
            <p className="text-sm text-slate-500">
              Existing customers, past leads marked as &ldquo;Do Not Contact&rdquo;, competitors
            </p>
          </div>
        </div>
      )}

      {activeTab === 'landing-page' && (
        <div className="grid grid-cols-3 gap-4">
          {/* Preview */}
          <div className="col-span-2 bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-center text-white">
              <h2 className="text-2xl font-bold mb-2">{lp.headline}</h2>
              <p className="text-blue-100 mb-4">{lp.subheadline}</p>
              <span className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg text-sm cursor-default">
                {lp.cta}
              </span>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-200">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Social Proof</p>
              <p className="text-sm text-slate-600 text-center">
                Trusted by 500+ Austin homeowners
              </p>
            </div>
            <div className="p-6 text-center">
              <p className="text-sm text-slate-600 italic">{lp.testimonial}</p>
            </div>
          </div>

          {/* Metrics Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="text-2xl font-semibold text-slate-900">{lp.conversionRate}%</div>
              <div className="text-xs text-slate-500 uppercase tracking-wide mt-1">
                Conversion Rate
              </div>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="text-2xl font-semibold text-slate-900">
                {lp.visitors.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500 uppercase tracking-wide mt-1">
                Total Visitors
              </div>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="text-2xl font-semibold text-slate-900">
                {Math.round(lp.visitors * (lp.conversionRate / 100))}
              </div>
              <div className="text-xs text-slate-500 uppercase tracking-wide mt-1">
                Conversions
              </div>
            </div>
            <button
              onClick={() => navigate(`/landing-pages/${campaign.landingPageId}`)}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <ExternalLink size={14} />
              Edit Page
            </button>
          </div>
        </div>
      )}

      {activeTab === 'attribution' && (
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Lead Attribution Journeys</h3>
          {campaign.attributionJourneys.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">
              No attribution data available for this campaign.
            </p>
          ) : (
            <div className="space-y-4">
              {campaign.attributionJourneys.map((journey, i) => (
                <div key={i} className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-sm font-medium text-slate-900">{journey.contactName}</span>
                      <span className="text-xs font-medium text-green-700 bg-green-50 px-1.5 py-0.5 rounded">
                        {formatCurrency(journey.value)}
                      </span>
                    </div>
                    <TouchpointChain touchpoints={journey.touchpoints} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
