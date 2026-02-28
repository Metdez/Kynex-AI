import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockCampaigns } from '../data/mockCampaigns';
import StatusBadge from '../components/shared/StatusBadge';
import EmptyState from '../components/shared/EmptyState';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Plus, Facebook, Search, Megaphone } from 'lucide-react';

const tabs = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'paused', label: 'Paused' },
  { key: 'draft', label: 'Draft' },
  { key: 'completed', label: 'Completed' },
];

const channelIcons = {
  facebook: Facebook,
  instagram: Facebook,
  google: Search,
};

const channelLabels = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  google: 'Google Ads',
};

export default function CampaignsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  const filteredCampaigns = mockCampaigns.filter((c) => {
    if (activeTab === 'all') return true;
    return c.status === activeTab;
  });

  const getTabCount = (key) => {
    if (key === 'all') return mockCampaigns.length;
    return mockCampaigns.filter((c) => c.status === key).length;
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-slate-900">Campaigns</h1>
        <button
          onClick={() => navigate('/campaigns/new')}
          className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          New Campaign
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 mb-4 border-b border-slate-200">
        {tabs.map((tab) => (
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
            <span className="ml-1.5 text-xs text-slate-400">
              {getTabCount(tab.key)}
            </span>
          </button>
        ))}
      </div>

      {/* Campaign List */}
      {filteredCampaigns.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No campaigns found"
          description={`No ${activeTab} campaigns yet.`}
          actionLabel="Create Campaign"
          onAction={() => navigate('/campaigns/new')}
        />
      ) : (
        <div className="space-y-2">
          {filteredCampaigns.map((campaign) => {
            const ChannelIcon = channelIcons[campaign.channel] || Megaphone;
            return (
              <div
                key={campaign.id}
                onClick={() => navigate(`/campaigns/${campaign.id}`)}
                className="bg-white rounded-lg border border-slate-200 p-4 cursor-pointer hover:shadow-sm hover:border-slate-300 transition-all"
              >
                <div className="flex items-center gap-4">
                  {/* Channel Icon */}
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <ChannelIcon size={16} className="text-slate-500" />
                  </div>

                  {/* Name + Date */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-900 truncate">
                      {campaign.name}
                    </div>
                    <div className="text-xs text-slate-400">
                      {channelLabels[campaign.channel]} &middot;{' '}
                      {formatDate(campaign.startDate)}
                      {campaign.endDate
                        ? ` — ${formatDate(campaign.endDate)}`
                        : ' — Ongoing'}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <StatusBadge status={campaign.status} />

                  {/* Metrics */}
                  <div className="flex items-center gap-6 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-sm font-medium text-slate-900">
                        {formatCurrency(campaign.spend)}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wide">
                        Spend
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-slate-900">
                        {formatCurrency(campaign.cpl)}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wide">
                        CPL
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-slate-900">
                        {campaign.bookedCalls}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wide">
                        Booked
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600">
                        {campaign.roas}x
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wide">
                        ROAS
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
