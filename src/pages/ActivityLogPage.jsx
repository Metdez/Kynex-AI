import { useState } from 'react';
import { Search, Megaphone, Phone, MessageSquare, Mail, Filter, Clock } from 'lucide-react';
import { mockActivityLog } from '../data/mockActivityLog';
import { formatRelativeTime, formatDate, formatTime } from '../utils/formatters';

const agentIcons = {
  ads: Megaphone,
  voice: Phone,
  sms: MessageSquare,
  email: Mail,
};

const agentColors = {
  ads: { bg: 'bg-purple-100', text: 'text-purple-700' },
  voice: { bg: 'bg-blue-100', text: 'text-blue-600' },
  sms: { bg: 'bg-green-100', text: 'text-green-700' },
  email: { bg: 'bg-amber-100', text: 'text-amber-700' },
};

const outcomeColors = {
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  info: 'bg-blue-100 text-blue-600',
};

export default function ActivityLogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [agentFilter, setAgentFilter] = useState('All');
  const [approvalFilter, setApprovalFilter] = useState('All');
  const [visibleCount, setVisibleCount] = useState(15);

  const sorted = [...mockActivityLog].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const filtered = sorted
    .filter(entry => {
      if (agentFilter !== 'All' && entry.agent !== agentFilter.toLowerCase()) return false;
      if (approvalFilter === 'Approved' && !entry.requiresApproval) return false;
      if (approvalFilter === 'Auto-executed' && entry.requiresApproval) return false;
      if (searchQuery && !entry.action.toLowerCase().includes(searchQuery.toLowerCase()) && !entry.parameters.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });

  const visible = filtered.slice(0, visibleCount);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Activity Log</h1>
        <span className="text-xs text-slate-500">{filtered.length} entries</span>
      </div>

      {/* Search + Filters */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search actions..."
            className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={agentFilter}
          onChange={e => setAgentFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Agents</option>
          <option value="ads">Ads Agent</option>
          <option value="voice">Voice Agent</option>
          <option value="sms">SMS Agent</option>
          <option value="email">Email Agent</option>
        </select>

        <select
          value={approvalFilter}
          onChange={e => setApprovalFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Actions</option>
          <option value="Approved">Required Approval</option>
          <option value="Auto-executed">Auto-executed</option>
        </select>
      </div>

      {/* Activity Feed */}
      <div className="space-y-1">
        {visible.map(entry => {
          const Icon = agentIcons[entry.agent] || Filter;
          const colors = agentColors[entry.agent] || agentColors.ads;
          const outcomeColor = outcomeColors[entry.outcome] || outcomeColors.info;

          return (
            <ActivityEntry key={entry.id} entry={entry} Icon={Icon} colors={colors} outcomeColor={outcomeColor} />
          );
        })}
      </div>

      {visibleCount < filtered.length && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setVisibleCount(v => v + 15)}
            className="px-4 py-2 text-sm font-medium border border-slate-200 rounded-md text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Load More ({filtered.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
}

function ActivityEntry({ entry, Icon, colors, outcomeColor }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="bg-white rounded-lg border border-slate-200 px-4 py-3 hover:border-slate-300 cursor-pointer transition-colors"
    >
      <div className="flex items-start gap-3">
        {/* Agent icon */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${colors.bg}`}>
          <Icon size={14} className={colors.text} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors.bg} ${colors.text}`}>
              {entry.agent.charAt(0).toUpperCase() + entry.agent.slice(1)}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${outcomeColor}`}>
              {entry.outcome.charAt(0).toUpperCase() + entry.outcome.slice(1)}
            </span>
            {entry.requiresApproval && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 font-medium border border-amber-200">
                Required Approval
              </span>
            )}
            {!entry.requiresApproval && (
              <span className="text-xs text-slate-400">Auto-executed</span>
            )}
          </div>
          <p className="text-sm text-slate-900 leading-snug">{entry.action}</p>
          {expanded && (
            <div className="mt-2 bg-slate-50 rounded-md px-3 py-2">
              <p className="text-xs text-slate-600">{entry.parameters}</p>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <div className="text-right shrink-0">
          <div className="text-xs text-slate-400">{formatRelativeTime(entry.timestamp)}</div>
          <div className="text-xs text-slate-300">{formatDate(entry.timestamp)}</div>
        </div>
      </div>
    </div>
  );
}
